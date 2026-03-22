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

    // Update denormalized completed ticket count + auto-promote epic
    const ticket = await ctx.db.get(ticketId)
    if (ticket) {
      const allTickets = await ctx.db
        .query("tickets")
        .withIndex("by_epic", (q) => q.eq("epicId", ticket.epicId))
        .collect()
      const activeTickets = allTickets.filter((t) => !t.isDeleted)
      const completedCount = activeTickets.filter((t) => t.status === "completed" || t.status === "review").length

      const epicPatch: Record<string, unknown> = { completedTicketCount: completedCount }

      // Auto-promote epic to review when all tickets are completed
      if (status === "completed") {
        const allCompleted = activeTickets.every((t) => t.status === "completed")
        if (allCompleted && activeTickets.length > 0) {
          const epic = await ctx.db.get(ticket.epicId)
          if (epic && epic.status !== "review" && epic.status !== "completed") {
            epicPatch.status = "review"
            await ctx.scheduler.runAfter(0, internal.githubSync.pushEpicStatusToGitHub, {
              epicId: ticket.epicId,
              newStatus: "review",
            })
          }
        }
      }

      await ctx.db.patch(ticket.epicId, epicPatch)
    }
  },
})

export const getTicketInternal = internalQuery({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, { ticketId }) => {
    return ctx.db.get(ticketId)
  },
})

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export const getTodoTicketsByProject = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()
    return tickets
      .filter((t) => t.status === "todo" && !t.isDeleted)
      .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4))
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
