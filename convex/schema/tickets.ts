import { defineTable } from "convex/server"
import { v } from "convex/values"

export const tickets = defineTable({
  projectId: v.id("projects"),
  epicId: v.id("epics"),
  title: v.string(),
  path: v.string(), // e.g. "plans/features/auth/magic-link-signin.md"
  content: v.string(),
  contentHash: v.string(),
  status: v.string(), // "todo" | "in-progress" | "review" | "completed"
  priority: v.string(), // "low" | "medium" | "high" | "critical"
  checklistTotal: v.number(),
  checklistCompleted: v.number(),
  sortOrder: v.number(),
  isDeleted: v.boolean(),
})
  .index("by_epic", ["epicId"])
  .index("by_project", ["projectId"])
  .index("by_project_path", ["projectId", "path"])
