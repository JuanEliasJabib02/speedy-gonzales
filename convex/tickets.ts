import { v } from "convex/values"
import { query, mutation, internalQuery, internalMutation } from "./_generated/server"
import { requireAuth, assertValidStatus, statusValidator } from "./helpers"
import type { TicketStatus } from "./helpers"
import { throwError, ErrorCodes } from "./errors"
import { deriveEpicStatus } from "./lib/epicStatusEngine"

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

    // Recalculate epic status from all sibling tickets
    const updatedTicket = await ctx.db.get(ticketId)
    if (updatedTicket) {
      const allTickets = await ctx.db
        .query("tickets")
        .withIndex("by_epic", (q) => q.eq("epicId", updatedTicket.epicId))
        .collect()
      const activeTickets = allTickets.filter((t) => !t.isDeleted)
      const completedCount = activeTickets.filter((t) => t.status === "completed" || t.status === "review").length
      const checklistCompleted = activeTickets.reduce((sum, t) => sum + t.checklistCompleted, 0)
      const derivedStatus = deriveEpicStatus(activeTickets.map((t) => t.status as TicketStatus))

      await ctx.db.patch(updatedTicket.epicId, {
        completedTicketCount: completedCount,
        checklistCompleted,
        status: derivedStatus,
        updatedAt: Date.now(),
      })
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
    commits: v.optional(v.array(v.string())),
    checklistCompleted: v.optional(v.number()),
    checklistTotal: v.optional(v.number()),
  },
  handler: async (ctx, { ticketId, status, blockedReason, commits, checklistCompleted, checklistTotal }) => {
    assertValidStatus(status)
    const ticket = await ctx.db.get(ticketId)
    if (!ticket) throw new Error("Ticket not found")

    // Validate checklist: completed must be ≤ total
    if (checklistCompleted != null && checklistTotal != null && checklistCompleted > checklistTotal) {
      throw new Error("checklistCompleted must be ≤ checklistTotal")
    }

    const previousStatus = ticket.status

    const now = Date.now()
    const patch: Record<string, unknown> = { status }

    // Timestamp fields based on status transitions
    if (status === "in-progress") patch.startedAt = now
    if (status === "review") patch.reviewAt = now
    if (status === "completed") patch.completedAt = now
    if (status === "blocked") {
      patch.blockedAt = now
      patch.blockedReason = blockedReason ?? undefined
    } else {
      // Clear blocked fields when moving OUT of blocked
      patch.blockedAt = undefined
      patch.blockedReason = undefined
    }

    // Merge commits (append, don't replace)
    if (commits && commits.length > 0) {
      const existing = ticket.commits ?? []
      patch.commits = [...existing, ...commits]
    }

    // Update checklist counts
    if (checklistCompleted != null) patch.checklistCompleted = checklistCompleted
    if (checklistTotal != null) patch.checklistTotal = checklistTotal

    await ctx.db.patch(ticketId, patch)

    // Recalculate epic status from all sibling tickets
    const allTickets = await ctx.db
      .query("tickets")
      .withIndex("by_epic", (q) => q.eq("epicId", ticket.epicId))
      .collect()
    const activeTickets = allTickets.filter((t) => !t.isDeleted)
    const completedCount = activeTickets.filter(
      (t) => t.status === "completed" || t.status === "review"
    ).length
    const epicChecklistCompleted = activeTickets.reduce((sum, t) => sum + t.checklistCompleted, 0)
    const derivedStatus = deriveEpicStatus(activeTickets.map((t) => t.status as TicketStatus))

    await ctx.db.patch(ticket.epicId, {
      completedTicketCount: completedCount,
      checklistCompleted: epicChecklistCompleted,
      status: derivedStatus,
      updatedAt: Date.now(),
    })

    return { ticketId, previousStatus, newStatus: status, epicStatus: derivedStatus }
  },
})
