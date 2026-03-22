import { v } from "convex/values"
import { query, mutation, internalQuery } from "./_generated/server"
import { requireAuth } from "./helpers"
import { throwError, ErrorCodes } from "./errors"

export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireAuth(ctx)
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
    await requireAuth(ctx)
    const epic = await ctx.db.get(epicId)
    if (!epic || epic.isDeleted) return null
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
    await requireAuth(ctx)
    const epic = await ctx.db.get(epicId)
    if (!epic || epic.isDeleted) return throwError(ErrorCodes.NOT_FOUND)

    const allowed = ALLOWED_TRANSITIONS[epic.status]
    if (!allowed || !allowed.includes(status)) {
      return throwError(ErrorCodes.BAD_REQUEST)
    }

    await ctx.db.patch(epicId, { status })
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
