import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ChatDocsPage() {
  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/docs"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back to Docs
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">OpenClaw Chat</h1>
        <p className="mt-2 text-muted-foreground">
          A super-chat wired to your AI agent — not a generic assistant. Every message has full awareness of your feature, tickets, repo, and open files.
        </p>
      </div>

      {/* What it is */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What it is</h2>
        <p className="leading-relaxed text-muted-foreground">
          The chat panel is the primary interface for working with your OpenClaw agent (Charizard) on a per-feature basis.
          It&apos;s not a generic AI chat — it&apos;s a <strong>context-aware command center</strong> where you can
          create tickets, update statuses, push changes to GitHub, review code, and get answers about your feature,
          all in a single conversation.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Each feature (epic) has its own isolated chat history. When you open the feature view, the chat loads
          that epic&apos;s conversation — no context from other features bleeds in.
        </p>
      </section>

      {/* How it works */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How it works</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Send", desc: "You type a message. Your draft is auto-saved to localStorage while you type." },
            { step: "2", label: "Context build", desc: "The hook assembles context: project, repo, branch, epic, tickets, plan content, active file, and the last 12 messages as history." },
            { step: "3", label: "Proxy", desc: "A Next.js API route at /api/chat forwards the request to OpenClaw, keeping credentials server-side." },
            { step: "4", label: "Stream", desc: "OpenClaw streams the response via SSE. Tokens appear in real time — typing indicator first, then incremental rendering." },
            { step: "5", label: "Persist", desc: "The final message is saved in Convex (chatMessages table). Metadata like commit refs and action cards is parsed and stored separately." },
            { step: "6", label: "Render", desc: "Agent messages are rendered as full markdown with syntax highlighting, clickable links, commit cards, GitHub link previews, and action cards." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground"> &mdash; {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Context injection */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What Charizard knows</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every request includes a rich system message with:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li><strong>Project:</strong> name, GitHub repo owner/name, working branch</li>
          <li><strong>Epic:</strong> title, status, priority, plan content (up to 2000 chars)</li>
          <li><strong>Tickets:</strong> all tickets with title, status, and plan content (up to 500 chars each)</li>
          <li><strong>Conversation history:</strong> last 12 messages (truncated to 600 chars each)</li>
          <li><strong>Active file:</strong> if you have a file open in the code view, its path and content are injected</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Context is windowed and truncated to stay within the agent&apos;s context limit without sacrificing relevance.
        </p>
      </section>

      {/* Input features */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Input UX</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong>Ticket mentions (#):</strong> type <code className="rounded bg-muted px-1.5 py-0.5 text-sm">#</code> to open a searchable dropdown.
            Filters by ticket title and slug. Select to insert <code className="rounded bg-muted px-1.5 py-0.5 text-sm">#slug</code> — Charizard resolves it into full ticket context.
          </li>
          <li>
            <strong>Slash commands (/):</strong> type <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/</code> at the start of a message to open the command palette.
            Available: <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/create-ticket</code>, <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/sync</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/tickets</code>, <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/update-status</code>.
            Selecting a command pre-fills the input with a template.
          </li>
          <li>
            <strong>Paste images (Ctrl+V):</strong> paste screenshots directly into the chat. They upload to Convex file storage and are sent inline with your message. Up to 4 images per message.
          </li>
          <li>
            <strong>Message queue:</strong> send a message while a response is streaming — it queues and sends automatically when the current stream finishes (Slack-style).
          </li>
          <li>
            <strong>Draft persistence:</strong> your unfinished message is saved to localStorage as you type (debounced). It&apos;s restored when you come back. Drafts expire after 24 hours.
          </li>
          <li>
            <strong>Active file pill:</strong> when a file is open in the code view, a dismissible pill appears above the input. That file&apos;s content is injected into the context of your next message.
          </li>
        </ul>
      </section>

      {/* Streaming & controls */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Streaming controls</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong>Stop button:</strong> cancels the in-flight stream via <code className="rounded bg-muted px-1.5 py-0.5 text-sm">AbortController</code>.
            The partial response is saved to Convex and marked as interrupted with a visible amber banner.
          </li>
          <li>
            <strong>Retry button:</strong> appears on hover on any agent message. Re-sends the preceding user message and replaces the agent response.
          </li>
          <li>
            <strong>Stream reconnect:</strong> if you reload the page mid-stream, orphaned streaming messages are detected on mount and marked as interrupted automatically.
          </li>
          <li>
            <strong>Scroll-to-bottom button:</strong> appears when you scroll up. Smooth-scrolls back to the latest message.
          </li>
          <li>
            <strong>Load earlier messages:</strong> by default, only the most recent messages are loaded. A &quot;load earlier&quot; button fetches the full history.
          </li>
        </ul>
      </section>

      {/* Message rendering */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Message rendering</h2>
        <p className="leading-relaxed text-muted-foreground">
          Agent messages are rendered as rich content — not plain text:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li><strong>Full markdown:</strong> headings, lists, tables, blockquotes, bold/italic</li>
          <li><strong>Syntax-highlighted code blocks:</strong> auto-detects language, styled for readability</li>
          <li><strong>Clickable links:</strong> URLs rendered as <code className="rounded bg-muted px-1.5 py-0.5 text-sm">&lt;a&gt;</code> tags, open in new tab</li>
          <li>
            <strong>GitHub link preview cards:</strong> GitHub URLs are auto-extracted and enriched with repo metadata via the GitHub API
          </li>
          <li>
            <strong>Commit cards:</strong> commit refs in agent messages are parsed and rendered as branded cards (GitHub dark theme / Bitbucket). Shows hash, message, files changed, and a &quot;View diff&quot; button.
          </li>
          <li>
            <strong>Commit diff panel:</strong> click &quot;View diff&quot; on a GitHub commit card to open a full file-by-file diff panel
          </li>
          <li>
            <strong>Agent action cards:</strong> when Charizard creates a ticket, updates a status, or triggers a sync, it includes a structured <code className="rounded bg-muted px-1.5 py-0.5 text-sm">&lt;actions&gt;[...]&lt;/actions&gt;</code> block.
            These are parsed and rendered as visual action cards below the message.
          </li>
        </ul>
      </section>

      {/* Header tools */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Header tools</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li><strong>Plan / Code toggle:</strong> switch between plan view and code view without leaving the chat</li>
          <li><strong>Connection indicator:</strong> green dot when OpenClaw is reachable</li>
          <li>
            <strong>Token counter:</strong> shows <code className="rounded bg-muted px-1.5 py-0.5 text-sm">Xk / 200k tokens</code> with a color-coded dot
            (green → yellow → red as context fills). Hidden until there are messages with token data.
          </li>
          <li>
            <strong>Export:</strong> downloads the full conversation as a <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.md</code> file
            named <code className="rounded bg-muted px-1.5 py-0.5 text-sm">chat-{"{epic-slug}"}-{"{date}"}.md</code>
          </li>
          <li><strong>Theme toggle:</strong> dark / light mode</li>
        </ul>
      </section>

      {/* Full loop */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The full loop: chat → commit → live update</h2>
        <p className="leading-relaxed text-muted-foreground">
          Charizard doesn&apos;t just answer questions — it can directly modify your plan files and push to GitHub.
          When it does, the auto-sync fires and your Kanban updates in real time.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "You ask", desc: "\"Create a ticket for syntax highlighting in the chat\"" },
            { step: "2", label: "Charizard writes", desc: "Creates plans/features/chat/syntax-highlighting.md in the repo clone on the VPS" },
            { step: "3", label: "Git push", desc: "Charizard commits and pushes to the main branch" },
            { step: "4", label: "Webhook fires", desc: "GitHub sends a webhook to Convex — plan files changed" },
            { step: "5", label: "Sync runs", desc: "Convex fetches and parses the new ticket from GitHub" },
            { step: "6", label: "Live update", desc: "The ticket appears in Speedy in real time — no refresh needed" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground"> &mdash; {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          This works because Charizard runs on the same VPS as OpenClaw, has a deploy key on the repo,
          and the GitHub auto-sync webhook is configured for the project.
        </p>
      </section>

      {/* Agent repo access */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Giving the agent repo access</h2>
        <p className="leading-relaxed text-muted-foreground">
          For Charizard to push plan changes, the OpenClaw VPS needs a deploy key with write access:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          <li>Get the agent&apos;s public SSH key (ask Charizard — it lives in <code className="rounded bg-muted px-1.5 py-0.5 text-sm">~/.ssh/id_ed25519_github.pub</code>)</li>
          <li>Go to your repo → <strong>Settings → Deploy keys → Add deploy key</strong></li>
          <li>Paste the key and enable <strong>&quot;Allow write access&quot;</strong></li>
          <li>Clone the repo on the VPS: Charizard does this automatically on first use</li>
        </ol>
      </section>

      {/* Technical details */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Technical details</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong>Protocol:</strong> OpenAI-compatible <code className="rounded bg-muted px-1.5 py-0.5 text-sm">POST /v1/chat/completions</code> with SSE streaming
          </li>
          <li>
            <strong>Proxy:</strong> Next.js API route at <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/api/chat</code> — credentials never exposed to the client
          </li>
          <li>
            <strong>Storage:</strong> Convex <code className="rounded bg-muted px-1.5 py-0.5 text-sm">chatMessages</code> table — reactive queries, no polling
          </li>
          <li>
            <strong>Images:</strong> uploaded to Convex file storage, referenced by URL in the message content
          </li>
          <li>
            <strong>Memory:</strong> Charizard maintains cross-session memory via OpenClaw memory files on the VPS (<code className="rounded bg-muted px-1.5 py-0.5 text-sm">~/.openclaw/workspace/memory/</code>)
          </li>
        </ul>
      </section>

      {/* Env vars */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Environment variables</h2>
        <pre className="rounded-md bg-muted p-4 text-sm">
          {`OPENCLAW_BASE_URL=https://<tunnel>.trycloudflare.com/v1
OPENCLAW_API_KEY=<gateway-token>
OPENCLAW_MODEL=openclaw:main`}
        </pre>
      </section>
    </div>
  )
}
