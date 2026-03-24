import { v } from "convex/values"
import { query, mutation, internalQuery, internalMutation } from "./_generated/server"
import { requireAuth, assertValidStatus, statusValidator, priorityValidator } from "./helpers"
import { throwError, ErrorCodes } from "./errors"

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
  },
  handler: async (ctx, { epicId, status }) => {
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

    await ctx.db.patch(epicId, { status })
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
