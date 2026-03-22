import { ArrowRight, BookOpen, CheckCircle, Circle, Clock, Code, FolderTree, GitBranch, Heart, Layout, Rocket, Zap } from "lucide-react"
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
    title: "Feature View",
    description:
      "Your command center for building a feature. Control tickets, read plans, and review commits — all in one screen.",
    href: "/docs/feature-view",
    icon: Layout,
  },
  {
    title: "GitHub Auto-Sync",
    description:
      "Push your plans to GitHub and Speedy updates in real time. Webhook-powered, zero config after setup.",
    href: "/docs/sync",
    icon: GitBranch,
  },
  {
    title: "AI Development Workflow",
    description:
      "How to leverage Charizard and Perro salchicha for faster development. Best practices and when to use AI.",
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
    label: "Feature View",
    description: "Ticket sidebar, plan viewer, and commit timeline — all in one screen per feature.",
  },
  {
    status: "done" as const,
    label: "Commit Timeline",
    description: "Browse commit history per feature branch with diff viewer and ticket filtering.",
  },
  {
    status: "done" as const,
    label: "Markdown Rendering",
    description: "Full markdown in plan viewer: headings, tables, blockquotes, lists, checklists.",
  },
  {
    status: "in-progress" as const,
    label: "Agent Repo Push (Full Loop)",
    description: "Charizard creates tickets, pushes to GitHub, auto-sync fires — full agentic loop in review.",
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
    description: "Spawn Perro salchicha (Codex/Claude Code) directly from Telegram.",
    priority: "medium",
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
