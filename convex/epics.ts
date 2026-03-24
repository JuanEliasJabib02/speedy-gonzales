import { v } from "convex/values"
import { query, mutation, internalQuery, internalMutation } from "./_generated/server"
import { requireAuth, assertValidStatus, statusValidator, priorityValidator } from "./helpers"
import type { TicketStatus } from "./helpers"
import { throwError, ErrorCodes } from "./errors"
import { deriveEpicStatus } from "./lib/epicStatusEngine"
import type { MutationCtx } from "./_generated/server"
import type { Doc } from "./_generated/dataModel"

// Helper function to create a GitHub PR when epic moves to review
async function createPullRequestForEpic(
  ctx: MutationCtx,
  epic: Doc<"epics">,
  project: Doc<"projects">
): Promise<string> {
  const githubPat = process.env.GITHUB_PAT
  if (!githubPat) {
    throw new Error("GITHUB_PAT environment variable not configured")
  }

  // Extract epic slug from path (e.g., "plans/features/auth" -> "auth")
  const epicSlug = epic.path.split("/").pop() || "feature"

  // Generate branch name using project's branch prefix
  const branchName = `${project.branchPrefix || "feat/"}${epicSlug}`

  // Create the pull request
  const response = await fetch(`https://api.github.com/repos/${project.repoOwner}/${project.repoName}/pulls`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${githubPat}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: epic.title,
      head: branchName,
      base: project.branch || "main",
      body: `Auto-created PR for feature: ${epic.title}\n\nThis PR was automatically created when the feature moved to review status.\n\n---\n\n${epic.content.slice(0, 500)}${epic.content.length > 500 ? "..." : ""}`,
      draft: false,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`GitHub API error ${response.status}: ${errorData.message || "Failed to create PR"}`)
  }

  const prData = await response.json()
  return prData.html_url as string
}

export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const userId = await requireAuth(ctx)
    const project = await ctx.db.get(projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never
    const epics = await ctx.db
      .query("epics")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()
    const activeEpics = epics.filter((e) => !e.isDeleted)
    return activeEpics.map((epic) => ({
      ...epic,
      completedTicketCount: epic.completedTicketCount ?? 0,
    }))
  },
})

export const getEpic = query({
  args: { epicId: v.id("epics") },
  handler: async (ctx, { epicId }) => {
    const userId = await requireAuth(ctx)
    const epic = await ctx.db.get(epicId)
    if (!epic || epic.isDeleted) return null
    const project = await ctx.db.get(epic.projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never
    return epic
  },
})

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  todo: ["in-progress"],
  blocked: ["in-progress"],
  "in-progress": ["todo"],
  review: ["completed"],
}

export const updateStatus = mutation({
  args: {
    epicId: v.id("epics"),
    status: statusValidator,
    completionType: v.optional(v.union(v.literal("clean"), v.literal("with-fixes"))),
  },
  handler: async (ctx, { epicId, status, completionType }) => {
    assertValidStatus(status)
    const userId = await requireAuth(ctx)
    const epic = await ctx.db.get(epicId)
    if (!epic || epic.isDeleted) return throwError(ErrorCodes.NOT_FOUND)
    const project = await ctx.db.get(epic.projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never

    const allowed = ALLOWED_TRANSITIONS[epic.status]
    if (!allowed || !allowed.includes(status)) {
      return throwError(ErrorCodes.BAD_REQUEST)
    }

    const patch: Record<string, unknown> = { status }
    if (completionType) patch.completionType = completionType
    if (status === "completed") patch.completedAt = Date.now()

    // Auto-create PR when moving to review status
    if (status === "review" && epic.status !== "review" && !epic.prUrl) {
      try {
        const prUrl = await createPullRequestForEpic(ctx, epic, project)
        await ctx.db.patch(epicId, { ...patch, prUrl })
      } catch (error) {
        console.error("Failed to create PR for epic:", epicId, error)
        await ctx.db.patch(epicId, patch)
      }
    } else {
      await ctx.db.patch(epicId, patch)
    }
  },
})

export const promoteToTodo = mutation({
  args: {
    epicId: v.id("epics"),
  },
  handler: async (ctx, { epicId }) => {
    const userId = await requireAuth(ctx)
    const epic = await ctx.db.get(epicId)
    if (!epic || epic.isDeleted) return throwError(ErrorCodes.NOT_FOUND)
    const project = await ctx.db.get(epic.projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never

    if (epic.status !== "backlog") {
      return throwError(ErrorCodes.BAD_REQUEST)
    }

    await ctx.db.patch(epicId, { status: "todo" as TicketStatus })

    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_epic", (q) => q.eq("epicId", epicId))
      .collect()

    for (const ticket of tickets) {
      if (!ticket.isDeleted && ticket.status === "backlog") {
        await ctx.db.patch(ticket._id, { status: "todo" as TicketStatus })
      }
    }
  },
})

export const setPrUrl = mutation({
  args: {
    epicId: v.id("epics"),
    prUrl: v.string(),
  },
  handler: async (ctx, { epicId, prUrl }) => {
    const userId = await requireAuth(ctx)
    const epic = await ctx.db.get(epicId)
    if (!epic || epic.isDeleted) return throwError(ErrorCodes.NOT_FOUND)
    const project = await ctx.db.get(epic.projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never

    await ctx.db.patch(epicId, { prUrl })
  },
})

export const setPrUrlInternal = internalMutation({
  args: {
    epicId: v.id("epics"),
    prUrl: v.string(),
  },
  handler: async (ctx, { epicId, prUrl }) => {
    const epic = await ctx.db.get(epicId)
    if (!epic) throw new Error("Epic not found")

    await ctx.db.patch(epicId, { prUrl, updatedAt: Date.now() })
    return epicId
  },
})

export const deleteEpic = mutation({
  args: {
    epicId: v.id("epics"),
  },
  handler: async (ctx, { epicId }) => {
    const userId = await requireAuth(ctx)
    const epic = await ctx.db.get(epicId)
    if (!epic || epic.isDeleted) return throwError(ErrorCodes.NOT_FOUND)
    const project = await ctx.db.get(epic.projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never

    // Mark epic as deleted
    await ctx.db.patch(epicId, { isDeleted: true, updatedAt: Date.now() })

    // Get all tickets for this epic
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_epic", (q) => q.eq("epicId", epicId))
      .collect()

    // Mark all tickets as deleted
    let deletedCount = 0
    for (const ticket of tickets) {
      if (!ticket.isDeleted) {
        await ctx.db.patch(ticket._id, { isDeleted: true, updatedAt: Date.now() })
        deletedCount++
      }
    }

    return { deletedTickets: deletedCount }
  },
})

export const getEpicInternal = internalQuery({
  args: { epicId: v.id("epics") },
  handler: async (ctx, { epicId }) => {
    return ctx.db.get(epicId)
  },
})

export const getByProjectInternal = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    return ctx.db
      .query("epics")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()
  },
})

export const getByProjectPathInternal = internalQuery({
  args: { projectId: v.id("projects"), path: v.string() },
  handler: async (ctx, { projectId, path }) => {
    return ctx.db
      .query("epics")
      .withIndex("by_project_path", (q) => q.eq("projectId", projectId).eq("path", path))
      .first()
  },
})

export const createEpicInternal = internalMutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    path: v.string(),
    content: v.string(),
    contentHash: v.string(),
    status: statusValidator,
    priority: priorityValidator,
    checklistTotal: v.number(),
    checklistCompleted: v.number(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("epics", {
      ...args,
      ticketCount: 0,
      completedTicketCount: 0,
      isDeleted: false,
      updatedAt: Date.now(),
    })
  },
})

