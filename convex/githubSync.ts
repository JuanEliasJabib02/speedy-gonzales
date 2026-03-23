import { v } from "convex/values"
import { mutation, internalAction, internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"
import { requireAuth } from "./helpers"
import { throwError, ErrorCodes } from "./errors"
import type { Id } from "./_generated/dataModel"
import { getGitProvider } from "./model/providers"
import { groupFilesIntoEpics } from "./model/groupFiles"
import { parsePlan, parseCommits } from "./model/parsePlan"
import type { GitProviderConfig, GitProviderType } from "./model/gitProvider"

export const syncProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const userId = await requireAuth(ctx)
    const project = await ctx.db.get(projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN)
    await ctx.scheduler.runAfter(0, internal.githubSync.syncRepoInternal, { projectId })
  },
})

// Force-reset a stuck sync and re-trigger
export const forceResync = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireAuth(ctx)
    await ctx.db.patch(projectId, { syncStatus: "idle", syncStartedAt: undefined, updatedAt: Date.now() })
    await ctx.scheduler.runAfter(0, internal.githubSync.syncRepoInternal, { projectId })
  },
})

const CRON_COOLDOWN_MS = 15 * 60 * 1000 // 15 minutes

export const syncAllProjects = internalAction({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.runQuery(internal.projects.getAllActiveProjects)
    const now = Date.now()

    const stale = projects.filter((p) => !p.lastSyncAt || now - p.lastSyncAt >= CRON_COOLDOWN_MS)
    console.log(`[cron-sync] ${stale.length}/${projects.length} projects need sync (cooldown ${CRON_COOLDOWN_MS / 60000}m)`)

    for (const project of stale) {
      await ctx.scheduler.runAfter(0, internal.githubSync.syncRepoInternal, { projectId: project._id })
      console.log(`[cron-sync] Scheduled sync for ${project.repoOwner}/${project.repoName}`)
    }
  },
})

