import { v } from "convex/values"
import { query, mutation, internalQuery } from "./_generated/server"
import { internal } from "./_generated/api"
import { requireAuth } from "./helpers"

export const getByEpic = query({
  args: { epicId: v.id("epics") },
  handler: async (ctx, { epicId }) => {
    await requireAuth(ctx)
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_epic", (q) => q.eq("epicId", epicId))
      .collect()
    return tickets.filter((t) => !t.isDeleted)
  },
})

export const updateStatus = mutation({
  args: {
    ticketId: v.id("tickets"),
    status: v.string(),
    blockedReason: v.optional(v.string()),
  },
  handler: async (ctx, { ticketId, status, blockedReason }) => {
    await requireAuth(ctx)
    const patch: Record<string, unknown> = { status }
    if (status === "blocked") {
      patch.blockedReason = blockedReason ?? undefined
    } else {
      patch.blockedReason = undefined
    }
    await ctx.db.patch(ticketId, patch)

    // Async: push status change to GitHub so the .md file stays in sync
    await ctx.scheduler.runAfter(0, internal.githubSync.pushTicketStatusToGitHub, {
      ticketId,
      newStatus: status,
    })
  },
})

export const getTicketInternal = internalQuery({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, { ticketId }) => {
    return ctx.db.get(ticketId)
  },
})

export const getByProjectInternal = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    return ctx.db
      .query("tickets")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()
  },
})
