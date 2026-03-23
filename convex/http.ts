import { httpRouter } from "convex/server"
import { auth } from "./auth"
import { internal } from "./_generated/api"
import { httpAction } from "./_generated/server"
import { VALID_STATUSES, type ValidStatus } from "./helpers"

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

const http = httpRouter()

auth.addHttpRoutes(http)

http.route({
  path: "/github-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = request.headers.get("x-github-event")

    // Only process push events
    if (event !== "push") {
      return new Response("Ignored", { status: 200, headers: corsHeaders })
    }

    const body = await request.text()
    let payload: {
      repository?: { owner?: { login?: string }; name?: string }
      commits?: Array<{ added?: string[]; modified?: string[]; removed?: string[] }>
    }

    try {
      payload = JSON.parse(body)
    } catch {
      return new Response("Invalid JSON", { status: 400, headers: corsHeaders })
    }

    const owner = payload.repository?.owner?.login
    const name = payload.repository?.name
    if (!owner || !name) {
      return new Response("Missing repo info", { status: 400, headers: corsHeaders })
    }

    // Look up project
    const project = await ctx.runQuery(internal.projects.getByRepo, { owner, name })
    if (!project) {
      return new Response("Project not found", { status: 404, headers: corsHeaders })
    }

    // Always require webhook signature verification
    if (!project.webhookSecret) {
      return new Response("Webhook secret not configured", { status: 403, headers: corsHeaders })
    }

    const signature = request.headers.get("x-hub-signature-256") ?? ""
    const { getGitProvider } = await import("./model/providers")
    const provider = getGitProvider("github")
    const valid = await provider.verifyWebhookSignature(project.webhookSecret, body, signature)
    if (!valid) {
      return new Response("Invalid signature", { status: 401, headers: corsHeaders })
    }

    // Check if changes are under plansPath
    const changedPaths = getAllChangedPaths(payload)
    console.log("[webhook] repo:", owner + "/" + name, "| changedPaths:", changedPaths)
    console.log("[webhook] project.plansPath:", project.plansPath)

    const hasRelevantChanges = changedPaths.some((p) => p.startsWith(project.plansPath))

    if (!hasRelevantChanges) {
      console.log("[webhook] No relevant changes — skipping sync")
      return new Response("No relevant changes", { status: 200, headers: corsHeaders })
    }

    console.log("[webhook] Relevant changes found — scheduling sync for project:", project._id)

    // Schedule sync
    await ctx.scheduler.runAfter(0, internal.githubSync.syncRepoInternal, {
      projectId: project._id,
    })

    return new Response("Sync scheduled", { status: 200, headers: corsHeaders })
  }),
})

function getAllChangedPaths(payload: {
  commits?: Array<{ added?: string[]; modified?: string[]; removed?: string[] }>
}): string[] {
  if (!payload.commits) return []
  const paths = new Set<string>()
  for (const commit of payload.commits) {
    for (const p of commit.added ?? []) paths.add(p)
    for (const p of commit.modified ?? []) paths.add(p)
    for (const p of commit.removed ?? []) paths.add(p)
  }
  return Array.from(paths)
}

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
    }

    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      })
    }

    const { repoOwner, repoName, ticketPath, status, blockedReason } = body

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

    // Update status
    const result = await ctx.runMutation(internal.tickets.updateStatusInternal, {
      ticketId: ticket._id,
      status: validatedStatus,
      blockedReason: validatedStatus === "blocked" ? blockedReason : undefined,
    })

    return new Response(
      JSON.stringify({
        ok: true,
        ticketId: result.ticketId,
        previousStatus: result.previousStatus,
        newStatus: result.newStatus,
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

export default http
