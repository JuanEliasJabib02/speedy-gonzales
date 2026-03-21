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
          Why Speedy Gonzales exists — and the vision behind it.
        </p>
      </div>

      {/* Origin */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why I built this</h2>
        <p className="leading-relaxed text-muted-foreground">
          I&apos;m <strong className="text-foreground">Juan Elias Jabib</strong>. I build software fast. Not recklessly — but with urgency,
          because I believe most tools slow you down more than they help.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          I was frustrated with project management. Jira is a bureaucracy simulator. Linear is pretty but still feels like
          managing tickets instead of building things. GitHub Issues are fine, but disconnected from the actual code and
          context. And none of them talk to my AI agent.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          So I built Speedy Gonzales — primarily for myself. An IDE without an editor. A place where my plans, my code,
          and my AI agent all live in the same context, and where moving fast is the default, not the exception.
        </p>
      </section>

      {/* The problem */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The problem with traditional dev tools</h2>
        <div className="space-y-3 text-muted-foreground">
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="mb-1 font-medium text-foreground">Context switching kills momentum</p>
            <p className="text-sm leading-relaxed">
              You&apos;re in flow, coding. Then you need to update a ticket in Jira. Then check Slack for the design specs.
              Then reopen your IDE. Each switch costs you 15 minutes of mental warmup. By the time you&apos;re back in the zone,
              half the day is gone.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="mb-1 font-medium text-foreground">AI agents don&apos;t have your context</p>
            <p className="text-sm leading-relaxed">
              You open ChatGPT or Cursor and start explaining your project from scratch. Every session. The AI has no idea
              what you built yesterday, what tickets are in progress, or what decisions you already made. You&apos;re the
              context bridge between your tools — and that&apos;s exhausting.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="mb-1 font-medium text-foreground">Plans drift from reality</p>
            <p className="text-sm leading-relaxed">
              You write a spec, then code something slightly different because reality forced your hand. The spec is now
              wrong. Nobody updates it. Two months later, you can&apos;t remember why anything was built the way it was.
            </p>
          </div>
        </div>
      </section>

      {/* The vision */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The vision: developing at the speed of thought</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy Gonzales is built around one idea: <strong className="text-foreground">your plans live in git, your agent has full context,
          and everything stays in sync automatically.</strong>
        </p>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="mt-0.5 text-primary shrink-0">→</span>
            <span>
              <strong className="text-foreground">Plans are markdown files in your repo.</strong> They&apos;re version-controlled,
              diffable, and the source of truth. Not some SaaS database you don&apos;t control.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-primary shrink-0">→</span>
            <span>
              <strong className="text-foreground">The AI agent knows everything.</strong> Your feature, your tickets,
              your plan content, your conversation history. You never explain the same context twice.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-primary shrink-0">→</span>
            <span>
              <strong className="text-foreground">Sync is automatic.</strong> Push to GitHub → Convex updates → UI reflects
              reality. No manual imports, no copy-paste, no drift.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 text-primary shrink-0">→</span>
            <span>
              <strong className="text-foreground">The agent executes, you review.</strong> Tell the agent what to build.
              It creates the code, the commits, the tickets. You stay in the review seat, not the typing seat.
            </span>
          </li>
        </ul>
      </section>

      {/* Who it&apos;s for */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Who this is for</h2>
        <p className="leading-relaxed text-muted-foreground">
          I built this for myself. It fits how my brain works: fast, context-heavy, AI-first. If you share that way of
          working — if you believe AI agents should be first-class teammates, not clipboard assistants — then
          Speedy might fit you too.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          It is <strong className="text-foreground">not</strong> for teams that need approvals, audits, and enterprise
          compliance workflows. It&apos;s for builders who want to ship fast and stay sane.
        </p>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Open source and free to use.</strong> If this tool helps you develop at the
            speed you want to develop at, use it. Fork it. Make it yours. The only ask is that if you share my vision —
            that AI and humans can build together without the bureaucracy getting in the way — you build something worth building.
          </p>
        </div>
      </section>

      {/* The name */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why &quot;Speedy Gonzales&quot;?</h2>
        <p className="leading-relaxed text-muted-foreground">
          Because the whole point is speed. Not shortcuts that create debt — real speed that comes from clarity, context,
          and the right tools. Speedy Gonzales was the fastest mouse in all of Mexico. I want to be the fastest developer
          in all of the codebase.
        </p>
        <p className="leading-relaxed text-muted-foreground italic">
          &quot;¡Ándale, ándale! ¡Arriba, arriba!&quot;
        </p>
      </section>
    </div>
  )
}
