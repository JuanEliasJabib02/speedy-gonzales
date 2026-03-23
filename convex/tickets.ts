import { v } from "convex/values"
import { query, mutation, internalQuery, internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"
import type { Doc } from "./_generated/dataModel"
import { requireAuth, assertValidStatus, statusValidator } from "./helpers"
import { throwError, ErrorCodes } from "./errors"

export const getByEpic = query({
  args: { epicId: v.id("epics") },
  handler: async (ctx, { epicId }) => {
    const userId = await requireAuth(ctx)
    const epic = await ctx.db.get(epicId)
    if (!epic) return []
    const project = await ctx.db.get(epic.projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never
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
    status: statusValidator,
    blockedReason: v.optional(v.string()),
    completionType: v.optional(v.union(v.literal("clean"), v.literal("with-fixes"))),
  },
  handler: async (ctx, { ticketId, status, blockedReason, completionType }) => {
    assertValidStatus(status)
    const userId = await requireAuth(ctx)
    const ticket = await ctx.db.get(ticketId)
    if (!ticket) return throwError(ErrorCodes.NOT_FOUND) as never
    const project = await ctx.db.get(ticket.projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never
    const now = Date.now()
    const patch: Record<string, unknown> = { status }
    if (status === "in-progress") patch.startedAt = now
    if (status === "review") patch.reviewAt = now
    if (status === "completed") {
      patch.completedAt = now
      if (completionType) patch.completionType = completionType
    }
    if (status === "blocked") {
      patch.blockedAt = now
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
    const updatedTicket = await ctx.db.get(ticketId)
    if (updatedTicket) {
      const allTickets = await ctx.db
        .query("tickets")
        .withIndex("by_epic", (q) => q.eq("epicId", updatedTicket.epicId))
        .collect()
      const activeTickets = allTickets.filter((t) => !t.isDeleted)
      const completedCount = activeTickets.filter((t) => t.status === "completed" || t.status === "review").length

      const epicPatch: Partial<Doc<"epics">> = { completedTicketCount: completedCount }

      // Auto-promote epic to review when all tickets are done (completed or review)
      if (status === "completed" || status === "review") {
        const allDone = activeTickets.every((t) => t.status === "completed" || t.status === "review")
        if (allDone && activeTickets.length > 0) {
          const epic = await ctx.db.get(updatedTicket.epicId)
          if (epic && epic.status !== "review" && epic.status !== "completed") {
            epicPatch.status = "review"
            await ctx.scheduler.runAfter(0, internal.githubSync.pushEpicStatusToGitHub, {
              epicId: updatedTicket.epicId,
              newStatus: "review",
            })
          }
        }
      }

      await ctx.db.patch(updatedTicket.epicId, epicPatch)
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

export const getByProjectPath = internalQuery({
  args: { projectId: v.id("projects"), path: v.string() },
  handler: async (ctx, { projectId, path }) => {
    return ctx.db
      .query("tickets")
      .withIndex("by_project_path", (q) => q.eq("projectId", projectId).eq("path", path))
      .first()
  },
})

export const updateStatusInternal = internalMutation({
  args: {
    ticketId: v.id("tickets"),
    status: statusValidator,
    blockedReason: v.optional(v.string()),
  },
  handler: async (ctx, { ticketId, status, blockedReason }) => {
    assertValidStatus(status)
    const ticket = await ctx.db.get(ticketId)
    if (!ticket) throw new Error("Ticket not found")

    const previousStatus = ticket.status

    const now = Date.now()
    const patch: Record<string, unknown> = { status }
    if (status === "in-progress") patch.startedAt = now
    if (status === "review") patch.reviewAt = now
    if (status === "completed") patch.completedAt = now
    if (status === "blocked") {
      patch.blockedAt = now
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
    const allTickets = await ctx.db
      .query("tickets")
      .withIndex("by_epic", (q) => q.eq("epicId", ticket.epicId))
      .collect()
    const activeTickets = allTickets.filter((t) => !t.isDeleted)
    const completedCount = activeTickets.filter(
      (t) => t.status === "completed" || t.status === "review"
    ).length

    const epicPatch: Partial<Doc<"epics">> = { completedTicketCount: completedCount }

    if (status === "completed" || status === "review") {
      const allDone = activeTickets.every((t) => t.status === "completed" || t.status === "review")
      if (allDone && activeTickets.length > 0) {
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

    return { ticketId, previousStatus, newStatus: status }
  },
})
