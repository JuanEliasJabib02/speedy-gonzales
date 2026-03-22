import {
  ArrowLeft,
  Ban,
  CheckCircle,
  CheckSquare,
  FileText,
  GitCommit,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

export default function PlanViewerDocsPage() {
  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/docs/feature-view"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Feature View
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Plan Viewer</h1>
        <p className="mt-2 text-muted-foreground">
          The center panel of the Feature View. Renders your plan files as
          formatted HTML, lets you manage ticket status directly, and shows
          commit history for completed work.
        </p>
      </div>

      {/* Header */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Header</h2>
        <p className="leading-relaxed text-muted-foreground">
          At the top of each plan you see the ticket title with interactive
          controls:
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: FileText,
              title: "Status dropdown",
              desc: "Click the status badge to change the ticket's status directly. No need to go back to the sidebar.",
            },
            {
              icon: FileText,
              title: "Priority badge",
              desc: "Shows the ticket's priority level with a colored pill (low, medium, high, critical).",
            },
            {
              icon: Ban,
              title: "Blocked indicator",
              desc: "If a ticket is blocked, a red badge shows the reason. An unblock button lets you clear it in one click.",
            },
            {
              icon: CheckCircle,
              title: "Mark as completed",
              desc: "Appears when a ticket is in \"review\" status. One click to confirm the work is good and move it to completed.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <item.icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist progress */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Checklist progress</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Below the header, a progress bar counts all checkbox items in the plan
          and shows how many are done. A quick visual of how far along the ticket
          is.
        </p>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">3/5 tasks done</span>
            <span className="text-muted-foreground">(60%)</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-primary/20">
            <div className="h-full w-3/5 rounded-full bg-primary" />
          </div>
        </div>
      </section>

      {/* Markdown rendering */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Plan content</h2>
        <p className="leading-relaxed text-muted-foreground">
          The body renders your markdown as formatted HTML: headings, bullet
          lists, checklists (read-only checkboxes with strikethrough on done
          items), tables, blockquotes, bold/italic, and syntax-highlighted code
          blocks.
        </p>
      </section>

      {/* Live sync */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Live sync</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          When plan files change in the repo (e.g., the agent pushes an update),
          the content updates automatically. You always see the latest version
          without refreshing.
        </p>
      </section>

      {/* Commits section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <GitCommit className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Commits & diff viewer</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          When a ticket is in review or completed, the plan viewer shows a{" "}
          <strong>Commits</strong> section below the content. Each commit card
          displays:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Commit hash and message</li>
          <li>Number of files changed, additions (green), and deletions (red)</li>
          <li>
            A <strong>&quot;View diff&quot;</strong> button that opens a full
            diff viewer
          </li>
        </ul>
        <p className="leading-relaxed text-muted-foreground">
          The diff viewer shows every changed file with syntax-highlighted diffs
          — green for added lines, red for removed. You can review exactly what
          the agent built and approve it or ask for changes.
        </p>
        <p className="text-sm text-muted-foreground">
          This is the review workflow: the agent pushes code → the ticket moves
          to &quot;review&quot; → you open the diff → you click &quot;Mark as
          completed&quot; if it&apos;s good.
        </p>
      </section>
    </div>
  )
}
