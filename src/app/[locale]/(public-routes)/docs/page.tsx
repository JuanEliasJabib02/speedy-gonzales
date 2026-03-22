import { Activity, ArrowRight, BookOpen, Brain, CheckCircle, Circle, Clock, Code, FolderTree, GitBranch, Heart, MessageSquare, Rocket, Zap } from "lucide-react"
import Link from "next/link"

const guides = [
  {
    title: "The Speedy Philosophy",
    description:
      "Why Speedy Gonzales exists. The vision of Juan Elias Jabib — developing at the speed of thought, with AI as a first-class teammate.",
    href: "/docs/philosophy",
    icon: Heart,
  },
  {
    title: "Setup Guide",
    description:
      "Connect your GitHub repo to Speedy Gonzales. Create a project, configure the webhook, and test auto-sync.",
    href: "/docs/setup",
    icon: Rocket,
  },
  {
    title: "Plan Structure",
    description:
      "How to organize your plans/ folder. Directory conventions, file format, parsed fields, and the spec the AI agent follows.",
    href: "/docs/plans",
    icon: FolderTree,
  },
  {
    title: "Source of Truth",
    description:
      "How plans, code, and AI stay in sync. Code is always right — plans adapt, tickets are created by comparing reality vs intent.",
    href: "/docs/source-of-truth",
    icon: Code,
  },
]

const features = [
  {
    title: "GitHub Auto-Sync",
    description:
      "Push your plans to GitHub and Speedy updates in real time. Webhook-powered, zero config after setup.",
    href: "/docs/sync",
    icon: GitBranch,
  },
  {
    title: "OpenClaw Chat",
    description:
      "The super-chat wired to your AI agent. Context injection, streaming, memory, agent actions, slash commands, ticket mentions, image uploads, and more — all in one panel.",
    href: "/docs/chat",
    icon: MessageSquare,
  },
  {
    title: "AI Development Workflow",
    description:
      "How to leverage Charizard and Perro salchicha for faster development. Best practices, chat patterns, and when to use AI.",
    href: "/docs/ai-workflow",
    icon: Zap,
  },
]

