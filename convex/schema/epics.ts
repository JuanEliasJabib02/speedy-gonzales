import { defineTable } from "convex/server"
import { v } from "convex/values"

export const epics = defineTable({
  projectId: v.id("projects"),
  title: v.string(),
  path: v.string(), // e.g. "plans/features/auth"
  content: v.string(),
  contentHash: v.string(),
  status: v.string(), // "todo" | "in-progress" | "review" | "completed" | "blocked"
  priority: v.string(), // "low" | "medium" | "high" | "critical"
  checklistTotal: v.number(),
  checklistCompleted: v.number(),
  ticketCount: v.number(),
  completedTicketCount: v.optional(v.number()),
  sortOrder: v.number(),
  isDeleted: v.boolean(),
})
  .index("by_project", ["projectId"])
  .index("by_project_path", ["projectId", "path"])
