import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PhilosophyPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">The Speedy Philosophy</h1>
        <p className="mt-2 text-muted-foreground">
          The principles behind Speedy Gonzales — and why they matter.
        </p>
      </div>

      {/* Origin */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Where it started</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy Gonzales was created by <strong className="text-foreground">Juan Elias Jabib</strong> out
          of frustration with the gap between how fast AI agents can work and how slow traditional dev tools
          let them. The goal was simple: build an orchestrator where plans, code, and agents share the same
          context — and everything stays in sync automatically.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          What started as a personal tool evolved into a platform for any builder who wants AI agents as
          first-class teammates, not clipboard assistants.
        </p>
      </section>

      {/* The problem */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The problem with traditional dev tools</h2>
        <div className="space-y-3 text-muted-foreground">
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="mb-1 font-medium text-foreground">Context switching kills momentum</p>
            <p className="text-sm leading-relaxed">
              Developers lose hours jumping between ticket trackers, Slack, and their editor. Each switch costs
              mental warmup time. AI agents suffer the same problem — they start every session without context,
              forcing humans to be the bridge between disconnected tools.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="mb-1 font-medium text-foreground">Agents lack project context</p>
            <p className="text-sm leading-relaxed">
              Most AI coding tools operate in isolation. They don&apos;t know what was built yesterday, which
              tickets are in progress, or what architectural decisions were already made. Every interaction
              starts from zero — wasting time and producing inconsistent results.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="mb-1 font-medium text-foreground">Plans drift from reality</p>
            <p className="text-sm leading-relaxed">
              Specs are written, then reality forces changes. Nobody updates the spec. Two months later, the
              documentation describes a system that no longer exists. Without sync between plans and code,
              drift is inevitable.
            </p>
          </div>
        </div>
      </section>

      {/* Core principles */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Core principles</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every design decision in Speedy Gonzales follows from these principles:
        </p>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-primary">→</span>
            <span>
              <strong className="text-foreground">Plans live in git.</strong> Markdown files in your repo are
              the source of truth — version-controlled, diffable, and owned by you. Not a SaaS database you
              don&apos;t control.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-primary">→</span>
            <span>
              <strong className="text-foreground">Agents get full context.</strong> Features, tickets, plan
              content, and conversation history are available to any agent. No re-explaining, no context loss
              between sessions.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-primary">→</span>
            <span>
              <strong className="text-foreground">Sync is automatic.</strong> Push to GitHub → Convex updates
              → UI reflects reality. No manual imports, no copy-paste, no drift.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-primary">→</span>
            <span>
              <strong className="text-foreground">Agents execute, humans review.</strong> The autonomous loop
              picks up tickets, writes code, and pushes commits. Developers stay in the review seat — not the
              typing seat.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-primary">→</span>
            <span>
              <strong className="text-foreground">Stack and agent agnostic.</strong> Speedy Gonzales works
              with any tech stack and any AI agent. It orchestrates the workflow, not the tools.
            </span>
          </li>
        </ul>
      </section>

      {/* Who it's for */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Who this is for</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy Gonzales is for builders who use AI agents to ship software and want those agents to have
          real project context. Solo developers, small teams, and anyone who believes AI should be a
          first-class teammate — not a tool you copy-paste into.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          It is <strong className="text-foreground">not</strong> for teams that need enterprise compliance
          workflows, approval chains, or audit trails. It&apos;s for people who want to ship fast and stay sane.
        </p>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Open source and free to use.</strong> Fork it, extend it,
            make it yours. The only ask: if you share the vision that AI and humans can build together
            without bureaucracy — build something worth building.
          </p>
        </div>
      </section>

      {/* The name */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why &quot;Speedy Gonzales&quot;?</h2>
        <p className="leading-relaxed text-muted-foreground">
          Because the whole point is speed. Not shortcuts that create debt — real speed that comes from
          clarity, context, and the right orchestration. When plans, code, and agents share the same source
          of truth, everything moves faster.
        </p>
        <p className="leading-relaxed text-muted-foreground italic">
          &quot;¡Ándale, ándale! ¡Arriba, arriba!&quot;
        </p>
      </section>
    </div>
  )
}
