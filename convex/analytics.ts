import { v } from "convex/values"
import { query } from "./_generated/server"
import { requireAuth } from "./helpers"
import { throwError, ErrorCodes } from "./errors"

const dateRangeArgs = {
  projectId: v.id("projects"),
  from: v.number(),
  to: v.number(),
}

async function verifyProjectOwnership(
  ctx: { db: { get: (id: any) => Promise<any> } },
  projectId: any,
  userId: any,
) {
  const project = await ctx.db.get(projectId)
  if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never
  return project
}

function toDateString(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

export const getTicketAnalytics = query({
  args: dateRangeArgs,
  handler: async (ctx, { projectId, from, to }) => {
    const userId = await requireAuth(ctx)
    await verifyProjectOwnership(ctx, projectId, userId)

    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()

    const epics = await ctx.db
      .query("epics")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()

    // Ticket-level metrics: completed count, blocked, resolution times
    const completedTickets = tickets.filter(
      (t) => t.status === "completed" && t.completedAt && t.completedAt >= from && t.completedAt <= to,
    )
    const blocked = tickets.filter(
      (t) => t.status === "blocked" && t.blockedAt && t.blockedAt >= from && t.blockedAt <= to,
    )

    const totalCompleted = completedTickets.length
    const blockedCount = blocked.length

    const resolutionTimes = completedTickets
      .filter((t) => t.startedAt && t.reviewAt)
      .map((t) => t.reviewAt! - t.startedAt!)

    const avgResolutionTimeMs =
      resolutionTimes.length > 0
        ? resolutionTimes.reduce((sum, t) => sum + t, 0) / resolutionTimes.length
        : 0

    // Epic-level quality metrics: only count epics that went through the approve flow
    const reviewedEpics = epics.filter(
      (e) =>
        !e.isDeleted &&
        e.status === "completed" &&
        e.completedAt &&
        e.completedAt >= from &&
        e.completedAt <= to &&
        e.completionType !== undefined,
    )

    const cleanApprovals = reviewedEpics.filter((e) => e.completionType === "clean").length
    const withFixes = reviewedEpics.filter((e) => e.completionType === "with-fixes").length

    const totalReviewed = cleanApprovals + withFixes
    const qualityRate = totalReviewed > 0 ? (cleanApprovals / totalReviewed) * 100 : 0
    const successRate =
      totalCompleted + blockedCount > 0 ? (totalCompleted / (totalCompleted + blockedCount)) * 100 : 0

    return {
      totalCompleted,
      totalReviewed,
      cleanApprovals,
      withFixes,
      blocked: blockedCount,
      avgResolutionTimeMs,
      qualityRate,
      successRate,
    }
  },
})

export const getTicketsByDay = query({
  args: dateRangeArgs,
  handler: async (ctx, { projectId, from, to }) => {
    const userId = await requireAuth(ctx)
    await verifyProjectOwnership(ctx, projectId, userId)

    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()

    const epics = await ctx.db
      .query("epics")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()

    const dayMap = new Map<string, { clean: number; withFixes: number; blocked: number }>()

    // Only count epics that went through the approve flow
    for (const e of epics) {
      if (
        !e.isDeleted &&
        e.status === "completed" &&
        e.completedAt &&
        e.completedAt >= from &&
        e.completedAt <= to &&
        e.completionType !== undefined
      ) {
        const date = toDateString(e.completedAt)
        const entry = dayMap.get(date) ?? { clean: 0, withFixes: 0, blocked: 0 }
        if (e.completionType === "clean") entry.clean++
        else if (e.completionType === "with-fixes") entry.withFixes++
        dayMap.set(date, entry)
      }
    }

    // Ticket blocks bucketed by day
    for (const t of tickets) {
      if (t.status === "blocked" && t.blockedAt && t.blockedAt >= from && t.blockedAt <= to) {
        const date = toDateString(t.blockedAt)
        const entry = dayMap.get(date) ?? { clean: 0, withFixes: 0, blocked: 0 }
        entry.blocked++
        dayMap.set(date, entry)
      }
    }

    return Array.from(dayMap.entries())
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date))
  },
})

export const getResolutionTimeTrend = query({
  args: dateRangeArgs,
  handler: async (ctx, { projectId, from, to }) => {
    const userId = await requireAuth(ctx)
    await verifyProjectOwnership(ctx, projectId, userId)

    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()

    const dayMap = new Map<string, number[]>()

    for (const t of tickets) {
      if (
        t.status === "completed" &&
        t.completedAt &&
        t.completedAt >= from &&
        t.completedAt <= to &&
        t.startedAt &&
        t.reviewAt
      ) {
        const date = toDateString(t.completedAt)
        const times = dayMap.get(date) ?? []
        times.push(t.reviewAt - t.startedAt)
        dayMap.set(date, times)
      }
    }

    return Array.from(dayMap.entries())
      .map(([date, times]) => ({
        date,
        avgMs: times.reduce((sum, t) => sum + t, 0) / times.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  },
})

export const getLoopHealthStats = query({
  args: dateRangeArgs,
  handler: async (ctx, { projectId, from, to }) => {
    const userId = await requireAuth(ctx)
    await verifyProjectOwnership(ctx, projectId, userId)

    const cycles = await ctx.db
      .query("loopCycles")
      .withIndex("by_project_timestamp", (q) =>
        q.eq("projectId", projectId).gte("timestamp", from).lte("timestamp", to),
      )
      .collect()

    const totalCycles = cycles.length
    const idleCycles = cycles.filter((c) => c.wasIdle).length
    const activeCycles = totalCycles - idleCycles
    const rateLimitHits = cycles.filter((c) => c.rateLimitHit).length

    const modelBreakdown = { opus: 0, sonnet: 0 }
    for (const c of cycles) {
      if (c.modelUsed === "opus") modelBreakdown.opus++
      else if (c.modelUsed === "sonnet") modelBreakdown.sonnet++
    }

    return {
      totalCycles,
      activeCycles,
      idleCycles,
      rateLimitHits,
      modelBreakdown,
    }
  },
})
