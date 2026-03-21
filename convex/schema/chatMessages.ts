import { defineTable } from "convex/server"
import { v } from "convex/values"

export const chatMessages = defineTable({
  epicId: v.id("epics"),
  role: v.string(), // "user" | "assistant"
  content: v.string(),
  metadata: v.optional(v.any()),
  tokenCount: v.optional(v.number()),
  isStreaming: v.optional(v.boolean()),
  isInterrupted: v.optional(v.boolean()),
  createdAt: v.number(),
})
  .index("by_epic", ["epicId"])
