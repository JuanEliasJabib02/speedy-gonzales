import { ArrowLeft, Database, FileText, GitBranch } from "lucide-react"
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
          Where authoritative data lives &mdash; and why it&apos;s split between two systems.
        </p>
      </div>

      {/* The dual model */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">A dual-source model</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy Gonzales doesn&apos;t have a single source of truth. It has <strong className="text-foreground">two</strong>,
          each authoritative for different things:
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              icon: GitBranch,
              label: "Git is truth for plan content",
              desc: "Titles, descriptions, checklists, priority, and structure all live in markdown files under plans/features/. Git history is the audit trail.",
            },
            {
              icon: Database,
              label: "Convex is truth for ticket status",
              desc: "Status transitions (todo → in-progress → review → completed) happen in real time via the HTTP API. The kanban board reads from Convex, not from git.",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <item.icon className="size-3.5 text-primary" />
              </div>
              <div>
                <span className="font-medium">{item.label}</span>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why two sources */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why not just one?</h2>
        <p className="leading-relaxed text-muted-foreground">
          Plan <strong className="text-foreground">content</strong> changes through commits &mdash; it&apos;s
          reviewed, versioned, and diffable. Git is the right tool for that.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Ticket <strong className="text-foreground">status</strong> changes in real time &mdash; an autonomous
          agent finishes work and the kanban should update instantly, without waiting for a commit,
          push, and webhook cycle. Convex (the database) is the right tool for that.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          When the next sync runs, the status from the git markdown and the status in Convex may
          differ. The sync engine handles this: if a ticket&apos;s content hash hasn&apos;t changed
          (meaning only the status was updated via the API), the sync preserves the Convex status.
          If the content <em>did</em> change (new commit pushed), the sync uses the status from
          the markdown file.
        </p>
      </section>

      {/* Data flow diagram */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Data flow</h2>
        <p className="leading-relaxed text-muted-foreground">
          Two independent paths feed data into the UI:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`Plan content flow
─────────────────
  plans/*.md  ──push──▶  GitHub  ──webhook──▶  Convex sync  ──▶  UI
  (git repo)                                   (upsert epics     (reactive
                                                + tickets)        queries)

Status update flow
──────────────────
  Autonomous loop  ──POST──▶  /update-ticket-status  ──▶  Convex  ──▶  UI
  (agent finishes)            (HTTP endpoint)              (patch      (kanban
                                                            status)    updates)`}
        </pre>
        <p className="text-sm text-muted-foreground">
          Both paths write to Convex. The UI always reads from Convex via reactive queries,
          so it updates in real time regardless of which path triggered the change.
        </p>
      </section>

      {/* Three layers */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Three layers, two truths</h2>
        <p className="leading-relaxed text-muted-foreground">
          The system has three layers:
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              icon: FileText,
              label: "Plan files",
              desc: "Markdown files in plans/features/. Authoritative for content, structure, and checklists.",
            },
            {
              icon: Database,
              label: "Convex database",
              desc: "Stores parsed plan data + real-time status. Authoritative for ticket status. Read cache for everything else.",
            },
            {
              icon: GitBranch,
              label: "Kanban UI",
              desc: "A reactive view of Convex data. Not a source of truth — it's a read-only display layer.",
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
      </section>

      {/* Conflict resolution */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What happens when they disagree</h2>
        <p className="leading-relaxed text-muted-foreground">
          Because status can be updated via the HTTP API (fast path) and via git sync (content path),
          conflicts are possible. The sync engine resolves them with a simple rule:
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2.5 text-left font-medium">Scenario</th>
                <th className="px-4 py-2.5 text-left font-medium">Who wins</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-t border-border">
                <td className="px-4 py-2.5">Content hash unchanged (only status changed via API)</td>
                <td className="px-4 py-2.5 font-medium text-foreground">Convex status preserved</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5">Content hash changed (new commit pushed)</td>
                <td className="px-4 py-2.5 font-medium text-foreground">Git markdown wins</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5">File deleted from repo</td>
                <td className="px-4 py-2.5 font-medium text-foreground">Soft-deleted in Convex</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          This means agents can update status instantly via the API, and those updates survive
          until someone pushes a new version of the ticket markdown.
        </p>
      </section>

      {/* When plans get updated */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">When plans get updated</h2>
        <p className="leading-relaxed text-muted-foreground">
          Plans are living documents. They get updated when:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">After implementation</strong> &mdash; checklist items are marked <code className="rounded bg-muted px-1.5 py-0.5 text-sm">[x]</code>, status changes to <code className="rounded bg-muted px-1.5 py-0.5 text-sm">completed</code></li>
          <li><strong className="text-foreground">Stale detection</strong> &mdash; if a plan says <code className="rounded bg-muted px-1.5 py-0.5 text-sm">todo</code> but the code implements it, the plan is corrected</li>
          <li><strong className="text-foreground">Architecture changes</strong> &mdash; if env vars, component names, or patterns change in code, plans are updated to match</li>
        </ul>
      </section>

      {/* TL;DR */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">TL;DR</h2>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
            <li>Git is truth for plan <strong className="text-foreground">content</strong> (titles, descriptions, checklists).</li>
            <li>Convex is truth for ticket <strong className="text-foreground">status</strong> (real-time transitions).</li>
            <li>The kanban UI is a read-only view &mdash; not a source of truth.</li>
            <li>When content changes in git, the sync overwrites Convex. When only status changes via API, Convex preserves it.</li>
            <li>Auto-sync keeps content in sync. The HTTP endpoint keeps status in sync. Both paths converge in Convex.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
