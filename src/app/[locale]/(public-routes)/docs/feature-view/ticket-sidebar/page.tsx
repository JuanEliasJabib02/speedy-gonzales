import {
  ArrowLeft,
  Ban,
  Eye,
  FileText,
  Filter,
  GitBranch,
  Map,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react"
import Link from "next/link"

export default function TicketSidebarDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">
          Ticket Sidebar
        </h1>
        <p className="mt-2 text-muted-foreground">
          The left panel of the Feature View. Your feature&apos;s table of
          contents — browse all tickets, filter by status, update progress, and
          create new tickets without leaving the view.
        </p>
      </div>

      {/* What you see */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What you see</h2>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: ArrowLeft,
              title: "Back arrow",
              desc: "Returns to the kanban board.",
            },
            {
              icon: FileText,
              title: "Epic title",
              desc: "The feature name. Click it to see the epic overview in the plan viewer.",
            },
            {
              icon: GitBranch,
              title: "Branch indicator",
              desc: "The git branch this feature lives on (e.g., feat/payments).",
            },
            {
              icon: RefreshCw,
              title: "Sync status",
              desc: "Shows when the last sync happened (\"42s ago\", \"5m ago\"). Pulses when a sync is in progress.",
            },
            {
              icon: Search,
              title: "Search bar",
              desc: "Filter tickets by name as you type. Combines with the status filter.",
            },
            {
              icon: Filter,
              title: "Status filter",
              desc: "Dropdown tabs: All, Blocked, Todo, In Progress, Review, Done — each showing a count. Quickly focus on what needs attention.",
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

      {/* Quick actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick actions</h2>
        <p className="leading-relaxed text-muted-foreground">
          Three buttons at the top of the sidebar let you act without opening a
          different page:
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: Eye,
              title: "Overview",
              desc: "Opens a modal with the epic's full description and plan content — a quick refresher of what this feature is about.",
            },
            {
              icon: Map,
              title: "Roadmap",
              desc: "Opens a modal showing all tickets grouped by priority (critical → high → medium → low) with status badges and checklist progress. Like a mini project dashboard for this one feature.",
            },
            {
              icon: Plus,
              title: "Create ticket",
              desc: "Opens a form to create a new ticket: title, priority, and an optional description. The ticket gets sent to the agent and appears in the sidebar instantly.",
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

      {/* Ticket list */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Ticket list</h2>
        <p className="leading-relaxed text-muted-foreground">
          Each ticket is a row with a colored status dot and the ticket title.
          Click a ticket to load its plan in the center panel. Tickets are sorted
          by urgency: blocked first, then review, in-progress, todo, and
          completed last.
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              color: "bg-red-500",
              status: "blocked",
              desc: "Highlighted in red with a reason (if provided). Has an unblock button.",
            },
            {
              color: "bg-purple-500",
              status: "review",
              desc: "Agent finished — waiting for you to check and approve.",
            },
            {
              color: "bg-blue-500",
              status: "in-progress",
              desc: "Currently being worked on.",
            },
            {
              color: "bg-yellow-500",
              status: "todo",
              desc: "Not started yet.",
            },
            {
              color: "bg-green-500",
              status: "completed",
              desc: "Done and verified.",
            },
          ].map((item) => (
            <div
              key={item.status}
              className="flex items-center gap-3 rounded-md bg-muted/50 px-4 py-3"
            >
              <span
                className={`size-2 shrink-0 rounded-full ${item.color}`}
              />
              <span className="text-sm font-medium">{item.status}</span>
              <span className="text-sm text-muted-foreground">
                &mdash; {item.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Change status inline */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Change status inline</h2>
        <p className="leading-relaxed text-muted-foreground">
          Click the status dot on any ticket to open a dropdown and change its
          status directly — no need to open the plan first. If you mark a ticket
          as blocked, you can optionally add a reason (e.g., &quot;Waiting on
          API keys&quot;) so you remember why later.
        </p>
      </section>

      {/* Blocked tickets */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Ban className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Blocked tickets</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Blocked tickets get special treatment: they&apos;re highlighted in red
          with a warning icon and the blocking reason (if you added one). An
          &quot;Unblock&quot; button lets you clear the block and move the ticket
          back to its previous status in one click.
        </p>
      </section>

      {/* Plan / Code toggle */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Layout</h2>
        <p className="leading-relaxed text-muted-foreground">
          The sidebar sits on the left, with the plan viewer in the center and
          the commit timeline on the right.
        </p>
      </section>
    </div>
  )
}
