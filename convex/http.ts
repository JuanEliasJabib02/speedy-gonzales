import { httpRouter } from "convex/server"
import { auth } from "./auth"
import { internal } from "./_generated/api"
import { httpAction } from "./_generated/server"

const http = httpRouter()

auth.addHttpRoutes(http)

http.route({
  path: "/github-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = request.headers.get("x-github-event")

    // Only process push events
    if (event !== "push") {
      return new Response("Ignored", { status: 200 })
    }

    const body = await request.text()
    let payload: {
      repository?: { owner?: { login?: string }; name?: string }
      commits?: Array<{ added?: string[]; modified?: string[]; removed?: string[] }>
    }

    try {
      payload = JSON.parse(body)
    } catch {
      return new Response("Invalid JSON", { status: 400 })
    }

    const owner = payload.repository?.owner?.login
    const name = payload.repository?.name
    if (!owner || !name) {
      return new Response("Missing repo info", { status: 400 })
    }

    // Look up project
    const project = await ctx.runQuery(internal.projects.getByRepo, { owner, name })
    if (!project) {
      return new Response("Project not found", { status: 404 })
    }

    // Verify signature if webhook secret is set
    if (project.webhookSecret) {
      const signature = request.headers.get("x-hub-signature-256") ?? ""
      const { getGitProvider } = await import("./model/providers")
      const provider = getGitProvider("github")
      const valid = await provider.verifyWebhookSignature(project.webhookSecret, body, signature)
      if (!valid) {
        return new Response("Invalid signature", { status: 401 })
      }
    }

    // Check if changes are under plansPath
    const changedPaths = getAllChangedPaths(payload)
    console.log("[webhook] repo:", owner + "/" + name, "| changedPaths:", changedPaths)
    console.log("[webhook] project.plansPath:", project.plansPath)

    const hasRelevantChanges = changedPaths.some((p) => p.startsWith(project.plansPath))

    if (!hasRelevantChanges) {
      console.log("[webhook] No relevant changes — skipping sync")
      return new Response("No relevant changes", { status: 200 })
    }

    console.log("[webhook] Relevant changes found — scheduling sync for project:", project._id)

    // Schedule sync
    await ctx.scheduler.runAfter(0, internal.githubSync.syncRepoInternal, {
      projectId: project._id,
    })

    return new Response("Sync scheduled", { status: 200 })
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
    // Simple API key auth
    const authHeader = request.headers.get("authorization")
    const expectedKey = process.env.LOOP_API_KEY
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return new Response("Unauthorized", { status: 401 })
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
      headers: { "Content-Type": "application/json" },
    })
  }),
})

export default http
