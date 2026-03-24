import { httpRouter } from "convex/server"
import { auth } from "./auth"
import { internal } from "./_generated/api"
import { httpAction } from "./_generated/server"
import { VALID_STATUSES, VALID_PRIORITIES, type ValidStatus, type ValidPriority } from "./helpers"
import { parseChecklistCounts, generateContentHash, slugify } from "./lib/planParser"
import { getGitProvider } from "./model/providers"
import type { GitProviderType } from "./model/gitProvider"

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

const http = httpRouter()

auth.addHttpRoutes(http)

// Autonomous loop endpoint — returns active projects + todo tickets
http.route({
  path: "/autonomous-loop/status",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    // API key auth — always required
    const expectedKey = process.env.LOOP_API_KEY
    if (!expectedKey) {
      return new Response("LOOP_API_KEY not configured", { status: 500, headers: corsHeaders })
    }
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${expectedKey}`) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders })
    }

    const projects = await ctx.runQuery(internal.projects.getActiveLoopProjects, {})

    const result = await Promise.all(
      projects.map(async (project) => {
        const todoTickets = await ctx.runQuery(internal.tickets.getTodoTicketsByProject, {
          projectId: project._id,
        })
        return {
          projectId: project._id,
          name: project.name,
          localPath: project.localPath,
          repoOwner: project.repoOwner,
          repoName: project.repoName,
          branch: project.branch,
          maxConcurrentPerFeature: project.maxConcurrentPerFeature ?? 3,
          maxConcurrentGlobal: project.maxConcurrentGlobal ?? 5,
          notificationEnabled: project.notificationEnabled ?? true,
          todoTickets: todoTickets.map((t) => ({
            id: t._id,
            title: t.title,
            path: t.path,
            epicId: t.epicId,
            priority: t.priority,
            content: t.content,
          })),
        }
      })
    )

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  }),
})

// Update ticket status — called by the autonomous loop when an agent finishes a ticket
http.route({
  path: "/update-ticket-status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // API key auth — always required
    const expectedKey = process.env.LOOP_API_KEY
    if (!expectedKey) {
      return new Response(JSON.stringify({ ok: false, error: "LOOP_API_KEY not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${expectedKey}`) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    let body: {
      repoOwner?: string
      repoName?: string
      ticketPath?: string
      status?: string
      blockedReason?: string
      commits?: string[]
      checklistCompleted?: number
      checklistTotal?: number
    }

    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    const { repoOwner, repoName, ticketPath, status, blockedReason, commits, checklistCompleted, checklistTotal } = body

    if (!repoOwner || !repoName || !ticketPath || !status) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields: repoOwner, repoName, ticketPath, status" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    if (!VALID_STATUSES.includes(status as ValidStatus)) {
      return new Response(
        JSON.stringify({ ok: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }
    const validatedStatus = status as (typeof VALID_STATUSES)[number]

    // Look up project
    const project = await ctx.runQuery(internal.projects.getByRepo, {
      owner: repoOwner,
      name: repoName,
    })
    if (!project) {
      return new Response(
        JSON.stringify({ ok: false, error: `Project not found: ${repoOwner}/${repoName}` }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    // Look up ticket by path
    const ticket = await ctx.runQuery(internal.tickets.getByProjectPath, {
      projectId: project._id,
      path: ticketPath,
    })
    if (!ticket) {
      return new Response(
        JSON.stringify({ ok: false, error: `Ticket not found: ${ticketPath}` }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    // Validate checklist fields
    if (checklistCompleted != null && checklistTotal != null && checklistCompleted > checklistTotal) {
      return new Response(
        JSON.stringify({ ok: false, error: "checklistCompleted must be ≤ checklistTotal" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    // Update status
    const result = await ctx.runMutation(internal.tickets.updateStatusInternal, {
      ticketId: ticket._id,
      status: validatedStatus,
      blockedReason: validatedStatus === "blocked" ? blockedReason : undefined,
      commits,
      checklistCompleted,
      checklistTotal,
    })

    return new Response(
      JSON.stringify({
        ok: true,
        ticketId: result.ticketId,
        previousStatus: result.previousStatus,
        newStatus: result.newStatus,
        epicStatus: result.epicStatus,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    )
  }),
})

// Log loop cycle — called by the autonomous loop after each execution
http.route({
  path: "/log-loop-cycle",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const expectedKey = process.env.LOOP_API_KEY
    if (!expectedKey) {
      return new Response(JSON.stringify({ ok: false, error: "LOOP_API_KEY not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${expectedKey}`) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    let body: {
      repoOwner?: string
      repoName?: string
      timestamp?: number
      ticketsProcessed?: number
      ticketsSkipped?: number
      wasIdle?: boolean
      rateLimitHit?: boolean
      modelUsed?: string
      durationMs?: number
    }

    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    const { repoOwner, repoName, timestamp, ticketsProcessed, ticketsSkipped, wasIdle, rateLimitHit, modelUsed, durationMs } = body

    if (!repoOwner || !repoName || timestamp == null || ticketsProcessed == null || ticketsSkipped == null || wasIdle == null || rateLimitHit == null) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields: repoOwner, repoName, timestamp, ticketsProcessed, ticketsSkipped, wasIdle, rateLimitHit" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    if (modelUsed && modelUsed !== "opus" && modelUsed !== "sonnet") {
      return new Response(
        JSON.stringify({ ok: false, error: "modelUsed must be 'opus' or 'sonnet'" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, {
      owner: repoOwner,
      name: repoName,
    })
    if (!project) {
      return new Response(
        JSON.stringify({ ok: false, error: `Project not found: ${repoOwner}/${repoName}` }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      )
    }

    await ctx.runMutation(internal.loopCycles.logCycle, {
      projectId: project._id,
      timestamp,
      ticketsProcessed,
      ticketsSkipped,
      wasIdle,
      rateLimitHit,
      modelUsed: modelUsed as "opus" | "sonnet" | undefined,
      durationMs,
    })

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    )
  }),
})

// ── Helper: verify LOOP_API_KEY ─────────────────────────────────────
function verifyLoopApiKey(request: Request): Response | null {
  const expectedKey = process.env.LOOP_API_KEY
  if (!expectedKey) {
    return new Response(JSON.stringify({ ok: false, error: "LOOP_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  }
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${expectedKey}`) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  }
  return null
}

// ── Helper: JSON error response ─────────────────────────────────────
function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  })
}

function jsonOk(data: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ ok: true, ...data }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  })
}

// ── Helper: get access token for git provider ──────────────────────
function getAccessToken(gitProvider: GitProviderType): string | undefined {
  switch (gitProvider) {
    case "github":
      return process.env.GITHUB_ACCESS_TOKEN
    case "bitbucket":
      return process.env.BITBUCKET_ACCESS_TOKEN
    case "gitlab":
      return process.env.GITLAB_ACCESS_TOKEN
    default:
      return undefined
  }
}

// ── POST /create-epic ───────────────────────────────────────────────
http.route({
  path: "/create-epic",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    let body: {
      repoOwner?: string
      repoName?: string
      title?: string
      content?: string
      priority?: string
      status?: string
    }

    try {
      body = await request.json()
    } catch {
      return jsonError("Invalid JSON", 400)
    }

    const { repoOwner, repoName, title, content = "" } = body
    const priority = body.priority ?? "medium"
    const status = body.status ?? "backlog"

    if (!repoOwner || !repoName || !title) {
      return jsonError("Missing required fields: repoOwner, repoName, title", 400)
    }
    if (!VALID_PRIORITIES.includes(priority as ValidPriority)) {
      return jsonError(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`, 400)
    }
    if (!VALID_STATUSES.includes(status as ValidStatus)) {
      return jsonError(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`, 400)
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, { owner: repoOwner, name: repoName })
    if (!project) return jsonError(`Project not found: ${repoOwner}/${repoName}`, 404)

    const epicSlug = slugify(title)
    const path = `${project.plansPath}/${epicSlug}`
    const contentHash = generateContentHash(content)
    const { total, completed } = parseChecklistCounts(content)

    // Check if epic already exists at this path
    const existing = await ctx.runQuery(internal.epics.getByProjectPathInternal, {
      projectId: project._id,
      path,
    })
    if (existing) return jsonError(`Epic already exists at path: ${path}`, 409)

    // Get next sort order
    const allEpics = await ctx.runQuery(internal.epics.getByProjectInternal, { projectId: project._id })
    const sortOrder = allEpics.length

    const epicId = await ctx.runMutation(internal.epics.createEpicInternal, {
      projectId: project._id,
      title,
      path,
      content,
      contentHash,
      status: status as ValidStatus,
      priority: priority as ValidPriority,
      checklistTotal: total,
      checklistCompleted: completed,
      sortOrder,
    })

    return jsonOk({ epicId, path })
  }),
})

// ── POST /create-ticket ─────────────────────────────────────────────
http.route({
  path: "/create-ticket",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    let body: {
      repoOwner?: string
      repoName?: string
      epicPath?: string
      title?: string
      content?: string
      priority?: string
      status?: string
      sortOrder?: number
    }

    try {
      body = await request.json()
    } catch {
      return jsonError("Invalid JSON", 400)
    }

    const { repoOwner, repoName, epicPath, title, content = "" } = body
    const priority = body.priority ?? "medium"
    const status = body.status ?? "backlog"
    const sortOrder = body.sortOrder ?? 0

    if (!repoOwner || !repoName || !epicPath || !title) {
      return jsonError("Missing required fields: repoOwner, repoName, epicPath, title", 400)
    }
    if (!VALID_PRIORITIES.includes(priority as ValidPriority)) {
      return jsonError(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`, 400)
    }
    if (!VALID_STATUSES.includes(status as ValidStatus)) {
      return jsonError(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`, 400)
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, { owner: repoOwner, name: repoName })
    if (!project) return jsonError(`Project not found: ${repoOwner}/${repoName}`, 404)

    const epic = await ctx.runQuery(internal.epics.getByProjectPathInternal, {
      projectId: project._id,
      path: epicPath,
    })
    if (!epic) return jsonError(`Epic not found at path: ${epicPath}`, 404)

    const ticketSlug = slugify(title)
    const ticketPath = `${epicPath}/${ticketSlug}.md`
    const contentHash = generateContentHash(content)
    const { total, completed } = parseChecklistCounts(content)

    // Check if ticket already exists
    const existing = await ctx.runQuery(internal.tickets.getByProjectPath, {
      projectId: project._id,
      path: ticketPath,
    })
    if (existing) return jsonError(`Ticket already exists at path: ${ticketPath}`, 409)

    const ticketId = await ctx.runMutation(internal.tickets.createTicketInternal, {
      projectId: project._id,
      epicId: epic._id,
      title,
      path: ticketPath,
      content,
      contentHash,
      status: status as ValidStatus,
      priority: priority as ValidPriority,
      checklistTotal: total,
      checklistCompleted: completed,
      sortOrder,
    })

    return jsonOk({ ticketId, path: ticketPath })
  }),
})

// ── POST /update-epic ───────────────────────────────────────────────
http.route({
  path: "/update-epic",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    let body: {
      repoOwner?: string
      repoName?: string
      epicPath?: string
      content?: string
      title?: string
      priority?: string
    }

    try {
      body = await request.json()
    } catch {
      return jsonError("Invalid JSON", 400)
    }

    const { repoOwner, repoName, epicPath } = body

    if (!repoOwner || !repoName || !epicPath) {
      return jsonError("Missing required fields: repoOwner, repoName, epicPath", 400)
    }
    if (body.priority && !VALID_PRIORITIES.includes(body.priority as ValidPriority)) {
      return jsonError(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`, 400)
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, { owner: repoOwner, name: repoName })
    if (!project) return jsonError(`Project not found: ${repoOwner}/${repoName}`, 404)

    const epic = await ctx.runQuery(internal.epics.getByProjectPathInternal, {
      projectId: project._id,
      path: epicPath,
    })
    if (!epic) return jsonError(`Epic not found at path: ${epicPath}`, 404)

    const patch: Record<string, unknown> = {}
    if (body.content !== undefined) {
      patch.content = body.content
      patch.contentHash = generateContentHash(body.content)
      const { total, completed } = parseChecklistCounts(body.content)
      patch.checklistTotal = total
      patch.checklistCompleted = completed
    }
    if (body.title !== undefined) patch.title = body.title
    if (body.priority !== undefined) patch.priority = body.priority

    await ctx.runMutation(internal.epics.updateEpicInternal, {
      epicId: epic._id,
      ...patch,
    } as {
      epicId: typeof epic._id
      content?: string
      contentHash?: string
      title?: string
      priority?: "low" | "medium" | "high" | "critical"
      checklistTotal?: number
      checklistCompleted?: number
    })

    return jsonOk({ epicId: epic._id })
  }),
})

// ── POST /update-ticket-content ─────────────────────────────────────
http.route({
  path: "/update-ticket-content",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    let body: {
      repoOwner?: string
      repoName?: string
      ticketPath?: string
      content?: string
      title?: string
      priority?: string
    }

    try {
      body = await request.json()
    } catch {
      return jsonError("Invalid JSON", 400)
    }

    const { repoOwner, repoName, ticketPath } = body

    if (!repoOwner || !repoName || !ticketPath) {
      return jsonError("Missing required fields: repoOwner, repoName, ticketPath", 400)
    }
    if (body.priority && !VALID_PRIORITIES.includes(body.priority as ValidPriority)) {
      return jsonError(`Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`, 400)
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, { owner: repoOwner, name: repoName })
    if (!project) return jsonError(`Project not found: ${repoOwner}/${repoName}`, 404)

    const ticket = await ctx.runQuery(internal.tickets.getByProjectPath, {
      projectId: project._id,
      path: ticketPath,
    })
    if (!ticket) return jsonError(`Ticket not found: ${ticketPath}`, 404)

    const patch: Record<string, unknown> = {}
    if (body.content !== undefined) {
      patch.content = body.content
      patch.contentHash = generateContentHash(body.content)
      const { total, completed } = parseChecklistCounts(body.content)
      patch.checklistTotal = total
      patch.checklistCompleted = completed
    }
    if (body.title !== undefined) patch.title = body.title
    if (body.priority !== undefined) patch.priority = body.priority

    await ctx.runMutation(internal.tickets.updateTicketContentInternal, {
      ticketId: ticket._id,
      ...patch,
    } as {
      ticketId: typeof ticket._id
      content?: string
      contentHash?: string
      title?: string
      priority?: "low" | "medium" | "high" | "critical"
      checklistTotal?: number
      checklistCompleted?: number
    })

    return jsonOk({ ticketId: ticket._id })
  }),
})

// ── GET /get-ticket-plan ────────────────────────────────────────────
http.route({
  path: "/get-ticket-plan",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    const url = new URL(request.url)
    const repoOwner = url.searchParams.get("repoOwner")
    const repoName = url.searchParams.get("repoName")
    const ticketPath = url.searchParams.get("ticketPath")

    if (!repoOwner || !repoName || !ticketPath) {
      return jsonError("Missing required params: repoOwner, repoName, ticketPath", 400)
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, { owner: repoOwner, name: repoName })
    if (!project) return jsonError(`Project not found: ${repoOwner}/${repoName}`, 404)

    const ticket = await ctx.runQuery(internal.tickets.getByProjectPath, {
      projectId: project._id,
      path: ticketPath,
    })
    if (!ticket) return jsonError(`Ticket not found: ${ticketPath}`, 404)

    return jsonOk({
      ticketId: ticket._id,
      title: ticket.title,
      path: ticket.path,
      status: ticket.status,
      priority: ticket.priority,
      content: ticket.content,
      checklistTotal: ticket.checklistTotal,
      checklistCompleted: ticket.checklistCompleted,
    })
  }),
})

// ── GET /get-epic-tickets ───────────────────────────────────────────
http.route({
  path: "/get-epic-tickets",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    const url = new URL(request.url)
    const repoOwner = url.searchParams.get("repoOwner")
    const repoName = url.searchParams.get("repoName")
    const epicPath = url.searchParams.get("epicPath")

    if (!repoOwner || !repoName || !epicPath) {
      return jsonError("Missing required params: repoOwner, repoName, epicPath", 400)
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, { owner: repoOwner, name: repoName })
    if (!project) return jsonError(`Project not found: ${repoOwner}/${repoName}`, 404)

    const epic = await ctx.runQuery(internal.epics.getByProjectPathInternal, {
      projectId: project._id,
      path: epicPath,
    })
    if (!epic) return jsonError(`Epic not found at path: ${epicPath}`, 404)

    const allTickets = await ctx.runQuery(internal.tickets.getByProjectInternal, {
      projectId: project._id,
    })
    const epicTickets = allTickets
      .filter((t) => t.epicId === epic._id && !t.isDeleted)
      .sort((a, b) => a.sortOrder - b.sortOrder)

    return jsonOk({
      epicId: epic._id,
      epicTitle: epic.title,
      tickets: epicTickets.map((t) => ({
        ticketId: t._id,
        title: t.title,
        path: t.path,
        status: t.status,
        priority: t.priority,
        content: t.content,
        checklistTotal: t.checklistTotal,
        checklistCompleted: t.checklistCompleted,
        sortOrder: t.sortOrder,
      })),
    })
  }),
})

// ── POST /delete-epic ───────────────────────────────────────────────
http.route({
  path: "/delete-epic",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    let body: {
      repoOwner?: string
      repoName?: string
      epicPath?: string
    }

    try {
      body = await request.json()
    } catch {
      return jsonError("Invalid JSON", 400)
    }

    const { repoOwner, repoName, epicPath } = body

    if (!repoOwner || !repoName || !epicPath) {
      return jsonError("Missing required fields: repoOwner, repoName, epicPath", 400)
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, { owner: repoOwner, name: repoName })
    if (!project) return jsonError(`Project not found: ${repoOwner}/${repoName}`, 404)

    const epic = await ctx.runQuery(internal.epics.getByProjectPathInternal, {
      projectId: project._id,
      path: epicPath,
    })
    if (!epic) return jsonError(`Epic not found at path: ${epicPath}`, 404)

    const deletedTickets = await ctx.runMutation(internal.epics.deleteEpicInternal, {
      epicId: epic._id,
    })

    return jsonOk({ deletedTickets })
  }),
})

// ── POST /recalculate-epic-statuses ─────────────────────────────────
http.route({
  path: "/recalculate-epic-statuses",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    const result = await ctx.runMutation(internal.epics.recalculateBacklogEpicStatuses, {})

    return jsonOk({ message: result.message })
  }),
})

// ── POST /set-pr-url ────────────────────────────────────────────────
http.route({
  path: "/set-pr-url",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    let body: {
      epicId?: string
      prUrl?: string
    }

    try {
      body = await request.json()
    } catch {
      return jsonError("Invalid JSON", 400)
    }

    const { epicId, prUrl } = body

    if (!epicId || !prUrl) {
      return jsonError("Missing required fields: epicId, prUrl", 400)
    }

    const result = await ctx.runMutation(internal.epics.setPrUrlInternal, {
      epicId: epicId as any,
      prUrl,
    })

    return jsonOk({ epicId: result })
  }),
})

// ── GET /stale-tickets ──────────────────────────────────────────────
http.route({
  path: "/stale-tickets",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    const url = new URL(request.url)
    const repoOwner = url.searchParams.get("repoOwner")
    const repoName = url.searchParams.get("repoName")

    if (!repoOwner || !repoName) {
      return jsonError("Missing required params: repoOwner, repoName", 400)
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, { owner: repoOwner, name: repoName })
    if (!project) return jsonError(`Project not found: ${repoOwner}/${repoName}`, 404)

    const staleTickets = await ctx.runQuery(internal.tickets.getStaleInProgressTickets, {
      projectId: project._id,
    })

    return jsonOk({
      staleTickets: staleTickets.map((t) => ({
        id: t.id,
        title: t.title,
        path: t.path,
        startedAt: t.startedAt,
        epicId: t.epicId,
        agentName: t.agentName,
        minutesStuck: t.minutesStuck,
      })),
    })
  }),
})

