import { defineTable } from "convex/server"
import { v } from "convex/values"
import { statusValidator, priorityValidator } from "../helpers"

export const epics = defineTable({
  projectId: v.id("projects"),
  title: v.string(),
  path: v.string(), // e.g. "plans/features/auth"
  content: v.string(),
  contentHash: v.string(),
  status: statusValidator,
  priority: priorityValidator,
  checklistTotal: v.number(),
  checklistCompleted: v.number(),
  ticketCount: v.number(),
  completedTicketCount: v.optional(v.number()),
  sortOrder: v.number(),
  prUrl: v.optional(v.string()),
  completionType: v.optional(v.union(v.literal("clean"), v.literal("with-fixes"))),
  isDeleted: v.boolean(),
  updatedAt: v.optional(v.number()),
})
  .index("by_project", ["projectId"])
  .index("by_project_path", ["projectId", "path"])
