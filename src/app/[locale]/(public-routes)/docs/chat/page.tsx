import { ArrowLeft, ArrowRight, Brain, Cpu, FileCode, GitCommit, Image, MessageSquare, Pause, RefreshCw, Search, Send, Sparkles, Terminal, Zap } from "lucide-react"
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
          Not a generic AI assistant. A super-chat wired directly to Charizard — your AI agent — with full awareness of your project, feature, tickets, code, and memory.
        </p>
      </div>

      {/* What makes it different */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What makes it different</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every other AI chat starts from zero — you paste context, explain your project, describe what you&apos;re building. Charizard already knows.
          When you open the chat for a feature, the agent is automatically aware of:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Your project name, GitHub repo, and working branch</li>
          <li>The feature (epic) title, status, priority, and plan content</li>
          <li>Every ticket — title, status, and plan content</li>
          <li>The file you have open in the code view (if any)</li>
          <li>The last 12 messages of the conversation as history</li>
          <li>Long-term memory from previous sessions (decisions, preferences, architecture choices)</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          You don&apos;t have to repeat yourself. The agent picks up where you left off.
        </p>
      </section>

      {/* The full feature list */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Everything it can do</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Sparkles,
              title: "Streaming responses",
              desc: "Tokens appear in real time as Charizard types. Typing indicator → blinking cursor → full message. Never stares at a blank screen.",
            },
            {
              icon: Brain,
              title: "Cross-session memory",
              desc: "Charizard maintains memory files on the VPS. Decisions, architecture choices, and preferences survive across sessions — nothing is forgotten.",
            },
            {
              icon: MessageSquare,
              title: "Ticket mentions (#)",
              desc: "Type # to open a searchable dropdown. Select a ticket to inject #slug into your message — Charizard resolves it into full ticket context.",
            },
            {
              icon: Terminal,
              title: "Slash commands (/)",
              desc: "Type / at the start of a message to open the command palette. Pre-fills the input with a template for /create-ticket, /sync, /tickets, /update-status.",
            },
            {
              icon: Image,
              title: "Paste images (Ctrl+V)",
              desc: "Paste screenshots directly into the chat. They upload to Convex file storage and are sent inline. Up to 4 images per message.",
            },
            {
              icon: Send,
              title: "Message queue",
              desc: "Send a message while a response is streaming — it queues and sends automatically when the current stream finishes. Slack-style.",
            },
            {
              icon: FileCode,
              title: "Draft persistence",
              desc: "Your unfinished message is auto-saved to localStorage as you type (debounced 300ms). Restored when you come back. Expires after 24 hours.",
            },
            {
              icon: Pause,
              title: "Stop button",
              desc: "Cancel the in-flight stream via AbortController. Partial response is saved to Convex and marked as interrupted with an amber banner.",
            },
            {
              icon: RefreshCw,
              title: "Retry",
              desc: "Hover any agent message to see the retry button. Re-sends the preceding user message and replaces the response.",
            },
            {
              icon: Search,
              title: "File search (Cmd+P)",
              desc: "Open the file search palette from anywhere in the feature view. Browse and jump to files in the repo instantly.",
            },
            {
              icon: GitCommit,
              title: "Commit cards",
              desc: "Commit refs in agent messages are parsed into branded cards (GitHub dark / Bitbucket). Shows hash, message, files changed, and a diff viewer button.",
            },
            {
              icon: Zap,
              title: "Agent action cards",
              desc: "When Charizard creates a ticket, updates a status, or triggers a sync, it includes a structured <actions> block — rendered as visual cards below the message.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <item.icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How a message flows</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "You type", desc: "Draft auto-saved to localStorage. Ticket mentions and slash commands are resolved client-side." },
            { step: "2", label: "Context assembled", desc: "The hook builds the payload: system message (project + epic + tickets + active file + memory) + last 12 messages + your message." },
            { step: "3", label: "Proxied", desc: "Next.js API route at /api/chat forwards the request to OpenClaw over HTTPS. Credentials never exposed to the browser." },
            { step: "4", label: "Streamed", desc: "OpenClaw responds via SSE. Tokens render incrementally — you see Charizard typing in real time." },
            { step: "5", label: "Persisted", desc: "Final message saved to Convex (chatMessages table). Token count stored for the counter. Commit refs and action blocks parsed and stored separately." },
            { step: "6", label: "Rendered", desc: "Full markdown with syntax highlighting, clickable links, GitHub link previews, commit cards, and agent action cards." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground"> — {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The full loop */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The full loop: chat → commit → live update</h2>
        <p className="leading-relaxed text-muted-foreground">
          Charizard doesn&apos;t just answer questions — it can modify your plan files and push to GitHub.
          When it does, the auto-sync fires and your Kanban updates in real time. No manual step required.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "You ask", desc: "\"Create a ticket for dark mode support\"" },
            { step: "2", label: "Charizard writes", desc: "Creates plans/features/<epic>/dark-mode.md on the VPS" },
            { step: "3", label: "Git push", desc: "Commits and pushes to the main branch" },
            { step: "4", label: "Webhook fires", desc: "GitHub notifies Convex — plan files changed" },
            { step: "5", label: "Sync runs", desc: "Convex fetches and parses the new ticket from GitHub" },
            { step: "6", label: "Live update", desc: "Ticket appears in your Kanban instantly — no refresh" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground"> — {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best practices */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Best practices</h2>
        <div className="flex flex-col gap-3">
          {[
            {
              title: "Use ticket mentions instead of explaining context",
              desc: "Type #ticket-slug to pull a ticket's full context into your message. Way more reliable than hoping it's in the 12-message history window. Charizard sees the exact ticket content.",
            },
            {
              title: "Open the file you're talking about",
              desc: "If you need code review or help with a specific file, open it in the code view — it gets injected into the context automatically. Don't paste walls of code into the chat.",
            },
            {
              title: "Use slash commands for structured actions",
              desc: "Instead of typing \"create a ticket for X\", use /create-ticket. The command fills a template that Charizard parses reliably into a structured action.",
            },
            {
              title: "Paste images when text isn't enough",
              desc: "Got a bug in the UI? Screenshot it and paste with Ctrl+V. Charizard can analyze images — much faster than describing the problem in words.",
            },
            {
              title: "Don't worry about memory between sessions",
              desc: "Charizard maintains memory files on the VPS. Decisions you made last week, architecture choices, preferences — all stored and re-injected into every session automatically.",
            },
            {
              title: "Start a new feature for new work",
              desc: "Each feature has its own isolated chat. If you're starting something unrelated, create a new feature instead of continuing in an old thread. Keeps context clean.",
            },
            {
              title: "Stop and retry if the response is off",
              desc: "Use the Stop button to cancel mid-stream if Charizard is heading in the wrong direction. Retry from any message to get a fresh response.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Header tools */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Header tools</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li><strong>Plan / Code toggle:</strong> switch between plan view and code view without closing the chat</li>
          <li><strong>Connection dot:</strong> green when OpenClaw is reachable</li>
          <li><strong>Token counter:</strong> <code className="rounded bg-muted px-1.5 py-0.5 text-sm">Xk / 200k</code> with color-coded dot — tracks context usage</li>
          <li><strong>Export:</strong> downloads the conversation as <code className="rounded bg-muted px-1.5 py-0.5 text-sm">chat-{"{epic-slug}"}-{"{date}"}.md</code></li>
          <li><strong>Theme toggle:</strong> dark / light mode</li>
        </ul>
      </section>

      {/* Deep dives */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Go deeper</h2>
        <p className="text-sm text-muted-foreground">
          Two concepts power the chat&apos;s intelligence. Worth understanding both.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/chat-memory"
            className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <Brain className="size-4 text-primary" />
              </div>
              <span className="font-semibold">Chat Memory</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              How context injection works: plan files, ticket state, and long-term agent memory — all auto-injected so Charizard knows your project from day one.
            </p>
            <div className="mt-auto flex items-center gap-1 text-sm text-primary">
              <span>Read more</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
          <Link
            href="/docs/context-window"
            className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <Cpu className="size-4 text-primary" />
              </div>
              <span className="font-semibold">Context Window</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              What the token counter means, how history windowing works, when to start a fresh session, and why Chat Memory and Context Window are two separate things.
            </p>
            <div className="mt-auto flex items-center gap-1 text-sm text-primary">
              <span>Read more</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Setup */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Setup requirements</h2>
        <p className="text-sm text-muted-foreground">For the agent to push plan changes to GitHub:</p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          <li>Get Charizard&apos;s public SSH key (ask it — it lives in <code className="rounded bg-muted px-1.5 py-0.5 text-sm">~/.ssh/id_ed25519_github.pub</code> on the VPS)</li>
          <li>Go to your repo → <strong>Settings → Deploy keys → Add deploy key</strong></li>
          <li>Paste the key and enable <strong>&quot;Allow write access&quot;</strong></li>
          <li>Charizard clones the repo automatically on first use</li>
        </ol>
        <div className="mt-2">
          <p className="text-sm font-medium">Environment variables:</p>
          <pre className="mt-2 rounded-md bg-muted p-4 text-sm">
            {`OPENCLAW_BASE_URL=https://<tunnel>.trycloudflare.com/v1
OPENCLAW_API_KEY=<gateway-token>
OPENCLAW_MODEL=openclaw:main`}
          </pre>
        </div>
      </section>
    </div>
  )
}