export const syncRepoInternal = internalAction({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    // Atomic guard: claim lock in a single mutation to prevent race conditions
    const { claimed } = await ctx.runMutation(internal.githubSync.claimSyncLock, { projectId })
    if (!claimed) {
      console.log("[sync] Skipped — already syncing (lock not claimed)")
      return
    }

    const project = await ctx.runQuery(internal.projects.getProjectInternal, { projectId })
    if (!project) throw new Error("Project not found")
    console.log(`[sync] Starting sync for ${project.repoOwner}/${project.repoName}`)

    try {
      const accessToken = process.env.GITHUB_PAT
      if (!accessToken) throw new Error("GITHUB_PAT env var not set")
      console.log(`[sync] Fetching tree from GitHub (branch: ${project.branch}, plansPath: ${project.plansPath})`)

      const config: GitProviderConfig = {
        provider: project.gitProvider as GitProviderType,
        accessToken,
        owner: project.repoOwner,
        repo: project.repoName,
        branch: project.branch,
      }

      const provider = getGitProvider(config.provider)

      // Fetch file tree
      const allFiles = await provider.fetchTree(config)
      const plansFiles = allFiles.filter((f) => f.path.startsWith(project.plansPath))
      console.log(`[sync] Found ${allFiles.length} total files, ${plansFiles.length} in plansPath`)

      // Group into epics
      const epicGroups = groupFilesIntoEpics(plansFiles, project.plansPath)
      console.log(`[sync] Grouped into ${epicGroups.size} epics: ${[...epicGroups.keys()].join(", ")}`)

      // Get existing epics and tickets for hash comparison
      const existingEpics = await ctx.runQuery(internal.epics.getByProjectInternal, { projectId })
      const existingTickets = await ctx.runQuery(internal.tickets.getByProjectInternal, { projectId })

      const existingEpicsByPath = new Map(existingEpics.map((e) => [e.path, e]))
      const existingTicketsByPath = new Map(existingTickets.map((t) => [t.path, t]))

      // Fetch content and parse — only for changed files
      type EpicData = {
        path: string
        sha: string
        content: string
        parsed: ReturnType<typeof parsePlan>
        tickets: Array<{
          path: string
          sha: string
          content: string
          parsed: ReturnType<typeof parsePlan>
          commits: string[]
          agentName?: string
        }>
      }

      const epicsData: EpicData[] = []
      let sortOrder = 0

      for (const [epicDir, files] of epicGroups) {
        const epicData: EpicData = {
          path: epicDir,
          sha: "",
          content: "",
          parsed: { title: epicDir.split("/").pop() ?? "Untitled", status: "todo", priority: "medium", body: "", checklistTotal: 0, checklistCompleted: 0 },
          tickets: [],
        }

        // Fetch _context.md
        if (files.context) {
          const existing = existingEpicsByPath.get(epicDir)
          if (existing && existing.contentHash === files.context.sha) {
            // No change, reuse existing data
            epicData.sha = files.context.sha
            epicData.content = existing.content
            epicData.parsed = {
              title: existing.title,
              status: existing.status,
              priority: existing.priority,
              body: existing.content,
              checklistTotal: existing.checklistTotal,
              checklistCompleted: existing.checklistCompleted,
            }
          } else {
            // Fetch new content
            const content = await provider.fetchFileContent(config, files.context.path)
            epicData.sha = files.context.sha
            epicData.content = content
            epicData.parsed = parsePlan(content)
          }
        }

        // Fetch ticket files
        const sortedTickets = files.tickets.sort((a, b) => a.path.localeCompare(b.path))
        let ticketOrder = 0
        for (const ticketFile of sortedTickets) {
          const existingTicket = existingTicketsByPath.get(ticketFile.path)
          if (existingTicket && existingTicket.contentHash === ticketFile.sha) {
            console.log("[sync] CACHE HIT:", ticketFile.path, "| status in DB:", existingTicket.status)
            epicData.tickets.push({
              path: ticketFile.path,
              sha: ticketFile.sha,
              content: existingTicket.content,
              parsed: {
                title: existingTicket.title,
                status: existingTicket.status,
                priority: existingTicket.priority,
                body: existingTicket.content,
                checklistTotal: existingTicket.checklistTotal,
                checklistCompleted: existingTicket.checklistCompleted,
                agentName: existingTicket.agentName,
                blockedReason: existingTicket.blockedReason,
              },
              commits: existingTicket.commits ?? [],
              agentName: existingTicket.agentName,
            })
          } else {
            const content = await provider.fetchFileContent(config, ticketFile.path)
            const parsed = parsePlan(content)
            const commits = parseCommits(parsed.body)
            console.log("[sync] PARSED:", ticketFile.path, "| status:", parsed.status)
            epicData.tickets.push({
              path: ticketFile.path,
              sha: ticketFile.sha,
              content,
              parsed,
              commits,
              agentName: parsed.agentName,
            })
          }
          ticketOrder++
        }

        epicsData.push(epicData)
        sortOrder++
      }

      // Upsert all data atomically
      await ctx.runMutation(internal.githubSync.upsertPlans, {
        projectId,
        epics: epicsData.map((e, i) => ({
          path: e.path,
          contentHash: e.sha,
          title: e.parsed.title,
          content: e.parsed.body,
          status: e.parsed.status,
          priority: e.parsed.priority,
          checklistTotal: e.parsed.checklistTotal,
          checklistCompleted: e.parsed.checklistCompleted,
          ticketCount: e.tickets.length,
          sortOrder: i,
          tickets: e.tickets.map((t, j) => ({
            path: t.path,
            contentHash: t.sha,
            title: t.parsed.title,
            content: t.parsed.body,
            status: t.parsed.status,
            priority: t.parsed.priority,
            checklistTotal: t.parsed.checklistTotal,
            checklistCompleted: t.parsed.checklistCompleted,
            commits: t.commits,
            sortOrder: j,
            agentName: t.agentName,
            blockedReason: t.parsed.blockedReason,
          })),
        })),
      })

      // Release lock with success
      await ctx.runMutation(internal.githubSync.releaseSyncLock, {
        projectId,
        status: "idle",
        lastSyncAt: Date.now(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error"
      await ctx.runMutation(internal.githubSync.releaseSyncLock, {
        projectId,
        status: "error",
        syncError: message,
      })
    }
  },
})

export const upsertPlans = internalMutation({
  args: {
    projectId: v.id("projects"),
    epics: v.array(
      v.object({
        path: v.string(),
        contentHash: v.string(),
        title: v.string(),
        content: v.string(),
        status: v.string(),
        priority: v.string(),
        checklistTotal: v.number(),
        checklistCompleted: v.number(),
        ticketCount: v.number(),
        sortOrder: v.number(),
        tickets: v.array(
          v.object({
            path: v.string(),
            contentHash: v.string(),
            title: v.string(),
            content: v.string(),
            status: v.string(),
            priority: v.string(),
            checklistTotal: v.number(),
            checklistCompleted: v.number(),
            commits: v.array(v.string()),
            sortOrder: v.number(),
            agentName: v.optional(v.string()),
            blockedReason: v.optional(v.string()),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, { projectId, epics }) => {
    const activePaths = new Set<string>()
    const activeTicketPaths = new Set<string>()

    for (const epicData of epics) {
      activePaths.add(epicData.path)

      // Find or create epic
      const existing = await ctx.db
        .query("epics")
        .withIndex("by_project_path", (q) => q.eq("projectId", projectId).eq("path", epicData.path))
        .first()

      let epicId: Id<"epics">

      if (existing) {
        const contentChanged = existing.contentHash !== epicData.contentHash
        const countChanged = existing.ticketCount !== epicData.ticketCount
        const orderChanged = existing.sortOrder !== epicData.sortOrder
        const wasDeleted = existing.isDeleted

        if (contentChanged || countChanged || orderChanged || wasDeleted) {
          await ctx.db.patch(existing._id, {
            title: epicData.title,
            content: epicData.content,
            contentHash: epicData.contentHash,
            status: epicData.status,
            priority: epicData.priority,
            checklistTotal: epicData.checklistTotal,
            checklistCompleted: epicData.checklistCompleted,
            ticketCount: epicData.ticketCount,
            sortOrder: epicData.sortOrder,
            isDeleted: false,
          })
        }
        epicId = existing._id
      } else {
        epicId = await ctx.db.insert("epics", {
          projectId,
          title: epicData.title,
          path: epicData.path,
          content: epicData.content,
          contentHash: epicData.contentHash,
          status: epicData.status,
          priority: epicData.priority,
          checklistTotal: epicData.checklistTotal,
          checklistCompleted: epicData.checklistCompleted,
          ticketCount: epicData.ticketCount,
          sortOrder: epicData.sortOrder,
          isDeleted: false,
        })
      }

      // Upsert tickets
      for (const ticketData of epicData.tickets) {
        activeTicketPaths.add(ticketData.path)

        const existingTicket = await ctx.db
          .query("tickets")
          .withIndex("by_project_path", (q) => q.eq("projectId", projectId).eq("path", ticketData.path))
          .first()

        if (existingTicket) {
          const contentChanged = existingTicket.contentHash !== ticketData.contentHash
          const movedEpic = existingTicket.epicId !== epicId
          const orderChanged = existingTicket.sortOrder !== ticketData.sortOrder
          const wasDeleted = existingTicket.isDeleted
          const commitsChanged = JSON.stringify(existingTicket.commits ?? []) !== JSON.stringify(ticketData.commits)

          if (contentChanged || movedEpic || orderChanged || wasDeleted || commitsChanged) {
            const meaningfulChange = contentChanged || movedEpic || wasDeleted || commitsChanged
            await ctx.db.patch(existingTicket._id, {
              epicId,
              title: ticketData.title,
              content: ticketData.content,
              contentHash: ticketData.contentHash,
              status: ticketData.status,
              priority: ticketData.priority,
              checklistTotal: ticketData.checklistTotal,
              checklistCompleted: ticketData.checklistCompleted,
              commits: ticketData.commits.length > 0 ? ticketData.commits : undefined,
              sortOrder: ticketData.sortOrder,
              isDeleted: false,
              ...(meaningfulChange ? { updatedAt: Date.now() } : {}),
              agentName: ticketData.agentName,
              blockedReason: ticketData.blockedReason,
            })
          }
        } else {
          await ctx.db.insert("tickets", {
            projectId,
            epicId,
            title: ticketData.title,
            path: ticketData.path,
            content: ticketData.content,
            contentHash: ticketData.contentHash,
            status: ticketData.status,
            priority: ticketData.priority,
            checklistTotal: ticketData.checklistTotal,
            checklistCompleted: ticketData.checklistCompleted,
            commits: ticketData.commits.length > 0 ? ticketData.commits : undefined,
            sortOrder: ticketData.sortOrder,
            isDeleted: false,
            updatedAt: Date.now(),
            agentName: ticketData.agentName,
            blockedReason: ticketData.blockedReason,
          })
        }
      }

      // Recalculate completed ticket count — only patch when changed
      const completedTicketCount = epicData.tickets.filter(
        (t) => t.status === "completed" || t.status === "review"
      ).length
      const currentEpicDoc = await ctx.db.get(epicId)
      if (currentEpicDoc && currentEpicDoc.completedTicketCount !== completedTicketCount) {
        await ctx.db.patch(epicId, { completedTicketCount })
      }

      // Auto-promote epic to review when all tickets are done
      const allDone = epicData.tickets.length > 0 &&
        epicData.tickets.every((t) => t.status === "completed" || t.status === "review")

      if (allDone) {
        const currentEpic = await ctx.db.get(epicId)
        if (currentEpic && currentEpic.status !== "review" && currentEpic.status !== "completed") {
          await ctx.db.patch(epicId, { status: "review" })
        }
      }
    }

    // Soft-delete epics no longer in repo
    const allEpics = await ctx.db
      .query("epics")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()

    for (const epic of allEpics) {
      if (!activePaths.has(epic.path) && !epic.isDeleted) {
        await ctx.db.patch(epic._id, { isDeleted: true })
      }
    }

    // Soft-delete tickets no longer in repo
    const allTickets = await ctx.db
      .query("tickets")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()

    for (const ticket of allTickets) {
      if (!activeTicketPaths.has(ticket.path) && !ticket.isDeleted) {
        await ctx.db.patch(ticket._id, { isDeleted: true })
      }
    }
  },
})

const STALE_LOCK_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export const claimSyncLock = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId)
    if (!project) return { claimed: false }

    const now = Date.now()

    if (project.syncStatus === "syncing") {
      const startedAt = project.syncStartedAt ?? 0
      const isStale = now - startedAt > STALE_LOCK_TIMEOUT_MS
      if (!isStale) return { claimed: false }
      console.log(`[sync] Reclaiming stale lock (started ${Math.round((now - startedAt) / 1000)}s ago)`)
    }

    await ctx.db.patch(projectId, {
      syncStatus: "syncing",
      syncStartedAt: now,
      syncError: undefined,
      updatedAt: now,
    })
    return { claimed: true }
  },
})

export const releaseSyncLock = internalMutation({
  args: {
    projectId: v.id("projects"),
    status: v.string(),
    syncError: v.optional(v.string()),
    lastSyncAt: v.optional(v.number()),
  },
  handler: async (ctx, { projectId, status, syncError, lastSyncAt }) => {
    const updates: Record<string, unknown> = {
      syncStatus: status,
      syncStartedAt: undefined,
      updatedAt: Date.now(),
    }
    if (syncError !== undefined) updates.syncError = syncError
    if (lastSyncAt !== undefined) updates.lastSyncAt = lastSyncAt
    if (status !== "error") updates.syncError = undefined

    await ctx.db.patch(projectId, updates)
  },
})

export const updateSyncStatus = internalMutation({
  args: {
    projectId: v.id("projects"),
    status: v.string(),
    syncError: v.optional(v.string()),
    lastSyncAt: v.optional(v.number()),
  },
  handler: async (ctx, { projectId, status, syncError, lastSyncAt }) => {
    const updates: Record<string, unknown> = {
      syncStatus: status,
      updatedAt: Date.now(),
    }
    if (syncError !== undefined) updates.syncError = syncError
    if (lastSyncAt !== undefined) updates.lastSyncAt = lastSyncAt
    if (status !== "error") updates.syncError = undefined

    await ctx.db.patch(projectId, updates)
  },
})

export const registerWebhook = internalAction({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.runQuery(internal.projects.getProjectInternal, { projectId })
    if (!project) throw new Error("Project not found")

    const accessToken = process.env.GITHUB_PAT
    if (!accessToken) throw new Error("GITHUB_PAT env var not set")

    const config: GitProviderConfig = {
      provider: project.gitProvider as GitProviderType,
      accessToken,
      owner: project.repoOwner,
      repo: project.repoName,
      branch: project.branch,
    }

    // Generate random secret
    const secretBytes = new Uint8Array(32)
    crypto.getRandomValues(secretBytes)
    const secret = Array.from(secretBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    const provider = getGitProvider(config.provider)
    const convexUrl = process.env.CONVEX_SITE_URL
    if (!convexUrl) throw new Error("CONVEX_SITE_URL not set")

    const webhookUrl = `${convexUrl}/github-webhook`

    try {
      const webhookId = await provider.registerWebhook(config, webhookUrl, secret)

      await ctx.runMutation(internal.githubSync.storeWebhookInfo, {
        projectId,
        webhookId,
        webhookSecret: secret,
      })
    } catch (error) {
      // Webhook registration is non-critical for MVP — PAT might not have admin:repo_hook scope
      console.error("Failed to register webhook:", error)
    }
  },
})

export const storeWebhookInfo = internalMutation({
  args: {
    projectId: v.id("projects"),
    webhookId: v.string(),
    webhookSecret: v.string(),
  },
  handler: async (ctx, { projectId, webhookId, webhookSecret }) => {
    await ctx.db.patch(projectId, { webhookId, webhookSecret })
  },
})

// Pushes a status change directly to GitHub by patching the .md file via GitHub API
export const pushTicketStatusToGitHub = internalAction({
  args: {
    ticketId: v.id("tickets"),
    newStatus: v.string(),
  },
  handler: async (ctx, { ticketId, newStatus }) => {
    const ticket = await ctx.runQuery(internal.tickets.getTicketInternal, { ticketId })
    if (!ticket) return

    const project = await ctx.runQuery(internal.projects.getProjectInternal, {
      projectId: ticket.projectId,
    })
    if (!project) return

    const accessToken = process.env.GITHUB_PAT
    if (!accessToken) {
      console.error("[git-status-push] GITHUB_PAT not set")
      return
    }

    const { repoOwner, repoName, branch } = project

    // 1. Get current file content + SHA from GitHub
    const fileRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${ticket.path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    )

    if (!fileRes.ok) {
      console.error(`[git-status-push] Failed to fetch file: ${ticket.path}`, await fileRes.text())
      return
    }

    const fileData = await fileRes.json()
    const currentContent = atob(fileData.content.replace(/\n/g, ""))
    const fileSha = fileData.sha

    // 2. Replace **Status:** line
    const updatedContent = currentContent.replace(
      /\*\*Status:\*\*\s*\S+/,
      `**Status:** ${newStatus}`
    )

    if (updatedContent === currentContent) {
      console.log(`[git-status-push] No status change needed in ${ticket.path}`)
      return
    }

    // 3. Commit the change via GitHub API
    const encodedContent = btoa(unescape(encodeURIComponent(updatedContent)))

    const updateRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${ticket.path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `chore(tickets): mark ${ticket.title} as ${newStatus}`,
          content: encodedContent,
          sha: fileSha,
          branch,
        }),
      }
    )

    if (!updateRes.ok) {
      console.error(`[git-status-push] Failed to commit status: ${ticket.path}`, await updateRes.text())
      return
    }

    console.log(`[git-status-push] ✅ ${ticket.path} → ${newStatus}`)
  },
})

export const pushEpicStatusToGitHub = internalAction({
  args: {
    epicId: v.id("epics"),
    newStatus: v.string(),
  },
  handler: async (ctx, { epicId, newStatus }) => {
    const epic = await ctx.runQuery(internal.epics.getEpicInternal, { epicId })
    if (!epic) return

    const project = await ctx.runQuery(internal.projects.getProjectInternal, {
      projectId: epic.projectId,
    })
    if (!project) return

    const accessToken = process.env.GITHUB_PAT
    if (!accessToken) {
      console.error("[git-epic-push] GITHUB_PAT not set")
      return
    }

    const { repoOwner, repoName, branch } = project
    const filePath = `${epic.path}/_context.md`

    const fileRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    )

    if (!fileRes.ok) {
      console.error(`[git-epic-push] Failed to fetch: ${filePath}`, await fileRes.text())
      return
    }

    const fileData = await fileRes.json()
    const currentContent = atob(fileData.content.replace(/\n/g, ""))
    const fileSha = fileData.sha

    const updatedContent = currentContent.replace(
      /\*\*Status:\*\*\s*\S+/,
      `**Status:** ${newStatus}`
    )

    if (updatedContent === currentContent) return

    const encodedContent = btoa(unescape(encodeURIComponent(updatedContent)))

    const updateRes = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `chore(plans): auto-promote ${epic.title} to ${newStatus}`,
          content: encodedContent,
          sha: fileSha,
          branch,
        }),
      }
    )

    if (!updateRes.ok) {
      console.error(`[git-epic-push] Failed to commit: ${filePath}`, await updateRes.text())
      return
    }

    console.log(`[git-epic-push] ✅ ${filePath} → ${newStatus}`)
  },
})