export const updateEpicInternal = internalMutation({
  args: {
    epicId: v.id("epics"),
    content: v.optional(v.string()),
    contentHash: v.optional(v.string()),
    title: v.optional(v.string()),
    priority: v.optional(priorityValidator),
    checklistTotal: v.optional(v.number()),
    checklistCompleted: v.optional(v.number()),
  },
  handler: async (ctx, { epicId, ...patch }) => {
    const epic = await ctx.db.get(epicId)
    if (!epic) throw new Error("Epic not found")
    const updates: Record<string, unknown> = { updatedAt: Date.now() }
    if (patch.content !== undefined) updates.content = patch.content
    if (patch.contentHash !== undefined) updates.contentHash = patch.contentHash
    if (patch.title !== undefined) updates.title = patch.title
    if (patch.priority !== undefined) updates.priority = patch.priority
    if (patch.checklistTotal !== undefined) updates.checklistTotal = patch.checklistTotal
    if (patch.checklistCompleted !== undefined) updates.checklistCompleted = patch.checklistCompleted
    await ctx.db.patch(epicId, updates)
    return epicId
  },
})

export const deleteEpicInternal = internalMutation({
  args: { epicId: v.id("epics") },
  handler: async (ctx, { epicId }) => {
    const epic = await ctx.db.get(epicId)
    if (!epic) throw new Error("Epic not found")

    // Mark epic as deleted
    await ctx.db.patch(epicId, { isDeleted: true, updatedAt: Date.now() })

    // Get all tickets for this epic
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_epic", (q) => q.eq("epicId", epicId))
      .collect()

    // Mark all tickets as deleted
    let deletedCount = 0
    for (const ticket of tickets) {
      if (!ticket.isDeleted) {
        await ctx.db.patch(ticket._id, { isDeleted: true, updatedAt: Date.now() })
        deletedCount++
      }
    }

    return deletedCount
  },
})

export const recalculateBacklogEpicStatuses = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all non-deleted epics
    const allEpics = await ctx.db
      .query("epics")
      .collect()

    const activeEpics = allEpics.filter((e) => !e.isDeleted)
    let updatedCount = 0

    for (const epic of activeEpics) {
      // Get all tickets for this epic
      const allTickets = await ctx.db
        .query("tickets")
        .withIndex("by_epic", (q) => q.eq("epicId", epic._id))
        .collect()

      const activeTickets = allTickets.filter((t) => !t.isDeleted)

      // Check if this epic has any backlog tickets
      const hasBacklogTickets = activeTickets.some((t) => t.status === "backlog")

      if (hasBacklogTickets) {
        // Recalculate the epic status using the new engine
        const newStatus = deriveEpicStatus(activeTickets.map((t) => t.status as TicketStatus))

        // Only update if the status actually changed
        if (newStatus !== epic.status) {
          await ctx.db.patch(epic._id, {
            status: newStatus,
            updatedAt: Date.now(),
          })
          updatedCount++
        }
      }
    }

    return { message: `Updated ${updatedCount} epics with backlog tickets to correct status` }
  },
})
