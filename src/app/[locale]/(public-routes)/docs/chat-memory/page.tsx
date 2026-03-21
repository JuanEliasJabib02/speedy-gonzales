import { ArrowLeft, Brain, Database, FolderTree, MessageSquare, RefreshCw } from "lucide-react"
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
            { icon: MessageSquare, label: "Chat history", desc: "Last 20 messages — the agent remembers previous conversations" },
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
          scoped per epic. When you return to a feature days later, the agent sees the full conversation
          history. Combined with the always-fresh plan data from auto-sync, the agent never loses context.
        </p>
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
