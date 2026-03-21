import { ArrowRight, BookOpen, FolderTree, GitBranch, MessageSquare, Rocket } from "lucide-react"
import Link from "next/link"

const guides = [
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
      "Per-feature AI chat powered by OpenClaw's Charizard agent. Context-aware conversations with memory.",
    href: "/docs/chat",
    icon: MessageSquare,
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
    </div>
  )
}
