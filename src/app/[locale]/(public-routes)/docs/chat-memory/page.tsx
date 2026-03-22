import { ArrowLeft, Brain, Database, FolderTree, MessageSquare, RefreshCw, Sparkles, Layers } from "lucide-react"
import Link from "next/link"

export default function ChatMemoryDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">Chat Memory</h1>
        <p className="mt-2 text-muted-foreground">
          How Speedy Gonzales gives the AI agent full project context — automatically.
        </p>
      </div>

      {/* The problem */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The problem with generic chat</h2>
        <p className="leading-relaxed text-muted-foreground">
          In tools like Slack, ChatGPT, or GitHub Copilot Chat, every conversation starts
          from zero. You have to explain your project, paste code snippets, describe the
          current state. The AI has no idea what you&apos;re building unless you tell it —
          every single time.
        </p>
      </section>

      {/* How Speedy does it */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Context from the repo, not the conversation</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy Gonzales takes a different approach. When you open the chat for a feature
          like <code className="rounded bg-muted px-1.5 py-0.5 text-sm">payments/stripe-setup</code>,
          the system automatically injects:
        </p>
        <div className="flex flex-col gap-2">
          {[
            { icon: FolderTree, label: "Epic plan", desc: "The full _context.md with overview, status, and dependencies" },
            { icon: Database, label: "Ticket state", desc: "All tickets with their status, priority, and content (truncated)" },
            { icon: RefreshCw, label: "Project info", desc: "Repository, branch, owner — so the agent knows where to push" },
            { icon: MessageSquare, label: "Chat history", desc: "Last 12 messages — the agent remembers the recent conversation window" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <item.icon className="size-3.5 text-primary" />
              </div>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground"> &mdash; {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Structured > loose */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Structured data beats loose text</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Because plan files follow a strict spec (<code className="rounded bg-muted px-1.5 py-0.5 text-sm">**Status:** in-progress</code>,
          checklists, ticket files), the AI agent receives <strong>structured, parseable context</strong> — not
          a wall of unformatted text. This means:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>The agent knows exactly which tickets are done and which are pending</li>
          <li>It can reference specific tickets by name when suggesting changes</li>
          <li>It understands the project hierarchy: project → epic → tickets</li>
          <li>When it modifies plans, the auto-sync picks up changes immediately</li>
        </ul>
      </section>

      {/* Persistence */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Persistence across sessions</h2>
        <p className="leading-relaxed text-muted-foreground">
          Chat history is stored in a Convex <code className="rounded bg-muted px-1.5 py-0.5 text-sm">chat_messages</code> table,
          scoped per epic. When you return to a feature days later, the agent sees the last 12 messages
          as its active history window, combined with the always-fresh plan data from auto-sync.
        </p>
      </section>

      {/* Two kinds of memory */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Two kinds of memory — and why both matter</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          When you chat with the agent, there are actually <strong>two completely separate memory systems</strong> working
          together. Understanding the difference is key to understanding why the agent feels so aware.
        </p>

        {/* Analogy callout */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-5 py-4 space-y-1">
          <p className="text-sm font-semibold text-primary">🧠 The human analogy</p>
          <p className="text-sm text-muted-foreground">
            Think of a senior developer joining your team. They bring two things:
            their <strong>career knowledge</strong> (everything they've learned across all their jobs — patterns, habits, preferences)
            and their <strong>project notebook</strong> (notes specific to your codebase, your team's decisions, what happened last sprint).
            The agent works exactly the same way.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Layer 1: OpenClaw long-term memory */}
          <div className="rounded-lg border border-border bg-muted/30 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-orange-500/10">
                <Sparkles className="size-4 text-orange-500" />
              </div>
              <span className="font-semibold">Layer 1 — OpenClaw Long-Term Memory</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The agent (Charizard) has a personal memory that lives outside of any specific project.
              It's stored as Markdown files on the server (<code className="rounded bg-muted px-1 py-0.5">MEMORY.md</code>, daily notes)
              and indexed with vector embeddings for semantic search.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Persists <strong>across all conversations</strong>, forever</li>
              <li>Global — shared across every project and channel</li>
              <li>The agent writes to it when it learns something important</li>
              <li>Works even in Telegram, Discord, or any other surface</li>
            </ul>
            <p className="text-xs text-muted-foreground/70 italic">
              → This is the developer's career knowledge. It never resets.
            </p>
          </div>

          {/* Layer 2: Convex chat history */}
          <div className="rounded-lg border border-border bg-muted/30 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
                <Database className="size-4 text-blue-500" />
              </div>
              <span className="font-semibold">Layer 2 — Speedy Chat Context Window</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              On top of that, Speedy Gonzales wraps the conversation with a project-specific context layer.
              Each time you send a message, the system assembles a payload that includes the chat history
              <em>plus</em> the full state of the current feature — plans, tickets, repo info.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Scoped to a single epic — isolated per feature</li>
              <li>Last 12 messages, truncated to fit token limits</li>
              <li>Combined with live plan data from every message</li>
              <li>Built by Speedy's <code className="rounded bg-muted px-1 py-0.5">/api/chat</code> route on each request</li>
            </ul>
            <p className="text-xs text-muted-foreground/70 italic">
              → This is the project notebook. Fresh every feature, updated in real time.
            </p>
          </div>
        </div>

        {/* How they stack */}
        <div className="rounded-lg border border-border bg-muted/20 px-5 py-4 space-y-2">
          <p className="text-sm font-semibold">How they stack together on every message</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {[
              { tag: "OpenClaw", color: "bg-orange-500", text: "Long-term agent memory — who I am, what I know, past decisions across all projects" },
              { tag: "System prompt", color: "bg-purple-500", text: "Project info, epic plan, all ticket statuses — injected automatically by Speedy" },
              { tag: "History", color: "bg-blue-500", text: "Last 12 messages from this feature's chat (stored in Convex)" },
              { tag: "Your message", color: "bg-green-500", text: "What you just typed — the only thing you have to provide" },
            ].map((item) => (
              <div key={item.tag} className="flex items-start gap-3">
                <span className={`mt-0.5 inline-block shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold text-white ${item.color}`}>
                  {item.tag}
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/70 italic pt-1">
            Everything except your message is assembled and sent automatically — you never have to paste context again.
          </p>
        </div>
      </section>

      {/* The loop */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The bidirectional loop</h2>
        <p className="leading-relaxed text-muted-foreground">
          This is what makes Speedy Gonzales unique — the chat closes a full loop:
        </p>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", desc: "You ask the agent to modify a plan or create a ticket" },
            { step: "2", desc: "The agent edits markdown files and pushes to GitHub" },
            { step: "3", desc: "The webhook fires and auto-sync updates Convex" },
            { step: "4", desc: "The kanban board and plan viewer update in real time" },
            { step: "5", desc: "Next message you send includes the updated state" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </span>
              <span className="text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* vs traditional */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Comparison</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2.5 text-left font-medium" />
                <th className="px-4 py-2.5 text-left font-medium">Generic chat</th>
                <th className="px-4 py-2.5 text-left font-medium">Speedy Gonzales</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-t border-border">
                <td className="px-4 py-2.5 font-medium text-foreground">Context</td>
                <td className="px-4 py-2.5">You paste it manually</td>
                <td className="px-4 py-2.5">Auto-injected from plan files</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5 font-medium text-foreground">Memory</td>
                <td className="px-4 py-2.5">Resets every session</td>
                <td className="px-4 py-2.5">Persisted in Convex</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5 font-medium text-foreground">Data format</td>
                <td className="px-4 py-2.5">Unstructured text</td>
                <td className="px-4 py-2.5">Parsed plan spec fields</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5 font-medium text-foreground">Actions</td>
                <td className="px-4 py-2.5">Copy-paste suggestions</td>
                <td className="px-4 py-2.5">Push to repo → auto-sync</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
