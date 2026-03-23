import { v } from "convex/values"
import { query, mutation, internalQuery, internalMutation } from "./_generated/server"
import { internal } from "./_generated/api"
import { requireAuth } from "./helpers"
import { throwError, ErrorCodes } from "./errors"
import { parseRepoUrl } from "./model/parseRepoUrl"

const DELETE_BATCH_SIZE = 100

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx)
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
    return projects.filter((p) => !p.deletionStatus)
  },
})

export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const userId = await requireAuth(ctx)
    const project = await ctx.db.get(projectId)
    if (!project || project.userId !== userId || project.deletionStatus) return throwError(ErrorCodes.NOT_FOUND)
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
    if (project.deletionStatus) return // already being deleted

    // Soft-mark the project so it disappears from queries immediately
    await ctx.db.patch(projectId, { deletionStatus: "pending" })

    // Schedule async cascading cleanup
    await ctx.scheduler.runAfter(0, internal.projects.deleteTicketsBatch, { projectId })
  },
})

// --- Internal batch deletion chain ---

export const deleteTicketsBatch = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId)
    if (!project) return

    await ctx.db.patch(projectId, { deletionStatus: "deleting" })

    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .take(DELETE_BATCH_SIZE)

    for (const ticket of tickets) {
      await ctx.db.delete(ticket._id)
    }

    if (tickets.length === DELETE_BATCH_SIZE) {
      // More tickets remain — schedule next batch
      await ctx.scheduler.runAfter(0, internal.projects.deleteTicketsBatch, { projectId })
    } else {
      // All tickets deleted — move on to epics
      await ctx.scheduler.runAfter(0, internal.projects.deleteEpicsBatch, { projectId })
    }
  },
})

export const deleteEpicsBatch = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId)
    if (!project) return

    const epics = await ctx.db
      .query("epics")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .take(DELETE_BATCH_SIZE)

    for (const epic of epics) {
      await ctx.db.delete(epic._id)
    }

    if (epics.length === DELETE_BATCH_SIZE) {
      // More epics remain — schedule next batch
      await ctx.scheduler.runAfter(0, internal.projects.deleteEpicsBatch, { projectId })
    } else {
      // All children deleted — remove the project
      await ctx.scheduler.runAfter(0, internal.projects.deleteProjectFinal, { projectId })
    }
  },
})

export const deleteProjectFinal = internalMutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId)
    if (!project) return
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
    autonomousLoop: v.optional(v.boolean()),
    localPath: v.optional(v.string()),
    notificationEnabled: v.optional(v.boolean()),
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
    if (updates.autonomousLoop !== undefined) patch.autonomousLoop = updates.autonomousLoop
    if (updates.localPath !== undefined) patch.localPath = updates.localPath
    if (updates.notificationEnabled !== undefined) patch.notificationEnabled = updates.notificationEnabled

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
      (p) => p.autonomousLoop === true && !!p.localPath && !p.deletionStatus
    )
  },
})

export const getAllActiveProjects = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allProjects = await ctx.db.query("projects").collect()
    return allProjects.filter((p) => !p.deletionStatus)
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

export const getProjectStats = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }): Promise<{
    todo: number
    inProgress: number
    review: number
    completed: number
    blocked: number
    total: number
  }> => {
    const userId = await requireAuth(ctx)
    const project = await ctx.db.get(projectId)
    if (!project || project.userId !== userId || project.deletionStatus) return throwError(ErrorCodes.NOT_FOUND)

    const epics = await ctx.db
      .query("epics")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()

    const counts = { todo: 0, inProgress: 0, review: 0, completed: 0, blocked: 0, total: 0 }

    for (const epic of epics) {
      if (epic.isDeleted) continue
      const tickets = await ctx.db
        .query("tickets")
        .withIndex("by_epic", (q) => q.eq("epicId", epic._id))
        .collect()

      for (const ticket of tickets) {
        if (ticket.isDeleted) continue
        counts.total++
        switch (ticket.status) {
          case "todo": counts.todo++; break
          case "in-progress": counts.inProgress++; break
          case "review": counts.review++; break
          case "completed": counts.completed++; break
          case "blocked": counts.blocked++; break
        }
      }
    }

    return counts
  },
})

export const getProjectsWithStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx)
    const allProjects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
    const projects = allProjects.filter((p) => !p.deletionStatus)

    const results = await Promise.all(
      projects.map(async (project) => {
        const epics = await ctx.db
          .query("epics")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect()

        const counts = { todo: 0, inProgress: 0, review: 0, completed: 0, blocked: 0, total: 0 }

        for (const epic of epics) {
          if (epic.isDeleted) continue
          const tickets = await ctx.db
            .query("tickets")
            .withIndex("by_epic", (q) => q.eq("epicId", epic._id))
            .collect()

          for (const ticket of tickets) {
            if (ticket.isDeleted) continue
            counts.total++
            switch (ticket.status) {
              case "todo": counts.todo++; break
              case "in-progress": counts.inProgress++; break
              case "review": counts.review++; break
              case "completed": counts.completed++; break
              case "blocked": counts.blocked++; break
            }
          }
        }

        return { ...project, stats: counts }
      })
    )

    return results
  },
})
