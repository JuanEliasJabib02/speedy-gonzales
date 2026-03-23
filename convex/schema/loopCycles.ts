import { defineTable } from "convex/server"
import { v } from "convex/values"

export const loopCycles = defineTable({
  projectId: v.id("projects"),
  timestamp: v.number(),
  ticketsProcessed: v.number(),
  ticketsSkipped: v.number(),
  wasIdle: v.boolean(),
  rateLimitHit: v.boolean(),
  modelUsed: v.optional(v.union(v.literal("opus"), v.literal("sonnet"))),
  durationMs: v.optional(v.number()),
}).index("by_project_timestamp", ["projectId", "timestamp"])
