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

    // Enrich with completed ticket count for progress calculation
    const enriched = await Promise.all(
      activeEpics.map(async (epic) => {
        const tickets = await ctx.db
          .query("tickets")
          .withIndex("by_epic", (q) => q.eq("epicId", epic._id))
          .collect()
        const activeTickets = tickets.filter((t) => !t.isDeleted)
        const completedTickets = activeTickets.filter((t) => t.status === "completed" || t.status === "review")
        return {
          ...epic,
          completedTicketCount: completedTickets.length,
        }
      }),
    )
    return enriched
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
