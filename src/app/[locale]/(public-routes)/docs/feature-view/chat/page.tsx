import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Brain,
  Database,
  FileCode,
  GitCommit,
  Image,
  Info,
  Layers,
  MessageSquare,
  Pause,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function ChatDocsPage() {
  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/docs/feature-view"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Feature View
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Chat</h1>
        <p className="mt-2 text-muted-foreground">
          Not a generic AI assistant. A super-chat wired directly to Charizard
          — your OpenClaw agent — with full awareness of your project, feature,
          tickets, code, and memory.
        </p>
      </div>

      {/* What makes it different */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What makes it different</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every other AI chat starts from zero — you paste context, explain your
          project, describe what you&apos;re building. Charizard already knows.
          When you open the chat for a feature, the agent is automatically aware
          of:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Your project name, GitHub repo, and working branch</li>
          <li>
            The feature (epic) title, status, priority, and plan content
          </li>
          <li>Every ticket — title, status, and plan content</li>
          <li>The file you have open in the code view (if any)</li>
          <li>The last 12 messages of the conversation as history</li>
          <li>
            Long-term memory from previous sessions (decisions, preferences,
            architecture choices)
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          You don&apos;t have to repeat yourself. The agent picks up where you
          left off.
        </p>
      </section>

      {/* Features grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Everything it can do</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: Sparkles,
              title: "Streaming responses",
              desc: "Tokens appear in real time as Charizard types. Typing indicator → blinking cursor → full message.",
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
              desc: "Type / to open the command palette. Templates for /create-ticket, /sync, /tickets, /update-status.",
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
              desc: "Your unfinished message is auto-saved to localStorage. Restored when you come back. Expires after 24 hours.",
            },
            {
              icon: Pause,
              title: "Stop button",
              desc: "Cancel the in-flight stream. Partial response is saved and marked as interrupted with an amber banner.",
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
              desc: "Commit refs in agent messages are parsed into branded cards. Shows hash, message, files changed, and a diff viewer button.",
            },
            {
              icon: Zap,
              title: "Agent action cards",
              desc: "When Charizard creates a ticket, updates a status, or triggers a sync, it renders structured visual cards below the message.",
            },
            {
              icon: Info,
              title: "Context summary card",
              desc: "At the top of the chat, a collapsible card shows the epic title, status, and ticket progress (e.g., \"3/8 done\"). Dismissible if you don't need it.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <item.icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Message area behavior */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Message area</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong>Load earlier messages:</strong> only the most recent messages
            are shown initially. Scroll to the top or click &quot;Load
            earlier&quot; to fetch older ones — no page jump.
          </li>
          <li>
            <strong>Auto-scroll:</strong> the chat scrolls to the bottom
            automatically as the agent streams. If you scroll up to re-read
            something, auto-scroll pauses. A &quot;scroll to bottom&quot; button
            appears when you&apos;re scrolled up.
          </li>
          <li>
            <strong>Multiline input:</strong> press{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              Shift+Enter
            </code>{" "}
            for a new line.{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              Enter
            </code>{" "}
            alone sends the message.
          </li>
          <li>
            <strong>Active file pill:</strong> when you have a file open in code
            view, its name appears as a pill above the input. The file content is
            automatically included in the context so the agent knows what
            you&apos;re looking at.
          </li>
        </ul>
      </section>

      {/* How a message flows */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How a message flows</h2>
        <div className="flex flex-col gap-2">
          {[
            {
              step: "1",
              label: "You type",
              desc: "Draft auto-saved to localStorage. Ticket mentions and slash commands are resolved client-side.",
            },
            {
              step: "2",
              label: "Context assembled",
              desc: "The hook builds the payload: system message (project + epic + tickets + active file + memory) + last 12 messages + your message.",
            },
            {
              step: "3",
              label: "Proxied",
              desc: "Next.js API route at /api/chat forwards the request to OpenClaw over HTTPS. Credentials never exposed to the browser.",
            },
            {
              step: "4",
              label: "Streamed",
              desc: "OpenClaw responds via SSE. Tokens render incrementally — you see Charizard typing in real time.",
            },
            {
              step: "5",
              label: "Persisted",
              desc: "Final message saved to Convex (chatMessages table). Token count stored for the counter.",
            },
            {
              step: "6",
              label: "Rendered",
              desc: "Full markdown with syntax highlighting, clickable links, commit cards, and agent action cards.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3"
            >
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
        <h2 className="text-xl font-semibold">
          The full loop: chat → commit → live update
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Charizard doesn&apos;t just answer questions — it can modify your plan
          files and push to GitHub. When it does, the auto-sync fires and your
          Kanban updates in real time.
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              step: "1",
              label: "You ask",
              desc: '"Create a ticket for dark mode support"',
            },
            {
              step: "2",
              label: "Charizard writes",
              desc: "Creates plans/features/<epic>/dark-mode.md on the VPS",
            },
            {
              step: "3",
              label: "Git push",
              desc: "Commits and pushes to the main branch",
            },
            {
              step: "4",
              label: "Webhook fires",
              desc: "GitHub notifies Convex — plan files changed",
            },
            {
              step: "5",
              label: "Sync runs",
              desc: "Convex fetches and parses the new ticket from GitHub",
            },
            {
              step: "6",
              label: "Live update",
              desc: "Ticket appears in your Kanban instantly — no refresh",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3"
            >
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

      {/* ===== CHAT MEMORY ===== */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">
            Chat Memory — two layers, one agent
          </h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          When you chat with Charizard, there are{" "}
          <strong>two separate memory systems</strong> working together.
          Understanding the difference is key.
        </p>

        {/* Analogy */}
        <div className="space-y-1 rounded-lg border border-primary/20 bg-primary/5 px-5 py-4">
          <p className="text-sm font-semibold text-primary">The analogy</p>
          <p className="text-sm text-muted-foreground">
            Think of a senior developer joining your team. They bring two things:
            their <strong>career knowledge</strong> (everything they&apos;ve
            learned across all jobs — patterns, habits, preferences) and their{" "}
            <strong>project notebook</strong> (notes specific to your codebase,
            your decisions, what happened last sprint). The agent works the same
            way.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Layer 1 */}
          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-5">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-orange-500/10">
                <Sparkles className="size-4 text-orange-500" />
              </div>
              <span className="font-semibold">
                OpenClaw Long-Term Memory
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Charizard keeps personal memory files on the server (
              <code className="rounded bg-muted px-1 py-0.5">MEMORY.md</code>,
              daily notes) indexed with vector embeddings. This is the
              developer&apos;s <em>career knowledge</em> — it never resets.
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>
                Persists <strong>across all conversations</strong>, forever
              </li>
              <li>Global — shared across every project and channel</li>
              <li>
                The agent writes to it when it learns something important
              </li>
              <li>Works in Telegram, Discord, or any surface</li>
            </ul>
          </div>

          {/* Layer 2 */}
          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-5">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
                <Database className="size-4 text-blue-500" />
              </div>
              <span className="font-semibold">
                Speedy Chat Context
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              On top of that, Speedy wraps the conversation with a
              project-specific context layer. Each message includes chat history{" "}
              <em>plus</em> the full state of the current feature. This is the{" "}
              <em>project notebook</em>.
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>Scoped to a single epic — isolated per feature</li>
              <li>Last 12 messages, truncated to fit token limits</li>
              <li>Combined with live plan data from auto-sync</li>
              <li>
                Built by Speedy&apos;s{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  /api/chat
                </code>{" "}
                route on each request
              </li>
            </ul>
          </div>
        </div>

        {/* Stack visualization */}
        <div className="space-y-2 rounded-lg border border-border bg-muted/20 px-5 py-4">
          <p className="text-sm font-semibold">
            What gets sent on every message
          </p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {[
              {
                tag: "OpenClaw",
                color: "bg-orange-500",
                text: "Long-term agent memory — who I am, what I know, past decisions",
              },
              {
                tag: "System prompt",
                color: "bg-purple-500",
                text: "Project info, epic plan, all ticket statuses — injected by Speedy",
              },
              {
                tag: "History",
                color: "bg-blue-500",
                text: "Last 12 messages from this feature's chat (stored in Convex)",
              },
              {
                tag: "Your message",
                color: "bg-green-500",
                text: "The only thing you have to provide",
              },
            ].map((item) => (
              <div key={item.tag} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-block shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold text-white ${item.color}`}
                >
                  {item.tag}
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <p className="pt-1 text-xs italic text-muted-foreground/70">
            Everything except your message is assembled automatically — you
            never paste context again.
          </p>
        </div>
      </section>

      {/* ===== CONTEXT WINDOW ===== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Context Window & Token Counter
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          In the chat header you&apos;ll see something like{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            4.2k / 200k tokens
          </code>{" "}
          with a colored dot. This tracks the cumulative tokens used across all
          messages in the current session.
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              icon: Activity,
              color: "text-green-500",
              bg: "bg-green-500/10",
              label: "Green — under 50%",
              desc: "Plenty of context. Full history without degradation.",
            },
            {
              icon: Activity,
              color: "text-yellow-500",
              bg: "bg-yellow-500/10",
              label: "Yellow — 50-80%",
              desc: "Filling up. Avoid pasting large code blobs.",
            },
            {
              icon: AlertTriangle,
              color: "text-red-500",
              bg: "bg-red-500/10",
              label: "Red — over 80%",
              desc: "Nearly full. Consider starting a fresh feature session.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3"
            >
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-md ${item.bg}`}
              >
                <item.icon className={`size-3.5 ${item.color}`} />
              </div>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {" "}
                  &mdash; {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Context vs Memory */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Context window vs. Chat memory — different things
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <span className="font-semibold">Context window</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              What the model <strong>actively processes</strong> in a single API
              call. Hard limit of 200k tokens. When it fills up, older messages
              get dropped.
            </p>
            <p className="text-xs text-muted-foreground">
              This is what the token counter tracks.
            </p>
          </div>
          <div className="space-y-2 rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-primary" />
              <span className="font-semibold">Chat memory</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Charizard&apos;s <strong>long-term memory</strong> stored in files
              on the VPS. Permanent — persists across sessions and is never lost.
            </p>
            <p className="text-xs text-muted-foreground">
              The token counter doesn&apos;t affect this.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Even if the context window goes red, Charizard&apos;s memory files are
          intact. What degrades is the <em>active conversation</em>, not
          long-term recall.
        </p>
      </section>

      {/* History windowing */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">
            History windowing — not all messages are sent
          </h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Speedy doesn&apos;t send the entire chat history on every message.
          Each request includes:
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              step: "1",
              label: "System message",
              desc: "Project info, repo, branch, epic plan, all ticket statuses, and active file. Always included.",
            },
            {
              step: "2",
              label: "Last 12 messages",
              desc: "Most recent turns, each truncated to 600 characters. Older messages are dropped.",
            },
            {
              step: "3",
              label: "Current message",
              desc: "What you just typed, including any images or ticket mentions.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {" "}
                  &mdash; {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          If you need to reference something from 15+ messages ago, use{" "}
          <strong>ticket mentions (#slug)</strong> to explicitly pull in that
          context.
        </p>
      </section>

      {/* Best practices */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Best practices</h2>
        <div className="flex flex-col gap-3">
          {[
            {
              title: "Use ticket mentions instead of explaining context",
              desc: "Type #ticket-slug to pull a ticket's full context into your message. Way more reliable than hoping it's in the 12-message history window.",
            },
            {
              title: "Open the file you're talking about",
              desc: "If you need code review or help with a file, open it in code view — it gets injected into context automatically. Don't paste walls of code.",
            },
            {
              title: "Use slash commands for structured actions",
              desc: "Instead of typing \"create a ticket for X\", use /create-ticket. The command fills a template that Charizard parses reliably.",
            },
            {
              title: "Paste images when text isn't enough",
              desc: "Got a bug in the UI? Screenshot it and paste with Ctrl+V. Charizard can analyze images — much faster than describing the problem.",
            },
            {
              title: "Don't worry about memory between sessions",
              desc: "Charizard maintains memory files on the VPS. Decisions from last week, architecture choices, preferences — all stored and re-injected automatically.",
            },
            {
              title: "Start a new feature for new work",
              desc: "Each feature has its own isolated chat. If you're starting something unrelated, create a new feature instead of continuing in an old thread.",
            },
            {
              title: "Stop and retry if the response is off",
              desc: "Use the Stop button to cancel mid-stream if Charizard is heading in the wrong direction. Retry from any message to get a fresh response.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-card p-4"
            >
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
          <li>
            <strong>Plan / Code toggle:</strong> switch between plan view and
            code view without closing the chat
          </li>
          <li>
            <strong>Connection dot:</strong> green when OpenClaw is reachable
          </li>
          <li>
            <strong>Token counter:</strong>{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              Xk / 200k
            </code>{" "}
            with color-coded dot — tracks context usage
          </li>
          <li>
            <strong>Export:</strong> downloads the conversation as a{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.md</code>{" "}
            file
          </li>
          <li>
            <strong>Theme toggle:</strong> dark / light mode
          </li>
        </ul>
      </section>

      {/* Setup */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Setup requirements</h2>
        <p className="text-sm text-muted-foreground">
          For the agent to push plan changes to GitHub:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          <li>
            Get Charizard&apos;s public SSH key (ask it — it lives in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              ~/.ssh/id_ed25519_github.pub
            </code>{" "}
            on the VPS)
          </li>
          <li>
            Go to your repo →{" "}
            <strong>Settings → Deploy keys → Add deploy key</strong>
          </li>
          <li>
            Paste the key and enable{" "}
            <strong>&quot;Allow write access&quot;</strong>
          </li>
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
