import {
  ArrowLeft,
  ArrowRight,
  Code2,
  FileText,
  MessageSquare,
  PanelLeft,
} from "lucide-react"
import Link from "next/link"

const panels = [
  {
    icon: PanelLeft,
    title: "Ticket Sidebar",
    desc: "Your feature's table of contents. Browse and filter tickets, see status at a glance, and navigate between plans.",
    href: "/docs/feature-view/ticket-sidebar",
  },
  {
    icon: FileText,
    title: "Plan Viewer",
    desc: "The selected ticket rendered as formatted HTML. Title, status badges, checklist progress, and full markdown body. Like reading documentation.",
    href: "/docs/feature-view/plan-viewer",
  },
  {
    icon: MessageSquare,
    title: "Chat",
    desc: "Talk to your OpenClaw agent (Charizard) with full project context. Streaming, slash commands, ticket mentions, image uploads, commit cards, memory, and more.",
    href: "/docs/feature-view/chat",
  },
  {
    icon: Code2,
    title: "Codebase",
    desc: "Browse the connected GitHub repo without leaving the app. File tree, syntax-highlighted viewer, and automatic context bridge to the chat.",
    href: "/docs/feature-view/codebase",
  },
]

export default function FeatureViewDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">Feature View</h1>
        <p className="mt-2 text-muted-foreground">
          Your command center for building a feature. Open a feature from the
          kanban and you get a full workspace — orchestrate your AI agent through
          the chat, control ticket progress, read plans, and browse code. All in
          one screen, scoped to one feature.
        </p>
      </div>

      {/* What it does */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What it does</h2>
        <p className="leading-relaxed text-muted-foreground">
          The Feature View is where the actual work happens. You talk to your AI
          agent (Charizard) through the chat panel, and from there you can create
          tickets, update statuses, push code, and review changes — the agent
          executes and you orchestrate. The ticket sidebar tracks progress, the
          plan viewer shows what&apos;s built and what&apos;s left, and the code panel
          lets you explore the repo without switching tabs.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Everything is scoped to one feature (epic). The agent knows your
          tickets, the plan, the repo, and the conversation history. You don&apos;t
          explain context — you just work.
        </p>
      </section>

      {/* Visual mockup */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">At a glance</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex min-h-[200px] divide-x divide-border text-sm">
            <div className="flex w-[140px] shrink-0 flex-col gap-2 bg-muted/30 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <PanelLeft className="size-3 text-primary" />
                Tickets
              </div>
              <div className="space-y-1.5">
                {["Setup auth", "Stripe webhook", "Dashboard UI", "Deploy"].map(
                  (t, i) => (
                    <div
                      key={t}
                      className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs ${i === 1 ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground"}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${i === 0 ? "bg-green-500" : i === 1 ? "bg-blue-500" : "bg-muted-foreground/40"}`}
                      />
                      {t}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <div className="flex items-center gap-2 text-xs font-medium">
                <FileText className="size-3 text-primary" />
                Stripe webhook
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-600">
                  in-progress
                </span>
              </div>
              <div className="h-1.5 w-1/3 rounded-full bg-primary/20">
                <div className="h-full w-1/2 rounded-full bg-primary" />
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Receive Stripe events via webhook...</p>
                <p className="flex items-center gap-1">
                  <span className="text-green-500">&#10003;</span> Create
                  endpoint
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-muted-foreground/40">&#9675;</span>{" "}
                  Verify signature
                </p>
              </div>
            </div>
            <div className="flex w-[160px] shrink-0 flex-col gap-2 bg-muted/20 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <MessageSquare className="size-3 text-primary" />
                Chat
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="rounded bg-muted px-2 py-1 text-muted-foreground">
                  How should I handle duplicate events?
                </div>
                <div className="rounded bg-primary/10 px-2 py-1 text-primary">
                  Use an idempotency key stored in your DB...
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Simplified mockup. The actual view has full markdown rendering, syntax
          highlighting, and a resizable drag handle between panels.
        </p>
      </section>

      {/* Panel cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">The four panels</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {panels.map((panel) => (
            <Link
              key={panel.href}
              href={panel.href}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                  <panel.icon className="size-4 text-primary" />
                </div>
                <h3 className="font-semibold">{panel.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {panel.desc}
              </p>
              <div className="mt-auto flex items-center gap-1 text-sm text-primary">
                <span>Learn more</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