// ── POST /create-pr ─────────────────────────────────────────────────
function getAccessTokenForProvider(provider: string): string | undefined {
  switch (provider) {
    case "github": return process.env.GITHUB_ACCESS_TOKEN
    case "bitbucket": return process.env.BITBUCKET_ACCESS_TOKEN
    case "gitlab": return process.env.GITLAB_ACCESS_TOKEN
    default: return undefined
  }
}

http.route({
  path: "/create-pr",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authError = verifyLoopApiKey(request)
    if (authError) return authError

    let body: {
      repoOwner?: string
      repoName?: string
      sourceBranch?: string
      targetBranch?: string
      title?: string
      description?: string
    }

    try {
      body = await request.json()
    } catch {
      return jsonError("Invalid JSON", 400)
    }

    const { repoOwner, repoName, sourceBranch, targetBranch, title, description = "" } = body

    if (!repoOwner || !repoName || !sourceBranch || !targetBranch || !title) {
      return jsonError("Missing required fields: repoOwner, repoName, sourceBranch, targetBranch, title", 400)
    }

    const project = await ctx.runQuery(internal.projects.getByRepo, { owner: repoOwner, name: repoName })
    if (!project) return jsonError(`Project not found: ${repoOwner}/${repoName}`, 404)

    const gitProvider = getGitProvider(project.gitProvider)
    const accessToken = getAccessTokenForProvider(project.gitProvider)
    if (!accessToken) {
      return jsonError(`Access token not configured for ${project.gitProvider}`, 500)
    }

    try {
      const result = await gitProvider.createPR(
        {
          provider: project.gitProvider,
          accessToken,
          owner: repoOwner,
          repo: repoName,
          branch: project.branch,
        },
        {
          sourceBranch,
          targetBranch,
          title,
          description,
        }
      )

      return jsonOk({
        url: result.url,
        id: result.id,
        provider: project.gitProvider,
      })
    } catch (error) {
      return jsonError(`Failed to create PR: ${error instanceof Error ? error.message : 'Unknown error'}`, 500)
    }
  }),
})

export default http
