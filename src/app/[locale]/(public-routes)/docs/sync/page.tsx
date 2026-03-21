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
        <h1 className="text-3xl font-semibold tracking-tight">GitHub Sync</h1>
        <p className="mt-2 text-muted-foreground">
          Keep your plans in sync between GitHub and Speedy Gonzales.
        </p>
      </div>

      {/* What sync does */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What sync does</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy Gonzales reads the <code className="rounded bg-muted px-1.5 py-0.5 text-sm">plans/</code> directory
          from your GitHub repository, parses the markdown files, and stores the
          structured data in Convex. This means your project plans live in your
          repo as plain markdown &mdash; version-controlled, reviewable, and
          always in sync with your IDE.
        </p>
      </section>

      {/* Automatic sync */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Automatic sync</h2>
        <p className="leading-relaxed text-muted-foreground">
          When you create a project, Speedy Gonzales registers a webhook on your
          GitHub repo. Every time someone pushes to the repository, GitHub sends
          a POST request to our webhook endpoint. The handler:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          <li>Verifies the request signature (HMAC-SHA256)</li>
          <li>Checks if any changed files are inside the plans directory</li>
          <li>If plan files changed, triggers a sync for that project</li>
          <li>Fetches the updated plan files from the GitHub API</li>
          <li>Parses markdown into epics and tickets</li>
          <li>Upserts the data in Convex &mdash; the UI updates in real time</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Only plan files trigger a sync. Pushing code changes alone won&apos;t
          cause unnecessary syncs.
        </p>
      </section>

      {/* Manual sync */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Manual sync</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every project has a <strong>&quot;Sync now&quot;</strong> button in the
          project header. Click it to trigger a full sync on demand. This is
          useful as a fallback if a webhook was missed, or after initial setup
          when you want to pull in existing plans immediately.
        </p>
      </section>

      {/* Plan structure */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Plan structure</h2>
        <p className="leading-relaxed text-muted-foreground">
          Plans follow a simple directory convention inside your repo:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`plans/
├── features/
│   ├── auth/
│   │   ├── _context.md      # Epic overview
│   │   ├── login-flow.md    # Ticket
│   │   └── otp-verify.md    # Ticket
│   ├── dashboard/
│   │   ├── _context.md
│   │   └── project-cards.md
│   └── kanban/
│       ├── _context.md
│       └── drag-drop.md`}
        </pre>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Each subdirectory under <code className="rounded bg-muted px-1.5 py-0.5 text-sm">features/</code> becomes an <strong>epic</strong></li>
          <li><code className="rounded bg-muted px-1.5 py-0.5 text-sm">_context.md</code> defines the epic&apos;s overview and metadata</li>
          <li>Every other <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.md</code> file becomes a <strong>ticket</strong></li>
        </ul>
      </section>

      {/* How it works step by step */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How it works &mdash; step by step</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Push", desc: "You push plan changes to GitHub" },
            { step: "2", label: "Webhook", desc: "GitHub sends a webhook POST to Speedy Gonzales" },
            { step: "3", label: "Verify", desc: "HMAC-SHA256 signature is validated" },
            { step: "4", label: "Detect", desc: "Changed files are checked against the plans path" },
            { step: "5", label: "Fetch", desc: "Updated plan files are fetched via GitHub API" },
            { step: "6", label: "Parse", desc: "Markdown is parsed into epics and tickets" },
            { step: "7", label: "Upsert", desc: "Data is upserted in Convex" },
            { step: "8", label: "Live", desc: "UI updates in real time via reactive queries" },
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

      {/* Architecture notes */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Architecture notes</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            Authentication uses a <strong>Personal Access Token (PAT)</strong> stored as a
            Convex environment variable for the MVP.
          </li>
          <li>
            The sync engine uses a <strong>provider-agnostic interface</strong> (<code className="rounded bg-muted px-1.5 py-0.5 text-sm">GitProvider</code>),
            so Bitbucket and GitLab support can be added later.
          </li>
          <li>
            All GitHub API calls run as <strong>Convex actions</strong> &mdash; no
            Next.js API routes involved in the sync flow.
          </li>
        </ul>
      </section>
    </div>
  )
}
