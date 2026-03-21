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

    // Cascade delete: tickets → epics → chat messages → project
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

      const messages = await ctx.db
        .query("chatMessages")
        .withIndex("by_epic", (q) => q.eq("epicId", epic._id))
        .collect()
      for (const msg of messages) {
        await ctx.db.delete(msg._id)
      }

      await ctx.db.delete(epic._id)
    }

    await ctx.db.delete(projectId)
  },
})

// Internal queries used by sync engine and webhook handler
export const getProjectInternal = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    return ctx.db.get(projectId)
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
