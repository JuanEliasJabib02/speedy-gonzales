import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{children}</code>
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
      {children}
    </pre>
  )
}

function StepCard({ step, label, desc }: { step: string; label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {step}
      </span>
      <div>
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground"> &mdash; {desc}</span>
      </div>
    </div>
  )
}

export default function PlansDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">Plan Structure</h1>
        <p className="mt-2 text-muted-foreground">
          How to organize your <InlineCode>plans/</InlineCode> folder so Speedy Gonzales
          can read, sync, and track your features and tickets.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy Gonzales reads a <InlineCode>plans/features/</InlineCode> directory from your GitHub repo.
          Each subdirectory is a <strong className="text-foreground">feature (epic)</strong> and each
          markdown file inside it is a <strong className="text-foreground">ticket</strong>.
          The sync engine parses these files, extracts metadata (title, status, priority, checklists),
          and stores everything in Convex. Your kanban board, feature view, and progress tracking
          all come from these files.
        </p>
      </section>

      {/* Directory structure */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Directory structure</h2>
        <CodeBlock>{`plans/
├── features/
│   ├── <epic-slug>/
│   │   ├── _context.md       # Required — epic overview
│   │   ├── <ticket-slug>.md  # One file per ticket
│   │   └── <ticket-slug>.md
│   ├── <epic-slug>/
│   │   ├── _context.md
│   │   └── ...
├── business-model.md          # Optional — not synced
├── design-system.md           # Optional — not synced
└── SPEC.md                    # Format reference (this page)`}</CodeBlock>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Only <InlineCode>plans/features/</InlineCode> is synced</strong> &mdash;
            files outside it are ignored by the sync engine
          </li>
          <li>
            Each subdirectory under <InlineCode>features/</InlineCode> becomes an <strong className="text-foreground">epic</strong>
          </li>
          <li>
            Each epic <strong className="text-foreground">must</strong> have a <InlineCode>_context.md</InlineCode> &mdash;
            without it, the epic has no title or metadata
          </li>
          <li>
            Every other <InlineCode>.md</InlineCode> file in the epic directory is a <strong className="text-foreground">ticket</strong>
          </li>
          <li>
            Only <strong className="text-foreground">2 levels deep</strong> &mdash; nested subdirectories inside an epic are ignored
          </li>
        </ul>
      </section>

      {/* Naming rules */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Naming rules</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            Use <strong className="text-foreground">kebab-case</strong> for directories and file names:
            <InlineCode>github-sync</InlineCode>, <InlineCode>create-dialog.md</InlineCode>
          </li>
          <li>
            <strong className="text-foreground">Never rename files or directories after creation.</strong>{" "}
            Convex identifies epics and tickets by their file path
            (e.g. <InlineCode>plans/features/auto-sync/upsert-logic.md</InlineCode>).
            Renaming creates a duplicate and orphans the old record.
          </li>
          <li>
            If you need a different name, create a new file and delete the old one &mdash;
            the sync will properly remove the old record and create a new one.
          </li>
        </ul>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">Why paths matter</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The sync engine uses file paths as unique identifiers. When you rename a file,
            the engine sees the old path as &quot;deleted&quot; and the new path as &quot;created&quot; &mdash;
            but any references (comments, commits, status history) tied to the old path are lost.
          </p>
        </div>
      </section>

      {/* _context.md format */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Epic format &mdash; <InlineCode>_context.md</InlineCode>
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Every epic <strong className="text-foreground">must</strong> have a{" "}
          <InlineCode>_context.md</InlineCode> file. This is the epic&apos;s identity &mdash;
          its title, status, priority, and overview.
        </p>
        <CodeBlock>{`# Epic Title

**Status:** todo
**Priority:** medium

## Overview

Brief description of what this feature does and why it exists.

## UI built (mock)

- [x] Component or screen that's been built
- [ ] Something still needed

## Components

- \`ComponentName\` — short description

## Still needs

- [ ] What's left to wire up or build

## Depends on

- Other epic or external dependency`}</CodeBlock>
      </section>

      {/* Ticket format */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Ticket format</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every <InlineCode>.md</InlineCode> file in an epic directory (other than{" "}
          <InlineCode>_context.md</InlineCode>) is a ticket.
          Tickets use the <strong className="text-foreground">exact same parser</strong> as epics &mdash;
          same fields, same defaults, same rules.
        </p>
        <CodeBlock>{`# Ticket Title

**Status:** todo
**Priority:** medium

## What it does

Description of this specific task or piece of work.

## Checklist

- [x] Step that's been completed
- [ ] Step still pending
- [ ] Another pending step

## Files

- \`path/to/relevant/file.tsx\``}</CodeBlock>
      </section>

      {/* Parsed fields */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Parsed fields</h2>
        <p className="leading-relaxed text-muted-foreground">
          The sync engine extracts these fields from every <InlineCode>.md</InlineCode> file:
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Field</th>
                <th className="px-4 py-2 text-left font-medium">Source</th>
                <th className="px-4 py-2 text-left font-medium">Default</th>
                <th className="px-4 py-2 text-left font-medium">Allowed values</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">title</td>
                <td className="px-4 py-2">First <InlineCode># Heading</InlineCode></td>
                <td className="px-4 py-2">Directory name</td>
                <td className="px-4 py-2">Any string</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">status</td>
                <td className="px-4 py-2"><InlineCode>**Status:**</InlineCode> value</td>
                <td className="px-4 py-2">todo</td>
                <td className="px-4 py-2">todo, in-progress, review, completed, blocked</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">priority</td>
                <td className="px-4 py-2"><InlineCode>**Priority:**</InlineCode> value</td>
                <td className="px-4 py-2">medium</td>
                <td className="px-4 py-2">low, medium, high, critical</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">body</td>
                <td className="px-4 py-2">Everything after header block</td>
                <td className="px-4 py-2">Empty</td>
                <td className="px-4 py-2">Markdown</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">checklistTotal</td>
                <td className="px-4 py-2">
                  Count of <InlineCode>- [x]</InlineCode> + <InlineCode>- [ ]</InlineCode>
                </td>
                <td className="px-4 py-2">0</td>
                <td className="px-4 py-2">Number</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-foreground">checklistCompleted</td>
                <td className="px-4 py-2">
                  Count of <InlineCode>- [x]</InlineCode>
                </td>
                <td className="px-4 py-2">0</td>
                <td className="px-4 py-2">Number</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Parser behavior</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Title is extracted from the first <InlineCode>#</InlineCode> heading. The prefix <InlineCode>Feature N:</InlineCode> is stripped if present.</li>
            <li><InlineCode>**Status:**</InlineCode> and <InlineCode>**Priority:**</InlineCode> are parsed as bold-colon fields immediately after the title.</li>
            <li>The body is everything after the title + metadata lines.</li>
            <li>Checklists are counted across the <strong className="text-foreground">entire file</strong>, regardless of which section they appear in.</li>
          </ul>
        </div>
      </section>

      {/* Status and priority values */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Status and priority values</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium">Status</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><InlineCode>todo</InlineCode> &mdash; Not started</li>
              <li><InlineCode>in-progress</InlineCode> &mdash; Actively being worked on</li>
              <li><InlineCode>review</InlineCode> &mdash; Done, waiting for review</li>
              <li><InlineCode>completed</InlineCode> &mdash; Shipped</li>
              <li><InlineCode>blocked</InlineCode> &mdash; Waiting on a dependency</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Priority</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><InlineCode>low</InlineCode> &mdash; Nice to have</li>
              <li><InlineCode>medium</InlineCode> &mdash; Normal priority (default)</li>
              <li><InlineCode>high</InlineCode> &mdash; Important, do soon</li>
              <li><InlineCode>critical</InlineCode> &mdash; Must be done now</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Blocked section */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Blocked tickets</h2>
        <p className="leading-relaxed text-muted-foreground">
          When a ticket has <InlineCode>**Status:** blocked</InlineCode>, add a{" "}
          <InlineCode>## Blocked</InlineCode> section explaining why. The parser extracts
          this as the <InlineCode>blockedReason</InlineCode> field, shown as a red banner in the UI.
        </p>
        <CodeBlock>{`# OAuth Integration

**Status:** blocked

## Blocked

Waiting for GitHub OAuth to be configured. Can't fetch
private repo commits without auth token.

## What it does

Replace the PAT-based auth with per-user GitHub OAuth tokens.`}</CodeBlock>
      </section>

      {/* Checklist tracking */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Checklist tracking</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy counts <InlineCode>- [x]</InlineCode> and <InlineCode>- [ ]</InlineCode> items
          across the entire file to calculate progress. This drives the completion percentage
          shown on the kanban board and in the feature view.
        </p>
        <CodeBlock>{`## Checklist

- [x] Design the dialog layout          # counted as completed
- [x] Add form fields                   # counted as completed
- [ ] Wire to Convex mutation            # counted as pending
- [ ] Add input validation              # counted as pending

## Still needs

- [ ] Error handling for network issues  # also counted as pending`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          In this example, the ticket shows <strong className="text-foreground">2 / 5</strong> (40% complete).
          Both <InlineCode>## Checklist</InlineCode> and <InlineCode>## Still needs</InlineCode> items
          are counted &mdash; every <InlineCode>- [x]</InlineCode> and <InlineCode>- [ ]</InlineCode> in
          the file contributes to the total.
        </p>
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Tip</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use checklists liberally. They give you fine-grained progress visibility without
            needing to create separate tickets for every small step. The kanban card shows
            a progress bar based on these counts.
          </p>
        </div>
      </section>

      {/* Real example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Real example: Auto-Sync epic</h2>
        <p className="leading-relaxed text-muted-foreground">
          Here&apos;s a real epic from Speedy Gonzales itself, showing how the format
          looks in practice with two tickets:
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              <InlineCode>plans/features/auto-sync/_context.md</InlineCode>
            </p>
            <CodeBlock>{`# Auto-Sync

**Status:** in-progress
**Priority:** critical

## Overview

The core engine of Speedy Gonzales. Reads plans/features/ from
linked GitHub repos, parses .md files, and stores everything in
Convex. Keeps the app in sync via webhooks — when anyone pushes
to the repo, the app updates within seconds.

## What's built

- [x] Plan parser — extracts title, status, priority, checklists
- [x] GitHub provider implementation
- [x] Sync engine with upsert logic
- [x] Webhook handler endpoint
- [x] Race condition guard (isSyncing flag)
- [x] "Sync now" button with live timer

## Still needs

- [ ] GitHub OAuth flow (replace PAT with per-user tokens)
- [ ] Webhook signature verification
- [ ] Sync error display in UI`}</CodeBlock>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              <InlineCode>plans/features/auto-sync/upsert-logic.md</InlineCode>
            </p>
            <CodeBlock>{`# Upsert Logic (Epics + Tickets)

**Status:** completed
**Priority:** medium

## What it does

Internal mutation that takes parsed plan data and upserts it
into the epics and tickets tables. Uses content hashing to
skip unchanged files.

## Checklist

- [x] Find existing by [projectId, path] index
- [x] If exists and hash same — skip (no change)
- [x] If exists and hash different — update all fields
- [x] If new — insert
- [x] Soft-delete paths in DB but NOT in new data
- [x] Track ticket count per epic`}</CodeBlock>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          The epic shows 6/9 checklist items complete (67%). The upsert-logic ticket
          is fully complete at 6/6. Both are parsed and displayed in the kanban and feature view.
        </p>
      </section>

      {/* How sync reads plans */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How the sync engine reads plans</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Scan", desc: "Fetches the file tree from GitHub and filters to plans/features/" },
            { step: "2", label: "Group", desc: "Groups files by directory \u2014 each directory is an epic" },
            { step: "3", label: "Identify", desc: "_context.md becomes the epic, other .md files become tickets" },
            { step: "4", label: "Parse", desc: "Extracts title, status, priority, body, and checklist from each file" },
            { step: "5", label: "Upsert", desc: "Creates or updates epics and tickets in Convex by file path" },
            { step: "6", label: "Clean", desc: "Soft-deletes epics/tickets whose files no longer exist in the repo" },
          ].map((item) => (
            <StepCard key={item.step} {...item} />
          ))}
        </div>
      </section>

      {/* Recommended sections */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recommended sections</h2>
        <p className="leading-relaxed text-muted-foreground">
          These sections are optional but help keep plans consistent:
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Section</th>
                <th className="px-4 py-2 text-left font-medium">Used in</th>
                <th className="px-4 py-2 text-left font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                { section: "## Overview", used: "Epics", purpose: "What the feature does" },
                { section: "## What it does", used: "Tickets", purpose: "What the task does" },
                { section: "## UI built (mock)", used: "Epics", purpose: "Checklist of built UI" },
                { section: "## Components", used: "Epics", purpose: "Extracted components list" },
                { section: "## Hooks", used: "Epics", purpose: "Custom hooks list" },
                { section: "## Checklist", used: "Tickets", purpose: "Step-by-step task progress" },
                { section: "## Files", used: "Tickets", purpose: "Relevant source files" },
                { section: "## Still needs", used: "Both", purpose: "Remaining work" },
                { section: "## Depends on", used: "Both", purpose: "Dependencies" },
                { section: "## Blocked", used: "Tickets", purpose: "Reason for blocked status" },
                { section: "## Routes", used: "Epics", purpose: "URL paths this feature owns" },
                { section: "## What's built", used: "Epics", purpose: "Prose description of current state" },
              ].map((row) => (
                <tr key={row.section} className="border-b border-border last:border-0">
                  <td className="px-4 py-2"><InlineCode>{row.section}</InlineCode></td>
                  <td className="px-4 py-2">{row.used}</td>
                  <td className="px-4 py-2">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tips */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Tips</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            The <InlineCode>SPEC.md</InlineCode> file in your plans folder is the canonical
            format reference. AI agents read it to know exactly how to create and modify plans.
          </li>
          <li>
            Files outside <InlineCode>features/</InlineCode> (like <InlineCode>design-system.md</InlineCode> or{" "}
            <InlineCode>business-model.md</InlineCode>) won&apos;t be synced but are useful as
            context for your team and AI agents.
          </li>
          <li>
            If <InlineCode>**Status:**</InlineCode> or <InlineCode>**Priority:**</InlineCode> is missing,
            the defaults are <InlineCode>todo</InlineCode> and <InlineCode>medium</InlineCode>.
          </li>
          <li>
            A minimal epic only needs a title and status &mdash; the body and all sections are optional.
          </li>
        </ul>
      </section>
    </div>
  )
}
