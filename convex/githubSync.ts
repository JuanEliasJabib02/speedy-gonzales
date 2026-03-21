import { v } from "convex/values"
import { action, internalAction, internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"
import { getGitProvider } from "./model/providers"
import { groupFilesIntoEpics } from "./model/groupFiles"
import { parsePlan } from "./model/parsePlan"
import type { GitProviderConfig, GitProviderType } from "./model/gitProvider"

export const syncProject = action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await ctx.scheduler.runAfter(0, internal.githubSync.syncRepoInternal, { projectId })
  },
})

export const syncRepoInternal = internalAction({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    // Guard: skip if already syncing to prevent race conditions
    const project = await ctx.runQuery(internal.projects.getProjectInternal, { projectId })
    if (!project) throw new Error("Project not found")
    if (project.syncStatus === "syncing") return

    // Set syncing status
    await ctx.runMutation(internal.githubSync.updateSyncStatus, {
      projectId,
      status: "syncing",
    })

    try {
      const accessToken = process.env.GITHUB_PAT
      if (!accessToken) throw new Error("GITHUB_PAT env var not set")

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

      // Group into epics
      const epicGroups = groupFilesIntoEpics(plansFiles, project.plansPath)

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
              },
            })
          } else {
            const content = await provider.fetchFileContent(config, ticketFile.path)
            epicData.tickets.push({
              path: ticketFile.path,
              sha: ticketFile.sha,
              content,
              parsed: parsePlan(content),
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
            sortOrder: j,
          })),
        })),
      })

      // Set idle status
      await ctx.runMutation(internal.githubSync.updateSyncStatus, {
        projectId,
        status: "idle",
        lastSyncAt: Date.now(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error"
      await ctx.runMutation(internal.githubSync.updateSyncStatus, {
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
            sortOrder: v.number(),
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

          if (contentChanged || movedEpic || orderChanged || wasDeleted) {
            await ctx.db.patch(existingTicket._id, {
              epicId,
              title: ticketData.title,
              content: ticketData.content,
              contentHash: ticketData.contentHash,
              status: ticketData.status,
              priority: ticketData.priority,
              checklistTotal: ticketData.checklistTotal,
              checklistCompleted: ticketData.checklistCompleted,
              sortOrder: ticketData.sortOrder,
              isDeleted: false,
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
            sortOrder: ticketData.sortOrder,
            isDeleted: false,
          })
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
