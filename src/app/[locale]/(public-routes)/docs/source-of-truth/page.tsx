import { ArrowLeft, Code, FileText, GitBranch, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function SourceOfTruthDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">Source of Truth</h1>
        <p className="mt-2 text-muted-foreground">
          How plans, code, and AI stay in sync in Speedy Gonzales.
        </p>
      </div>

      {/* The principle */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The code is always right</h2>
        <p className="leading-relaxed text-muted-foreground">
          In Speedy Gonzales, <strong className="text-foreground">code is the source of truth</strong>.
          Plans document intent and progress, but when the code and the plan disagree,
          the plan gets updated &mdash; never the other way around.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          This means a plan file can be stale, but the codebase never is. The AI agent
          (Claude Code) follows this rule: before creating a ticket, it checks the
          codebase first. If the feature already exists in code, the ticket is either
          skipped or created as <code className="rounded bg-muted px-1.5 py-0.5 text-sm">completed</code>.
        </p>
      </section>

      {/* The layers */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Three layers, one truth</h2>
        <p className="leading-relaxed text-muted-foreground">
          The system has three layers that stay in sync through automation:
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              icon: Code,
              label: "Code",
              desc: "The actual implementation. Source of truth. Lives in the repo.",
            },
            {
              icon: FileText,
              label: "Plans",
              desc: "Markdown files in plans/features/. Document what's built, what's pending, and what's next.",
            },
            {
              icon: RefreshCw,
              label: "Kanban UI",
              desc: "Convex database + reactive UI. Automatically synced from plan files via GitHub webhooks.",
            },
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
        <p className="text-sm text-muted-foreground">
          Data flows: <strong className="text-foreground">Code</strong> &rarr;{" "}
          <strong className="text-foreground">Plans</strong> &rarr;{" "}
          <strong className="text-foreground">Kanban</strong>. Never backwards.
        </p>
      </section>

      {/* How sync works */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <GitBranch className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">The sync loop</h2>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", desc: "Developer writes code or AI agent modifies plan files" },
            { step: "2", desc: "Changes are committed and pushed to GitHub" },
            { step: "3", desc: "GitHub webhook fires on push" },
            { step: "4", desc: "Auto-sync reads plans/features/ from the repo" },
            { step: "5", desc: "Parser extracts titles, statuses, checklists from markdown" },
            { step: "6", desc: "Convex database is updated (epics + tickets)" },
            { step: "7", desc: "Kanban board and plan viewer update in real time" },
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

      {/* Ticket creation */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How tickets are created</h2>
        <p className="leading-relaxed text-muted-foreground">
          When the AI agent creates a ticket, it follows a strict process:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">Check the code</strong> &mdash; does this feature already exist in the codebase?</li>
          <li><strong className="text-foreground">Compare with the plan</strong> &mdash; is there already a ticket for this?</li>
          <li><strong className="text-foreground">Create only what&apos;s missing</strong> &mdash; if partially built, the checklist reflects only pending items</li>
          <li><strong className="text-foreground">Commit and push immediately</strong> &mdash; the ticket appears in the kanban within seconds</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          This prevents phantom tickets for work that&apos;s already done, and ensures
          the kanban always reflects the real state of the project.
        </p>
      </section>

      {/* Plan updates */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">When plans get updated</h2>
        <p className="leading-relaxed text-muted-foreground">
          Plans are living documents. They get updated when:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">After implementation</strong> &mdash; checklist items are marked <code className="rounded bg-muted px-1.5 py-0.5 text-sm">[x]</code>, status changes to <code className="rounded bg-muted px-1.5 py-0.5 text-sm">completed</code></li>
          <li><strong className="text-foreground">Stale detection</strong> &mdash; if a plan says <code className="rounded bg-muted px-1.5 py-0.5 text-sm">todo</code> but the code implements it, the plan is corrected</li>
          <li><strong className="text-foreground">Architecture changes</strong> &mdash; if env vars, component names, or patterns change in code, plans are updated to match</li>
          <li><strong className="text-foreground">New discoveries</strong> &mdash; when the AI identifies improvements during development, it creates tickets automatically</li>
        </ul>
      </section>

      {/* AI role */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The AI&apos;s role</h2>
        <p className="leading-relaxed text-muted-foreground">
          Two AI agents keep the system in sync:
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2.5 text-left font-medium">Agent</th>
                <th className="px-4 py-2.5 text-left font-medium">What it does</th>
                <th className="px-4 py-2.5 text-left font-medium">Direction</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-t border-border">
                <td className="px-4 py-2.5 font-medium text-foreground">Claude Code</td>
                <td className="px-4 py-2.5">Writes code, creates tickets, updates plans after implementation</td>
                <td className="px-4 py-2.5">Code &rarr; Plans</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5 font-medium text-foreground">Charizard (OpenClaw)</td>
                <td className="px-4 py-2.5">Modifies plans via Telegram, pushes to repo, triggers auto-sync</td>
                <td className="px-4 py-2.5">Telegram &rarr; Plans &rarr; Kanban</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          Both agents follow the same rule: the code is the source of truth. Plans are
          documentation, not specifications. The kanban is a view, not a database you edit directly.
        </p>
      </section>

      {/* TL;DR */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">TL;DR</h2>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
            <li>Code is truth. Plans adapt to code, not the other way around.</li>
            <li>Tickets are created by comparing what exists in code vs what&apos;s needed.</li>
            <li>Every ticket is committed and pushed immediately &mdash; visible in the kanban within seconds.</li>
            <li>Auto-sync keeps the UI in sync with the repo. No manual updates needed.</li>
            <li>Two AI agents (Claude Code + Charizard) maintain the loop automatically.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
