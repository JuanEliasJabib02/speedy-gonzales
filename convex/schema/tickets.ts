import { defineTable } from "convex/server"
import { v } from "convex/values"
import { statusValidator, priorityValidator } from "../helpers"

export const tickets = defineTable({
  projectId: v.id("projects"),
  epicId: v.id("epics"),
  title: v.string(),
  path: v.string(), // e.g. "plans/features/auth/magic-link-signin.md"
  content: v.string(),
  contentHash: v.string(),
  status: statusValidator,
  blockedReason: v.optional(v.string()),
  priority: priorityValidator,
  checklistTotal: v.number(),
  checklistCompleted: v.number(),
  commits: v.optional(v.array(v.string())),
  startedAt: v.optional(v.number()),
  reviewAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  blockedAt: v.optional(v.number()),
  sortOrder: v.number(),
  isDeleted: v.boolean(),
  updatedAt: v.optional(v.number()),
  agentName: v.optional(v.string()),
})
  .index("by_epic", ["epicId"])
  .index("by_project", ["projectId"])
  .index("by_project_path", ["projectId", "path"])
  .index("by_epic_updated", ["epicId", "updatedAt"])
