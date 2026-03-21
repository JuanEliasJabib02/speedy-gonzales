import { defineTable } from "convex/server"
import { v } from "convex/values"

export const projects = defineTable({
  userId: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  repoUrl: v.string(),
  repoOwner: v.string(),
  repoName: v.string(),
  plansPath: v.string(), // default: "plans/features"
  branch: v.string(), // default: "main"
  gitProvider: v.string(), // "github" | "bitbucket" | "gitlab"
  webhookId: v.optional(v.string()),
  webhookSecret: v.optional(v.string()),
  lastSyncAt: v.optional(v.number()),
  syncStatus: v.string(), // "idle" | "syncing" | "error"
  syncError: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_repo", ["repoOwner", "repoName"])
