import { v } from "convex/values"
import { query, mutation, internalQuery } from "./_generated/server"
import { requireAuth, assertValidStatus } from "./helpers"
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
    status: v.string(),
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
