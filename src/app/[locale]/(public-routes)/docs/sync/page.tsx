import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SyncDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">GitHub Auto-Sync</h1>
        <p className="mt-2 text-muted-foreground">
          How plan files in your repo stay in sync with the Speedy Gonzales UI.
        </p>
      </div>

      {/* What sync does */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What sync does</h2>
        <p className="leading-relaxed text-muted-foreground">
          The sync engine reads markdown files from your{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">plans/features/</code> directory
          on GitHub, parses them into structured data (epics and tickets), and upserts the results
          into Convex. The UI then displays this data via reactive queries &mdash; any change
          propagates to the kanban board in real time.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Only files under your project&apos;s configured <code className="rounded bg-muted px-1.5 py-0.5 text-sm">plansPath</code> are
          synced. Code, config, and other files are ignored entirely.
        </p>
      </section>

      {/* What gets parsed */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What gets parsed</h2>
        <p className="leading-relaxed text-muted-foreground">
          For each markdown file, the sync engine extracts:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">Title</strong> &mdash; from the first <code className="rounded bg-muted px-1.5 py-0.5 text-sm"># Heading</code></li>
          <li><strong className="text-foreground">Status</strong> &mdash; from <code className="rounded bg-muted px-1.5 py-0.5 text-sm">**Status:** value</code> in the frontmatter</li>
          <li><strong className="text-foreground">Priority</strong> &mdash; from <code className="rounded bg-muted px-1.5 py-0.5 text-sm">**Priority:** value</code></li>
          <li><strong className="text-foreground">Checklist progress</strong> &mdash; counts <code className="rounded bg-muted px-1.5 py-0.5 text-sm">[x]</code> vs <code className="rounded bg-muted px-1.5 py-0.5 text-sm">[ ]</code> items across the entire file</li>
          <li><strong className="text-foreground">Commits</strong> &mdash; SHA references from a <code className="rounded bg-muted px-1.5 py-0.5 text-sm">## Commits</code> section</li>
          <li><strong className="text-foreground">Agent name</strong> &mdash; from <code className="rounded bg-muted px-1.5 py-0.5 text-sm">**Agent:** value</code> if present</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Each subdirectory under <code className="rounded bg-muted px-1.5 py-0.5 text-sm">features/</code> becomes
          an <strong>epic</strong>. The <code className="rounded bg-muted px-1.5 py-0.5 text-sm">_context.md</code> file
          defines the epic&apos;s metadata. Every other <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.md</code> file
          becomes a <strong>ticket</strong>.
        </p>
      </section>

      {/* Automatic sync (webhook) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Automatic sync (webhook)</h2>
        <p className="leading-relaxed text-muted-foreground">
          When you create a project, Speedy Gonzales registers a webhook on your GitHub repo.
          Every push to the repository triggers the following flow:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          <li>GitHub sends a <code className="rounded bg-muted px-1.5 py-0.5 text-sm">POST</code> to <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/github-webhook</code></li>
          <li>The handler verifies the HMAC-SHA256 signature using the project&apos;s webhook secret</li>
          <li>It checks if any changed files (added, modified, or removed) are inside the project&apos;s <code className="rounded bg-muted px-1.5 py-0.5 text-sm">plansPath</code></li>
          <li>If relevant files changed, it schedules a sync action for that project</li>
          <li>The sync fetches the full file tree from GitHub, filters to plan files, and groups them into epics</li>
          <li>For each file, it compares the content hash (git SHA) against what&apos;s already in Convex &mdash; unchanged files are skipped</li>
          <li>Changed files are fetched, parsed, and upserted. Deleted files are soft-deleted in Convex</li>
          <li>The UI updates in real time via Convex reactive queries</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Only pushes that include plan file changes trigger a sync. Code-only pushes are ignored.
          The webhook only processes <code className="rounded bg-muted px-1.5 py-0.5 text-sm">push</code> events &mdash;
          PRs, issues, and other events are silently skipped.
        </p>
      </section>

      {/* Manual sync */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Manual sync</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every project has a <strong>&quot;Sync now&quot;</strong> button in the project header.
          Clicking it triggers a full sync on demand. This is useful as a fallback if a webhook
          was missed, or after initial setup when you want to pull in existing plans immediately.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          The sync can also be triggered programmatically via the Convex mutation:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`// From a Convex client
import { api } from "../convex/_generated/api"

await convex.mutation(api.githubSync.syncProject, {
  projectId: "your-project-id"
})`}
        </pre>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="mb-2 font-medium text-destructive">
            Warning &mdash; Manual sync reads from GitHub, not local files
          </p>
          <p className="text-sm text-muted-foreground">
            If you edited plan files locally but haven&apos;t pushed, clicking &quot;Sync now&quot;
            will overwrite Convex with the <strong className="text-foreground">older version</strong> from
            GitHub. Always run <code className="rounded bg-muted px-1.5 py-0.5">git push</code> before
            using manual sync.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The automatic webhook sync doesn&apos;t have this problem because it only fires
            after a push.
          </p>
        </div>
      </section>

      {/* Race condition guard */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Concurrency &amp; locking</h2>
        <p className="leading-relaxed text-muted-foreground">
          The sync engine uses an atomic lock to prevent concurrent syncs for the same project.
          Before starting, it claims a lock via a Convex mutation. If another sync is already
          running, the new one is silently skipped. The &quot;Sync now&quot; button disables
          while a sync is in progress.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Locks have a 5-minute staleness timeout. If a sync crashes without releasing the lock,
          the next sync attempt will reclaim it automatically.
        </p>
      </section>

      {/* /update-ticket-status endpoint */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Real-time status updates</h2>
        <p className="leading-relaxed text-muted-foreground">
          The autonomous dev loop updates ticket status in real time via an HTTP endpoint,
          without waiting for git push + webhook. This makes the kanban board reflect the
          actual state of work as it happens.
        </p>
        <h3 className="mt-4 font-medium">
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">POST /update-ticket-status</code>
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Updates a ticket&apos;s status in Convex. Requires API key authentication.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`curl -X POST https://your-convex-url.convex.site/update-ticket-status \\
  -H "Authorization: Bearer $LOOP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "repoOwner": "your-org",
    "repoName": "your-repo",
    "ticketPath": "plans/features/auth/login-flow.md",
    "status": "in-progress"
  }'`}
        </pre>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2.5 text-left font-medium">Field</th>
                <th className="px-4 py-2.5 text-left font-medium">Required</th>
                <th className="px-4 py-2.5 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-t border-border">
                <td className="px-4 py-2.5"><code className="rounded bg-muted px-1.5 py-0.5">repoOwner</code></td>
                <td className="px-4 py-2.5">Yes</td>
                <td className="px-4 py-2.5">GitHub organization or user</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5"><code className="rounded bg-muted px-1.5 py-0.5">repoName</code></td>
                <td className="px-4 py-2.5">Yes</td>
                <td className="px-4 py-2.5">Repository name</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5"><code className="rounded bg-muted px-1.5 py-0.5">ticketPath</code></td>
                <td className="px-4 py-2.5">Yes</td>
                <td className="px-4 py-2.5">Full path to the ticket markdown file in the repo</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5"><code className="rounded bg-muted px-1.5 py-0.5">status</code></td>
                <td className="px-4 py-2.5">Yes</td>
                <td className="px-4 py-2.5">One of: <code className="rounded bg-muted px-1.5 py-0.5">backlog</code>, <code className="rounded bg-muted px-1.5 py-0.5">todo</code>, <code className="rounded bg-muted px-1.5 py-0.5">in-progress</code>, <code className="rounded bg-muted px-1.5 py-0.5">review</code>, <code className="rounded bg-muted px-1.5 py-0.5">completed</code>, <code className="rounded bg-muted px-1.5 py-0.5">blocked</code></td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2.5"><code className="rounded bg-muted px-1.5 py-0.5">blockedReason</code></td>
                <td className="px-4 py-2.5">No</td>
                <td className="px-4 py-2.5">Explanation when status is <code className="rounded bg-muted px-1.5 py-0.5">blocked</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          The response includes the previous and new status, so the caller can verify the transition:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`{
  "ok": true,
  "ticketId": "abc123",
  "previousStatus": "todo",
  "newStatus": "in-progress"
}`}
        </pre>
      </section>

      {/* /autonomous-loop/status endpoint */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Loop status endpoint</h2>
        <p className="leading-relaxed text-muted-foreground">
          The autonomous dev loop queries this endpoint to discover which projects are active
          and which tickets need work:
        </p>
        <h3 className="mt-4 font-medium">
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">GET /autonomous-loop/status</code>
        </h3>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`curl https://your-convex-url.convex.site/autonomous-loop/status \\
  -H "Authorization: Bearer $LOOP_API_KEY"`}
        </pre>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Returns a JSON array of active projects, each with their{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">todoTickets</code> list. The loop uses this
          to decide which tickets to assign to agents. Both endpoints require a{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">LOOP_API_KEY</code> environment variable
          for authentication.
        </p>
      </section>

      {/* Data flow diagram */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Full data flow</h2>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`Plan content sync (webhook)
───────────────────────────
  git push  ──▶  GitHub webhook  ──▶  /github-webhook
                                          │
                                     verify signature
                                     check plansPath
                                          │
                                     schedule sync action
                                          │
                                     fetch tree + files
                                     parse markdown
                                     compare content hashes
                                          │
                                     upsert to Convex  ──▶  UI updates

Status updates (HTTP API)
─────────────────────────
  Agent finishes  ──▶  POST /update-ticket-status  ──▶  Convex  ──▶  UI updates
  Agent starts    ──▶  POST /update-ticket-status  ──▶  Convex  ──▶  UI updates

Loop discovery
──────────────
  Loop process  ──▶  GET /autonomous-loop/status  ──▶  todo tickets list`}
        </pre>
      </section>

      {/* Architecture notes */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Architecture notes</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            Authentication uses a <strong>Personal Access Token (PAT)</strong> stored as a
            Convex environment variable.
          </li>
          <li>
            The sync engine uses a <strong>provider-agnostic interface</strong> (<code className="rounded bg-muted px-1.5 py-0.5 text-sm">GitProvider</code>),
            so Bitbucket and GitLab support can be added later.
          </li>
          <li>
            All GitHub API calls run as <strong>Convex actions</strong> &mdash; no
            Next.js API routes involved in the sync flow.
          </li>
          <li>
            Content hashing uses the git blob SHA, so unchanged files skip fetch and parse entirely.
          </li>
          <li>
            Upserts are batched (max 50 items per mutation) to stay within Convex operation limits.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section id="faq" className="space-y-6">
        <h2 className="text-xl font-semibold">FAQ</h2>

        <div className="space-y-2">
          <h3 className="font-medium">Does the sync touch my code?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            No. The sync only reads plan files from GitHub and writes structured data to Convex.
            It never modifies files on your machine, never touches{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">src/</code>, and never
            runs <code className="rounded bg-muted px-1.5 py-0.5">git pull</code>.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">What triggers an auto-sync?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A <code className="rounded bg-muted px-1.5 py-0.5">git push</code> that includes
            changes inside the project&apos;s <code className="rounded bg-muted px-1.5 py-0.5">plansPath</code> directory.
            Code-only pushes do not trigger a sync.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">How fast is the sync?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Typically 2&ndash;5 seconds after pushing. GitHub sends the webhook immediately,
            and unchanged files are skipped via content hash comparison. The sync timer next
            to the &quot;Sync now&quot; button shows the exact duration.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">What if I click &quot;Sync now&quot; twice?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nothing bad happens. The sync engine uses an atomic lock &mdash; if a sync is already
            running, the second one is silently skipped. The button also disables while syncing.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Can the autonomous loop and webhook conflict?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            No. The loop updates <strong>status</strong> via the HTTP API. The webhook syncs{" "}
            <strong>content</strong> from git. They write to different fields. If both happen
            simultaneously, the sync lock prevents data corruption from concurrent syncs, and
            status-only updates don&apos;t trigger a sync at all.
          </p>
        </div>
      </section>
    </div>
  )
}
