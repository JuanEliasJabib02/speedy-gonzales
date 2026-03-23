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
  agentName: v.optional(v.string()),
  agentEmoji: v.optional(v.string()),
  agentStatus: v.optional(v.string()), // "idle" | "working"
  agentCurrentFeature: v.optional(v.string()),
  maxConcurrentPerFeature: v.optional(v.number()), // default: 3
  maxConcurrentGlobal: v.optional(v.number()), // default: 5
  autonomousLoop: v.optional(v.boolean()), // opt-in to autonomous dev loop
  localPath: v.optional(v.string()), // absolute path to local repo clone
  notificationEnabled: v.optional(v.boolean()), // Whether to notify on loop events (via agent's connected channel)
  loopStatus: v.optional(v.string()), // "idle" | "running" | "error"
  lastLoopAt: v.optional(v.number()), // timestamp of last loop execution
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_repo", ["repoOwner", "repoName"])
  .index("by_autonomous_loop", ["autonomousLoop"])
