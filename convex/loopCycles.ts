import { v } from "convex/values"
import { internalMutation, query } from "./_generated/server"
import { requireAuth } from "./helpers"
import { throwError, ErrorCodes } from "./errors"

export const logCycle = internalMutation({
  args: {
    projectId: v.id("projects"),
    timestamp: v.number(),
    ticketsProcessed: v.number(),
    ticketsSkipped: v.number(),
    wasIdle: v.boolean(),
    rateLimitHit: v.boolean(),
    modelUsed: v.optional(v.union(v.literal("opus"), v.literal("sonnet"))),
    durationMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("loopCycles", args)
  },
})

export const getCycleStats = query({
  args: {
    projectId: v.id("projects"),
    from: v.number(),
    to: v.number(),
  },
  handler: async (ctx, { projectId, from, to }) => {
    const userId = await requireAuth(ctx)

    const project = await ctx.db.get(projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.FORBIDDEN) as never

    const cycles = await ctx.db
      .query("loopCycles")
      .withIndex("by_project_timestamp", (q) => q.eq("projectId", projectId).gte("timestamp", from).lte("timestamp", to))
      .collect()

    const totalCycles = cycles.length
    const totalProcessed = cycles.reduce((sum, c) => sum + c.ticketsProcessed, 0)
    const totalSkipped = cycles.reduce((sum, c) => sum + c.ticketsSkipped, 0)
    const idleCycles = cycles.filter((c) => c.wasIdle).length
    const rateLimitHits = cycles.filter((c) => c.rateLimitHit).length
    const avgDurationMs =
      cycles.filter((c) => c.durationMs != null).length > 0
        ? cycles.filter((c) => c.durationMs != null).reduce((sum, c) => sum + c.durationMs!, 0) /
          cycles.filter((c) => c.durationMs != null).length
        : null

    return {
      totalCycles,
      totalProcessed,
      totalSkipped,
      idleCycles,
      rateLimitHits,
      avgDurationMs,
      cycles,
    }
  },
})
