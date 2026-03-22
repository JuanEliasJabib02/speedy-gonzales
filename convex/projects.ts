import { v } from "convex/values"
import { query, mutation, internalQuery } from "./_generated/server"
import { internal } from "./_generated/api"
import { requireAuth } from "./helpers"
import { throwError, ErrorCodes } from "./errors"
import { parseRepoUrl } from "./model/parseRepoUrl"

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx)
    return ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
  },
})

export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const userId = await requireAuth(ctx)
    const project = await ctx.db.get(projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.NOT_FOUND)
    return project
  },
})

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    repoUrl: v.string(),
    plansPath: v.optional(v.string()),
    branch: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx)
    const { owner, repo } = parseRepoUrl(args.repoUrl)
    const now = Date.now()

    const projectId = await ctx.db.insert("projects", {
      userId,
      name: args.name,
      description: args.description,
      repoUrl: args.repoUrl,
      repoOwner: owner,
      repoName: repo,
      plansPath: args.plansPath ?? "plans/features",
      branch: args.branch ?? "main",
      gitProvider: "github",
      syncStatus: "idle",
      autonomousLoop: false,
      loopStatus: "idle",
      agentName: "Charizard",
      agentEmoji: "🔥",
      agentStatus: "idle",
      maxConcurrentPerFeature: 3,
      maxConcurrentGlobal: 5,
      createdAt: now,
      updatedAt: now,
    })

    // Schedule initial sync
    await ctx.scheduler.runAfter(0, internal.githubSync.syncRepoInternal, { projectId })

    return projectId
  },
})

export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const userId = await requireAuth(ctx)
    const project = await ctx.db.get(projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.NOT_FOUND)

    // Cascade delete: tickets → epics → project
    const epics = await ctx.db
      .query("epics")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()

    for (const epic of epics) {
      const tickets = await ctx.db
        .query("tickets")
        .withIndex("by_epic", (q) => q.eq("epicId", epic._id))
        .collect()
      for (const ticket of tickets) {
        await ctx.db.delete(ticket._id)
      }

      await ctx.db.delete(epic._id)
    }

    await ctx.db.delete(projectId)
  },
})

export const updateSettings = mutation({
  args: {
    projectId: v.id("projects"),
    maxConcurrentPerFeature: v.optional(v.number()),
    maxConcurrentGlobal: v.optional(v.number()),
    agentName: v.optional(v.string()),
    agentEmoji: v.optional(v.string()),
    agentStatus: v.optional(v.string()),
    agentCurrentFeature: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, ...updates }) => {
    const userId = await requireAuth(ctx)
    const project = await ctx.db.get(projectId)
    if (!project || project.userId !== userId) return throwError(ErrorCodes.NOT_FOUND)

    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (updates.maxConcurrentPerFeature !== undefined) patch.maxConcurrentPerFeature = updates.maxConcurrentPerFeature
    if (updates.maxConcurrentGlobal !== undefined) patch.maxConcurrentGlobal = updates.maxConcurrentGlobal
    if (updates.agentName !== undefined) patch.agentName = updates.agentName
    if (updates.agentEmoji !== undefined) patch.agentEmoji = updates.agentEmoji
    if (updates.agentStatus !== undefined) patch.agentStatus = updates.agentStatus
    if (updates.agentCurrentFeature !== undefined) patch.agentCurrentFeature = updates.agentCurrentFeature

    await ctx.db.patch(projectId, patch)
  },
})

// Internal queries used by sync engine and webhook handler
export const getProjectInternal = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    return ctx.db.get(projectId)
  },
})

export const getActiveLoopProjects = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allProjects = await ctx.db.query("projects").collect()
    return allProjects.filter(
      (p) => p.autonomousLoop === true && !!p.localPath
    )
  },
})

export const getByRepo = internalQuery({
  args: { owner: v.string(), name: v.string() },
  handler: async (ctx, { owner, name }) => {
    return ctx.db
      .query("projects")
      .withIndex("by_repo", (q) => q.eq("repoOwner", owner).eq("repoName", name))
      .first()
  },
})
