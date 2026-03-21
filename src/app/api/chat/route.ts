import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { homedir } from "node:os"
import { ConvexHttpClient } from "convex/browser"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { parseCommitRefs } from "@/src/lib/helpers/parseCommitRefs"

// Creates an authenticated ConvexHttpClient using the user's session token
async function getAuthenticatedConvex(): Promise<ConvexHttpClient | null> {
  const token = await convexAuthNextjsToken()
  if (!token) return null
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  client.setAuth(token)
  return client
}

function getMemoryPath(projectId: string): string {
  return resolve(homedir(), ".openclaw", "workspace", "memory", `speedy-${projectId}.md`)
}

async function loadMemoryFile(projectId: string): Promise<string> {
  try {
    const content = await readFile(getMemoryPath(projectId), "utf-8")
    return content.trim()
  } catch {
    return ""
  }
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

function buildSystemMessage(context: ChatContext, memory?: string): string {
  const ticketList = context.tickets
    .map((t) => `  - [${t.status}] ${t.title}`)
    .join("\n")

  const repoPath = process.env.SPEEDY_REPO_PATH ?? `~/Projects/${context.project.repoName}`

  return `You are Charizard, an AI coding agent helping with a software project.

## Project
- Name: ${context.project.name}
- Repository: ${context.project.repoOwner}/${context.project.repoName}
- Branch: ${context.project.branch}
- Local repo path: ${repoPath}

## Current Feature
- Title: ${context.epic.title}
- Status: ${context.epic.status}
- Priority: ${context.epic.priority}

### Tickets
${ticketList || "  No tickets yet."}

### Feature Content
${context.epic.content}

## Plan File Format

Plan files live under \`plans/features/\` in the repo.

### Structure
- \`plans/features/<epic-slug>/_context.md\` — epic overview (required)
- \`plans/features/<epic-slug>/<ticket-slug>.md\` — one file per ticket
- Use **kebab-case** for all file and directory names

### File format (both epics and tickets)
\`\`\`
# Title

**Status:** todo
**Priority:** medium

## Section heading

- [x] Completed step
- [ ] Pending step
\`\`\`

### Allowed values
- **Status:** \`todo\` | \`in-progress\` | \`review\` | \`completed\` | \`blocked\`
- **Priority:** \`low\` | \`medium\` | \`high\` | \`critical\`

### Rules
- First \`# Heading\` becomes the title
- \`**Status:**\` and \`**Priority:**\` are parsed as bold-colon fields after the title
- Checklists (\`- [x]\` and \`- [ ]\`) are counted for progress tracking
- Only 2 levels deep: \`features/<epic>/<file>.md\`

## Creating and Modifying Plan Files

You CAN and MUST create or modify plan files when the user asks. Use your file-write and shell-exec tools to do this directly.

### How to create a new ticket
1. Write the file at \`${repoPath}/plans/features/<epic-slug>/<ticket-slug>.md\`
2. Use the exact format above (# Title, **Status:**, **Priority:**, then content)
3. Commit and push:
\`\`\`bash
cd ${repoPath}
git add plans/features/<epic-slug>/<ticket-slug>.md
git commit -m "feat(plans): create ticket <ticket-slug>"
git push
\`\`\`

### How to update a ticket (e.g. change status)
1. Read the existing file
2. Modify the relevant field (e.g. change \`**Status:** todo\` to \`**Status:** in-progress\`)
3. Commit and push:
\`\`\`bash
cd ${repoPath}
git add plans/features/<epic-slug>/<ticket-slug>.md
git commit -m "docs(plans): update <ticket-slug> status to in-progress"
git push
\`\`\`

### Commit message conventions
- Creating a ticket: \`feat(plans): create ticket <slug>\`
- Updating status: \`docs(plans): update <slug> status to <new-status>\`
- Updating content: \`docs(plans): update <slug> description\`
- Creating an epic: \`feat(plans): create epic <slug>\`
- Multiple changes: \`docs(plans): update tickets for <epic>\`

### Examples

**User:** "Create a ticket for dark mode toggle in the UI epic"
**You:** Create file \`plans/features/ui/dark-mode-toggle.md\`, commit with \`feat(plans): create ticket dark-mode-toggle\`, push, and confirm.

**User:** "Move syntax-highlighting to in-progress"
**You:** Edit \`plans/features/chat/syntax-highlighting.md\`, change \`**Status:** todo\` → \`**Status:** in-progress\`, commit with \`docs(plans): update syntax-highlighting status to in-progress\`, push, and confirm.

**User:** "Create a high-priority ticket for API rate limiting"
**You:** Determine the right epic, create the file with \`**Priority:** high\`, commit, push.

### Safety
- Only push to the branch: \`${context.project.branch}\`
- Only modify files under \`plans/features/\`
- Always pull before making changes: \`git pull --rebase\` to avoid conflicts
- If a push fails, report the error — do not force-push

## Structured Actions

When you perform actions like creating tickets, updating statuses, or triggering syncs, include a structured JSON block at the END of your response using this exact format:

\`\`\`
<actions>
[
  { "type": "ticket-created", "title": "feat/dark-mode", "detail": "todo" },
  { "type": "status-updated", "title": "wire-convex", "detail": "in-progress" },
  { "type": "sync-triggered", "title": "speedy-gonzales" }
]
</actions>
\`\`\`

Allowed action types: \`ticket-created\`, \`status-updated\`, \`sync-triggered\`.
Always include the \`<actions>\` block when you perform any of these actions. Do NOT include it if no actions were performed.

## Project Memory

You have a persistent memory file at \`~/.openclaw/workspace/memory/speedy-${context.project.name}.md\`.
You MUST update this file when:
- Important decisions are made (architecture, tech choices, rejected alternatives)
- User preferences or conventions are established
- Relevant technical context emerges (gotchas, env setup, deployment notes)

Format: bullet points with date prefix, e.g. \`- (2026-03-21) Decided to use Tailwind over styled-components\`

To update memory, write to the file using your shell-exec tool:
\`\`\`bash
cat >> ~/.openclaw/workspace/memory/speedy-${context.project.name}.md << 'MEMORY'
- (YYYY-MM-DD) Your note here
MEMORY
\`\`\`
${memory ? `\n### Memory from previous sessions\n${memory}\n` : ""}
## Instructions
- When modifying plans or code, push changes to the branch.
- Be concise and helpful. Reference specific tickets and files when relevant.
- If the user asks you to change a plan, create, or modify tickets — do it by editing the markdown files and pushing.
- Always confirm what you did after creating or modifying files (file path, commit hash).`
}

// --- Structured actions: stream filter + extraction ---

type StructuredAction = {
  type: "ticket-created" | "status-updated" | "sync-triggered"
  title: string
  detail?: string
}

/** Creates a stateful filter that strips `<actions>...</actions>` from streamed chunks. */
function createActionsFilter() {
  let tagBuffer = ""
  let actionsContent = ""
  let insideActions = false

  return {
    /** Returns only the visible portion of the chunk (actions block stripped). */
    filter(chunk: string): string {
      let visible = ""

      for (const ch of chunk) {
        if (insideActions) {
          actionsContent += ch
          if (actionsContent.endsWith("</actions>")) {
            insideActions = false
          }
        } else if (tagBuffer.length > 0 || ch === "<") {
          tagBuffer += ch
          if ("<actions>".startsWith(tagBuffer)) {
            if (tagBuffer === "<actions>") {
              insideActions = true
              actionsContent = ""
              tagBuffer = ""
            }
          } else {
            visible += tagBuffer
            tagBuffer = ""
          }
        } else {
          visible += ch
        }
      }

      return visible
    },
    /** Flush any remaining buffered characters (e.g. partial `<act` at end of stream). */
    flush(): string {
      const remaining = tagBuffer
      tagBuffer = ""
      return remaining
    },
    /** Returns the raw content captured between `<actions>` tags. */
    getRawActions(): string {
      return actionsContent
    },
  }
}

/** Extracts and parses structured actions from the raw content between `<actions>` tags. */
function parseStructuredActions(raw: string): StructuredAction[] | undefined {
  if (!raw) return undefined
  // Strip the closing tag if present
  const json = raw.replace(/<\/actions>$/, "").trim()
  if (!json) return undefined
  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed)) return undefined
    return parsed as StructuredAction[]
  } catch {
    console.error("[chat] Failed to parse structured actions:", json.slice(0, 200))
    return undefined
  }
}

/** Strips `<actions>...</actions>` block from a complete string (used for saved content). */
function stripActionsBlock(content: string): string {
  return content.replace(/<actions>[\s\S]*?<\/actions>/g, "").trim()
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
  // Auth check: reject unauthenticated requests
  const convex = await getAuthenticatedConvex()
  if (!convex) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { epicId, projectId, message, context, history } = (await request.json()) as {
    epicId: string
    projectId?: string
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

  // Load cross-session memory if projectId is available
  const memory = projectId ? await loadMemoryFile(projectId) : ""

  // Build messages for OpenAI-compatible API
  const allMessages: Array<{ role: string; content: string }> = []
  if (context) {
    allMessages.push({ role: "system", content: buildSystemMessage(context, memory || undefined) })
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
        stream_options: { include_usage: true },
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

    // Create the assistant message in Convex BEFORE streaming begins
    const streamingMessageId = await convex.mutation(api.chat.createStreamingMessage, {
      epicId: epicId as Id<"epics">,
    })

    // Stream SSE from OpenClaw → plain text to client
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    let fullContent = ""
    let totalTokens: number | undefined
    const actionsFilter = createActionsFilter()

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
                  // Filter out <actions> block before sending to client
                  const visible = actionsFilter.filter(content)
                  if (visible) {
                    controller.enqueue(encoder.encode(visible))
                  }
                }
                // Capture usage from the final chunk (OpenAI streaming with include_usage)
                if (parsed.usage?.total_tokens) {
                  totalTokens = parsed.usage.total_tokens
                }
              } catch {
                // skip malformed
              }
            }
          }

          // Flush any remaining buffered tag characters
          const flushed = actionsFilter.flush()
          if (flushed) {
            controller.enqueue(encoder.encode(flushed))
          }

          // Parse structured actions from the filtered block
          const actions = parseStructuredActions(actionsFilter.getRawActions())

          // Finalize the message in Convex BEFORE closing the controller
          // Save content WITHOUT the <actions> block
          const cleanContent = stripActionsBlock(fullContent)
          try {
            const metadata: Record<string, unknown> = {
              ...(await enrichCommits(fullContent, context)),
              ...(actions ? { actions } : {}),
            }
            await convex.mutation(api.chat.finalizeStreamingMessage, {
              messageId: streamingMessageId,
              content: cleanContent || "",
              metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
              tokenCount: totalTokens,
            })
          } catch (saveError) {
            console.error("[chat] Failed to finalize message:", saveError)
          }

          controller.close()
          console.log("[chat] Stream done, length:", fullContent.length)
        } catch (error) {
          console.error("[chat] Stream error:", error)
          // Mark the message as interrupted with whatever partial content we have
          try {
            await convex.mutation(api.chat.finalizeStreamingMessage, {
              messageId: streamingMessageId,
              content: fullContent || (error instanceof Error ? `Stream error: ${error.message}` : "Stream error"),
              isInterrupted: true,
            })
          } catch {
            // ignore save errors during error handling
          }
          try {
            controller.error(error)
          } catch {
            // controller may already be closed
          }
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Message-Id": streamingMessageId,
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
