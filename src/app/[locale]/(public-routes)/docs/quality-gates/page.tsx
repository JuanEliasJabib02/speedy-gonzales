import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function QualityGatesDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">Quality Gates</h1>
        <p className="mt-2 text-muted-foreground">
          A three-gate system that ensures every ticket is well-specced, verified against the codebase, and reviewed after execution.
        </p>
      </div>

      {/* Why quality gates */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why quality gates</h2>
        <p className="leading-relaxed text-muted-foreground">
          AI coding agents are powerful but brittle. Give them a vague spec and they produce vague code.
          Skip verification and bugs slip through silently. Ignore the existing codebase and the agent
          reinvents patterns that already exist &mdash; or worse, contradicts them. Quality gates solve
          this by adding structured checkpoints before, during, and after planning so that agents receive
          precise instructions and their output is validated against the plan.
        </p>
      </section>

      {/* Gate 1 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Gate 1: Structured Discussion</h2>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <p className="mb-2 font-medium text-primary">Before planning begins</p>
          <p className="text-sm text-muted-foreground">
            The orchestrator asks 3&ndash;5 targeted questions based on the feature&apos;s domain type,
            forcing ambiguity to the surface before a single ticket is written.
          </p>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Different feature types need different questions. The orchestrator detects the domain and selects
          the right question set:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Frontend</strong> &mdash; layout structure, interactive
            states, responsive breakpoints, component reuse, accessibility requirements
          </li>
          <li>
            <strong className="text-foreground">Backend</strong> &mdash; authentication model, error
            handling strategy, pagination approach, rate limiting, data validation
          </li>
          <li>
            <strong className="text-foreground">Data model</strong> &mdash; nullable fields, cascade
            deletes, index strategy, migration plan, relationship cardinality
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          The answers feed directly into ticket descriptions, replacing vague requirements with concrete
          decisions. A feature that passes Gate 1 has no open questions &mdash; every decision is made
          before code starts.
        </p>
      </section>

      {/* Gate 2 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Gate 2: Ticket Quality Verification</h2>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
          <p className="mb-2 font-medium text-yellow-600">After tickets are created, before dispatch</p>
          <p className="text-sm text-muted-foreground">
            A reviewer validates every ticket against the actual codebase. Tickets that reference
            non-existent files, use wrong patterns, or contain vague checklists are rejected and rewritten.
          </p>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          The verification checks four dimensions:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">File paths exist</strong> &mdash; every file referenced
            in the ticket must exist in the repo. If a ticket says &quot;modify{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">src/components/Header.tsx</code>&quot;
            but the file is actually at{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">src/components/header/Header.tsx</code>,
            the ticket fails verification.
          </li>
          <li>
            <strong className="text-foreground">Referenced patterns exist</strong> &mdash; if a ticket says
            &quot;follow the pattern in <code className="rounded bg-muted px-1.5 py-0.5 text-sm">useAuth</code>&quot;,
            the reviewer confirms that hook exists and that its pattern is actually worth following.
          </li>
          <li>
            <strong className="text-foreground">Checklist items are concrete</strong> &mdash; each item
            must describe a verifiable action. &quot;Implement the feature&quot; fails. &quot;Add a{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">useProjectSync</code> hook that calls{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">api.sync.trigger</code> and returns
            loading state&quot; passes.
          </li>
          <li>
            <strong className="text-foreground">No ticket conflicts</strong> &mdash; two tickets in the
            same epic should not modify the same files in contradictory ways. The reviewer detects overlap
            and flags it.
          </li>
        </ol>
      </section>

      {/* Gate 3 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Gate 3: UI Contract</h2>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
          <p className="mb-2 font-medium text-blue-600">Mandatory for every frontend ticket</p>
          <p className="text-sm text-muted-foreground">
            Every frontend ticket includes a UI Contract section that specifies exactly what the agent
            should build &mdash; preventing it from inventing its own design system.
          </p>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          The UI Contract covers four areas:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Layout</strong> &mdash; the structural arrangement of
            elements (grid, flex, sidebar + main, stacked sections)
          </li>
          <li>
            <strong className="text-foreground">States</strong> &mdash; what the component looks like in
            every state: loading (skeleton), empty (placeholder), error (message + retry), and populated
          </li>
          <li>
            <strong className="text-foreground">Components to reuse</strong> &mdash; which existing
            components from the codebase the agent must use instead of creating new ones
          </li>
          <li>
            <strong className="text-foreground">Design tokens</strong> &mdash; specific Tailwind classes,
            spacing values, and color tokens to use (e.g.{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">text-muted-foreground</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">border-border</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">rounded-lg</code>)
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Without a UI Contract, agents tend to hardcode colors, invent spacing values, and create
          components that look nothing like the rest of the app. The contract eliminates this entirely.
        </p>
      </section>

      {/* Post-Execution Verification */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Post-execution verification</h2>
        <p className="leading-relaxed text-muted-foreground">
          After an agent finishes coding, a <strong>separate agent with fresh context</strong> reviews
          the diff against the plan checklist. Fresh context matters &mdash; the reviewing agent has no
          memory of implementation decisions, so it evaluates purely against the spec.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          The reviewer walks through every checklist item and marks it <strong>PASS</strong> or{" "}
          <strong>FAIL</strong>:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">PASS</strong> &mdash; the diff satisfies the checklist
            item. The ticket moves to <code className="rounded bg-muted px-1.5 py-0.5 text-sm">review</code> status
            for human review.
          </li>
          <li>
            <strong className="text-foreground">FAIL</strong> &mdash; one or more items are missing or
            incorrect. The ticket is re-dispatched to a coding agent with the failure notes attached.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          This creates a feedback loop: plan &rarr; code &rarr; verify &rarr; fix &rarr; verify again.
          The loop continues until the diff matches the spec or a human intervenes.
        </p>
      </section>

      {/* Ticket format */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Ticket format</h2>
        <p className="leading-relaxed text-muted-foreground">
          A well-structured ticket is the foundation of the quality gate system. Here is the ideal format
          that passes all three gates:
        </p>

        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
          <p className="mb-3 font-medium text-green-600">Good example</p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`# Add project settings modal

**Status:** todo
**Priority:** high
**Agent:** claude

## What it does
Adds a settings modal accessible from the project header.
Users can update project name, plans path, and default branch.

## Checklist
- [ ] Create \`ProjectSettingsModal\` in \`src/components/project/\`
- [ ] Add form fields: name (text), plansPath (text), branch (select)
- [ ] Call \`api.projects.update\` mutation on submit
- [ ] Show success toast via \`sonner\`
- [ ] Add "Settings" button to \`ProjectHeader\` with Gear icon

## Files
- src/components/project/ProjectSettingsModal.tsx (create)
- src/components/project/ProjectHeader.tsx (modify)
- convex/projects.ts (modify — add update mutation)

## Patterns to follow
- Modal pattern: see \`src/components/CreateProjectModal.tsx\`
- Form validation: see \`src/components/OnboardingForm.tsx\`
- Toast usage: \`import { toast } from "sonner"\`

## UI Contract
- **Layout:** centered modal (max-w-md), stacked form fields with 16px gap
- **States:** loading (disabled inputs + spinner on submit), error (inline
  field errors in text-destructive), success (close modal + toast)
- **Reuse:** Button, Input, Label from shadcn/ui; Dialog for the modal shell
- **Tokens:** bg-card for modal body, border-border for dividers, text-sm
  for labels, rounded-lg for the modal container`}
          </pre>
        </div>

        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="mb-3 font-medium text-destructive">Bad example</p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`# Settings page

**Status:** todo

## Description
Add a way for users to change project settings.
Should look nice and be easy to use.

## Tasks
- [ ] Build the settings UI
- [ ] Connect to backend
- [ ] Handle errors`}
          </pre>
          <p className="mt-3 text-sm text-muted-foreground">
            This ticket would fail Gate 2: no file paths, no patterns to follow, vague checklist items,
            and no UI Contract. An agent receiving this ticket would have to guess at every decision.
          </p>
        </div>
      </section>

      {/* Flow diagram */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Full quality gate flow</h2>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`Quality Gate Pipeline
═════════════════════

  ┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────────┐
  │ Discuss  │────▶│ Research │────▶│  Plan   │────▶│ Verify Plan  │
  │ (Gate 1) │     │ codebase │     │ tickets │     │   (Gate 2)   │
  └─────────┘     └──────────┘     └─────────┘     └──────┬───────┘
                                                          │
                                              ┌───────────┘
                                              ▼
                                        ┌──────────┐     ┌──────────────┐
                                        │ Dispatch │────▶│    Code      │
                                        │  agent   │     │  (agent)     │
                                        └──────────┘     └──────┬───────┘
                                              ▲                 │
                                              │                 ▼
                                        ┌─────┴────┐     ┌──────────────┐
                                        │  FAIL    │◀────│ Verify Code  │
                                        │ (re-do)  │     │  (Gate 3+)   │
                                        └──────────┘     └──────┬───────┘
                                                                │ PASS
                                                                ▼
                                                          ┌──────────┐
                                                          │  Human   │
                                                          │  Review  │
                                                          └──────────┘

Gates
─────
  Gate 1 — Structured discussion (before planning)
  Gate 2 — Ticket quality verification (after planning, before dispatch)
  Gate 3 — UI Contract enforcement (embedded in every frontend ticket)
  Post  — Code verification (after agent finishes, separate reviewer)`}
        </pre>
      </section>
    </div>
  )
}
