import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { parseCommitRefs } from "@/src/lib/helpers/parseCommitRefs"

// Lazy init — avoids build-time evaluation when env var is not set
function getConvex() {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
}

type ChatContext = {
  project: {
    name: string
    repoOwner: string
    repoName: string
    branch: string
  }
  epic: {
    title: string
    status: string
    priority: string
    content: string
  }
  tickets: Array<{
    title: string
    status: string
    content: string
  }>
}

type HistoryMessage = {
  role: "user" | "assistant"
  content: string
}

function buildSystemMessage(context: ChatContext): string {
  const ticketList = context.tickets
    .map((t) => `  - [${t.status}] ${t.title}`)
    .join("\n")

  return `You are Charizard, an AI coding agent helping with a software project.

## Project
- Name: ${context.project.name}
- Repository: ${context.project.repoOwner}/${context.project.repoName}
- Branch: ${context.project.branch}

## Current Feature
- Title: ${context.epic.title}
- Status: ${context.epic.status}
- Priority: ${context.epic.priority}

### Tickets
${ticketList || "  No tickets yet."}

### Feature Content
${context.epic.content}

## Instructions
- Plan files live under plans/features/ in the repo.
- When modifying plans or code, push changes to the branch.
- Be concise and helpful. Reference specific tickets and files when relevant.
- If the user asks you to change a plan, create, or modify tickets — do it by editing the markdown files and pushing.`
}

async function enrichCommits(fullContent: string, context: ChatContext | undefined) {
  const commitRefs = parseCommitRefs(fullContent)
  if (commitRefs.length === 0 || !context) return undefined

  const githubPat = process.env.GITHUB_PAT
  const { repoOwner, repoName } = context.project

  if (githubPat) {
    const commits = await Promise.all(
      commitRefs.map(async (ref) => {
        try {
          const ghRes = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${ref.hash}`,
            { headers: { Authorization: `Bearer ${githubPat}`, Accept: "application/vnd.github.v3+json" } },
          )
          if (!ghRes.ok) return { hash: ref.hash.slice(0, 7), message: ref.message ?? "Unknown commit", url: `https://github.com/${repoOwner}/${repoName}/commit/${ref.hash}`, filesChanged: 0 }
          const ghData = await ghRes.json()
          return {
            hash: ref.hash.slice(0, 7),
            message: ghData.commit?.message?.split("\n")[0] ?? ref.message ?? "",
            url: ghData.html_url,
            filesChanged: ghData.files?.length ?? 0,
          }
        } catch {
          return { hash: ref.hash.slice(0, 7), message: ref.message ?? "", url: `https://github.com/${repoOwner}/${repoName}/commit/${ref.hash}`, filesChanged: 0 }
        }
      }),
    )
    return { commits }
  }

  return {
    commits: commitRefs.map((ref) => ({
      hash: ref.hash.slice(0, 7),
      message: ref.message ?? "",
      url: `https://github.com/${repoOwner}/${repoName}/commit/${ref.hash}`,
      filesChanged: 0,
    })),
  }
}

export async function POST(request: Request) {
  const convex = getConvex()
  const { epicId, message, context, history } = (await request.json()) as {
    epicId: string
    message: string
    context?: ChatContext
    history?: HistoryMessage[]
  }

  const baseURL = process.env.OPENCLAW_BASE_URL
  const apiKey = process.env.OPENCLAW_API_KEY
  const model = process.env.OPENCLAW_MODEL ?? "openclaw:main"

  if (!baseURL || !apiKey) {
    await convex.mutation(api.chat.saveAssistantMessage, {
      epicId: epicId as Id<"epics">,
      content: "Chat is not configured yet. Set OPENCLAW_BASE_URL and OPENCLAW_API_KEY in .env.local.",
    })
    return new Response("Chat not configured", { status: 503 })
  }

  // Build messages for OpenAI-compatible API
  const allMessages: Array<{ role: string; content: string }> = []
  if (context) {
    allMessages.push({ role: "system", content: buildSystemMessage(context) })
  }
  for (const m of history ?? []) {
    allMessages.push({ role: m.role, content: m.content })
  }
  allMessages.push({ role: "user", content: message })

  try {
    console.log("[chat] Calling OpenClaw:", baseURL, "model:", model)

    const res = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        user: "juan",
        stream: true,
      }),
    })

    console.log("[chat] Response:", res.status, res.headers.get("content-type"))

    if (!res.ok) {
      const error = await res.text()
      console.error("[chat] Error:", error)
      await convex.mutation(api.chat.saveAssistantMessage, {
        epicId: epicId as Id<"epics">,
        content: `Error from agent: ${res.status} — ${error}`,
      })
      return new Response(error, { status: 502 })
    }

    if (!res.body) {
      return new Response("No response body", { status: 502 })
    }

    // Stream SSE from OpenClaw → plain text to client
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    let fullContent = ""

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = ""
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() ?? ""

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue
              const data = line.slice(6).trim()
              if (data === "[DONE]") continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  fullContent += content
                  // Send plain text chunks to client
                  controller.enqueue(encoder.encode(content))
                }
              } catch {
                // skip malformed
              }
            }
          }

          controller.close()
          console.log("[chat] Stream done, length:", fullContent.length)

          // Save to Convex
          if (fullContent) {
            const metadata = await enrichCommits(fullContent, context)
            await convex.mutation(api.chat.saveAssistantMessage, {
              epicId: epicId as Id<"epics">,
              content: fullContent,
              metadata,
            })
          }
        } catch (error) {
          console.error("[chat] Stream error:", error)
          controller.error(error)
          const msg = error instanceof Error ? error.message : "Stream error"
          await convex.mutation(api.chat.saveAssistantMessage, {
            epicId: epicId as Id<"epics">,
            content: `Stream error: ${msg}`,
          })
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error"
    console.error("[chat] Fatal error:", msg)
    await convex.mutation(api.chat.saveAssistantMessage, {
      epicId: epicId as Id<"epics">,
      content: `Failed to reach agent: ${msg}`,
    })
    return new Response(msg, { status: 500 })
  }
}
