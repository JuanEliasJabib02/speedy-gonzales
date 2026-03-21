import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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
          How to organize your plans folder so Speedy Gonzales can read it.
        </p>
      </div>

      {/* Getting started */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Getting started</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy Gonzales reads a <code className="rounded bg-muted px-1.5 py-0.5 text-sm">plans/features/</code> directory
          from your GitHub repo. Each subdirectory is a <strong>feature (epic)</strong> and
          each markdown file inside it is a <strong>ticket</strong>. Create this folder
          structure in your repo and Speedy will do the rest.
        </p>
      </section>

      {/* Directory structure */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Directory structure</h2>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`plans/
├── features/
│   ├── auth/                    # Epic: Authentication
│   │   ├── _context.md          # Required — epic overview
│   │   ├── login-flow.md        # Ticket
│   │   ├── otp-verify.md        # Ticket
│   │   └── route-protection.md  # Ticket
│   ├── dashboard/               # Epic: Dashboard
│   │   ├── _context.md
│   │   ├── project-cards.md
│   │   └── create-dialog.md
│   └── kanban/                  # Epic: Kanban Board
│       ├── _context.md
│       └── board-layout.md
├── business-model.md            # Optional — not synced
├── design-system.md             # Optional — not synced
└── SPEC.md                      # Format reference`}
        </pre>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>Only <code className="rounded bg-muted px-1.5 py-0.5 text-sm">plans/features/</code> is synced &mdash; files outside it are ignored by the sync engine</li>
          <li>Each subdirectory under <code className="rounded bg-muted px-1.5 py-0.5 text-sm">features/</code> becomes an <strong>epic</strong></li>
          <li>Only <strong>2 levels deep</strong> &mdash; nested subdirectories inside an epic are ignored</li>
          <li>Use <strong>kebab-case</strong> for directories and file names</li>
        </ul>
      </section>

      {/* _context.md */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          The <code className="rounded bg-muted px-1.5 py-0.5 text-sm">_context.md</code> file
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Every epic <strong>must</strong> have a <code className="rounded bg-muted px-1.5 py-0.5 text-sm">_context.md</code>.
          This is the epic&apos;s identity &mdash; its title, status, priority, and overview.
          Without it, the epic shows up as &quot;Untitled&quot; with no metadata.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`# Auth

**Status:** completed
**Priority:** critical

## Overview

Users log in with email OTP. After login, they're redirected
to the dashboard. All app routes are protected.

## UI built (mock)

- [x] Login page with email input
- [x] OTP verification dialog
- [ ] Password reset flow

## Still needs

- [ ] Wire to Convex mutations
- [ ] Rate limiting on OTP attempts`}
        </pre>
      </section>

      {/* Ticket files */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Ticket files</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.md</code> file
          in an epic directory (other than <code className="rounded bg-muted px-1.5 py-0.5 text-sm">_context.md</code>)
          is a ticket. Tickets follow the same format as epics.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`# Create Project Dialog

**Status:** in-progress
**Priority:** medium

## What it does

A dialog form for creating new projects with name,
description, and GitHub repo URL fields.

## Checklist

- [x] Dialog component with form fields
- [x] Cancel and Create buttons
- [ ] Wire to Convex mutation
- [ ] Add input validation`}
        </pre>
      </section>

      {/* Parsed fields */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Parsed fields</h2>
        <p className="leading-relaxed text-muted-foreground">
          The sync engine extracts these fields from every <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.md</code> file:
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Field</th>
                <th className="px-4 py-2 text-left font-medium">Source</th>
                <th className="px-4 py-2 text-left font-medium">Default</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">title</td>
                <td className="px-4 py-2">First <code className="rounded bg-muted px-1 text-sm"># Heading</code></td>
                <td className="px-4 py-2">Directory name</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">status</td>
                <td className="px-4 py-2"><code className="rounded bg-muted px-1 text-sm">**Status:**</code> value</td>
                <td className="px-4 py-2">todo</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">priority</td>
                <td className="px-4 py-2"><code className="rounded bg-muted px-1 text-sm">**Priority:**</code> value</td>
                <td className="px-4 py-2">medium</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">body</td>
                <td className="px-4 py-2">Everything after header block</td>
                <td className="px-4 py-2">Empty</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-foreground">checklist</td>
                <td className="px-4 py-2">Count of <code className="rounded bg-muted px-1 text-sm">- [x]</code> and <code className="rounded bg-muted px-1 text-sm">- [ ]</code></td>
                <td className="px-4 py-2">0 / 0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Status and priority */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Status and priority values</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium">Status</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">todo</code> &mdash; Not started</li>
              <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">in-progress</code> &mdash; Active work</li>
              <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">review</code> &mdash; Waiting for review</li>
              <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">completed</code> &mdash; Shipped</li>
              <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">blocked</code> &mdash; Waiting on dependency</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Priority</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">low</code> &mdash; Nice to have</li>
              <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">medium</code> &mdash; Normal (default)</li>
              <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">high</code> &mdash; Important</li>
              <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">critical</code> &mdash; Must do now</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How sync reads it */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How the sync engine reads plans</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Scan", desc: "Fetches the file tree from GitHub and filters to plans/features/" },
            { step: "2", label: "Group", desc: "Groups files by directory — each directory is an epic" },
            { step: "3", label: "Identify", desc: "_context.md becomes the epic, other .md files become tickets" },
            { step: "4", label: "Parse", desc: "Extracts title, status, priority, body, and checklist from each file" },
            { step: "5", label: "Upsert", desc: "Creates or updates epics and tickets in Convex by file path" },
            { step: "6", label: "Clean", desc: "Soft-deletes epics/tickets whose files no longer exist in the repo" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground"> &mdash; {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Common sections */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recommended sections</h2>
        <p className="leading-relaxed text-muted-foreground">
          These sections are optional but help keep plans consistent. Use them when relevant:
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
              ].map((row) => (
                <tr key={row.section} className="border-b border-border last:border-0">
                  <td className="px-4 py-2"><code className="rounded bg-muted px-1 text-sm">{row.section}</code></td>
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
            The <code className="rounded bg-muted px-1.5 py-0.5 text-sm">SPEC.md</code> file
            in your plans folder is the canonical format reference. The AI agent reads it
            to know exactly how to create and modify plans.
          </li>
          <li>
            You can add files outside <code className="rounded bg-muted px-1.5 py-0.5 text-sm">features/</code> (like{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">design-system.md</code> or{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">roadmap.md</code>) for project-level docs.
            These won&apos;t be synced but are useful as context for your team and the AI agent.
          </li>
          <li>
            Checklists (<code className="rounded bg-muted px-1.5 py-0.5 text-sm">- [x]</code> /{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">- [ ]</code>) are counted across the
            entire file, regardless of which section they&apos;re in.
          </li>
          <li>
            If <code className="rounded bg-muted px-1.5 py-0.5 text-sm">**Status:**</code> or{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">**Priority:**</code> is missing,
            the defaults are <code className="rounded bg-muted px-1.5 py-0.5 text-sm">todo</code> and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">medium</code>.
          </li>
        </ul>
      </section>
    </div>
  )
}