type SectionCard = {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

function CardGrid({ items }: { items: SectionCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
              <item.icon className="size-4 text-primary" />
            </div>
            <h3 className="font-semibold">{item.title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          <div className="mt-auto flex items-center gap-1 text-sm text-primary">
            <span>Learn more</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  )
}

const roadmapItems = [
  {
    status: "done" as const,
    label: "GitHub Auto-Sync",
    description: "Push plans to GitHub → Speedy updates in real time via webhook.",
  },
  {
    status: "done" as const,
    label: "Per-feature AI Chat",
    description: "OpenClaw chat with full context injection (project, tickets, plan, active file).",
  },
  {
    status: "done" as const,
    label: "Streaming UX",
    description: "ChatGPT-style incremental rendering with typing indicator and blinking cursor.",
  },
  {
    status: "done" as const,
    label: "Syntax Highlighting",
    description: "Code blocks in chat with copy button and language auto-detection.",
  },
  {
    status: "done" as const,
    label: "Markdown Rendering",
    description: "Full markdown in agent messages: headings, tables, blockquotes, lists.",
  },
  {
    status: "done" as const,
    label: "Ticket Mentions (#)",
    description: "Type # in chat to autocomplete and reference tickets inline.",
  },
  {
    status: "done" as const,
    label: "Slash Commands",
    description: "/create-ticket, /update-status, /sync, /tickets — agent actions from the input.",
  },
  {
    status: "done" as const,
    label: "Image Upload in Chat",
    description: "Paste screenshots directly into the chat (Ctrl+V). Up to 4 images per message.",
  },
  {
    status: "done" as const,
    label: "Stop Button",
    description: "Cancel a streaming response mid-generation. Partial content saved as interrupted.",
  },
  {
    status: "done" as const,
    label: "Retry Last Message",
    description: "Re-send the last message with one click if the response was bad.",
  },
  {
    status: "done" as const,
    label: "Export Conversation",
    description: "Download the full chat thread as a .md file.",
  },
  {
    status: "done" as const,
    label: "GitHub Link Preview",
    description: "Inline GitHub card previews when sharing commit/PR/issue links in chat.",
  },
  {
    status: "done" as const,
    label: "Commit Cards",
    description: "Commit refs in agent messages render as branded cards with diff viewer.",
  },
  {
    status: "done" as const,
    label: "Agent Action Cards",
    description: "Structured <actions> blocks rendered as visual cards (ticket-created, status-updated, sync-triggered).",
  },
  {
    status: "done" as const,
    label: "Draft Persistence",
    description: "Unfinished messages auto-saved to localStorage, restored when you return. 24h expiry.",
  },
  {
    status: "done" as const,
    label: "Message Queue",
    description: "Send a message while a response is streaming — it queues and sends automatically (Slack-style).",
  },
  {
    status: "done" as const,
    label: "Roadmap Modal",
    description: "Visual roadmap button per feature — all tickets by priority in a single modal.",
  },
  {
    status: "done" as const,
    label: "Chat Memory (Cross-Session)",
    description: "Charizard maintains memory files on the VPS. Decisions and context survive across sessions.",
  },
  {
    status: "done" as const,
    label: "Stream Reconnect",
    description: "Orphaned streaming messages on page reload are auto-detected and marked as interrupted.",
  },
  {
    status: "done" as const,
    label: "Code View + Chat Split",
    description: "Open any file in the code view alongside the chat. File content auto-injected as context.",
  },
  {
    status: "done" as const,
    label: "Chat Pagination",
    description: "Load earlier messages on demand. Default view shows only recent history for performance.",
  },
  {
    status: "in-progress" as const,
    label: "Agent Repo Push (Full Loop)",
    description: "Charizard creates tickets, pushes to GitHub, auto-sync fires — full agentic loop in review.",
  },
  {
    status: "in-progress" as const,
    label: "OpenClaw API Integration",
    description: "Connecting Speedy's API route to the full OpenClaw gateway with auth and session management.",
  },
  {
    status: "next" as const,
    label: "Production Login (Magic Link)",
    description: "Convex Auth + Resend email OTP for production deploy.",
    priority: "high",
  },
  {
    status: "next" as const,
    label: "Multi-agent Orchestration",
    description: "Spawn Perro salchicha (Codex/Claude Code) directly from the chat UI.",
    priority: "medium",
  },
  {
    status: "next" as const,
    label: "Voice Input",
    description: "Speak your message — transcribed and sent to the agent.",
    priority: "low",
  },
]

const statusConfig = {
  done: { label: "Done", icon: CheckCircle, color: "text-green-500" },
  "in-progress": { label: "In Progress", icon: Clock, color: "text-yellow-500" },
  next: { label: "Up Next", icon: Circle, color: "text-muted-foreground" },
}

const priorityConfig = {
  high: "bg-red-500/10 text-red-600 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  low: "bg-muted text-muted-foreground border-border",
}

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Speedy Gonzales
        </h1>
        <p className="text-lg text-muted-foreground">The AI Agents IDE</p>
        <p className="leading-relaxed text-muted-foreground">
          Speedy Gonzales connects your GitHub repositories with AI-powered
          project management. Write plans in markdown, sync them automatically,
          and use intelligent agents to help you build faster. Designed for
          developers and teams who think in code.
        </p>
      </section>

      {/* Getting started */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Getting started</h2>
        </div>
        <CardGrid items={guides} />
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Features</h2>
        <CardGrid items={features} />
      </section>

      {/* Roadmap */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Roadmap</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            What&apos;s shipped, what&apos;s in progress, and what&apos;s coming next.
          </p>
        </div>
        <div className="space-y-2">
          {roadmapItems.map((item) => {
            const { icon: Icon, color, label: statusLabel } = statusConfig[item.status]
            return (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
              >
                <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className={`text-xs ${color}`}>{statusLabel}</span>
                    {"priority" in item && item.priority && (
                      <span
                        className={`rounded border px-1.5 py-0.5 text-xs font-medium ${priorityConfig[item.priority as keyof typeof priorityConfig]}`}
                      >
                        {item.priority}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
