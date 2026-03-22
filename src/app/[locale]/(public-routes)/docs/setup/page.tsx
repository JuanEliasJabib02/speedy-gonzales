import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SetupDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">Setup Guide</h1>
        <p className="mt-2 text-muted-foreground">
          Connect your GitHub repo to Speedy Gonzales and deploy to production.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What you need</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>A GitHub repository with a <code className="rounded bg-muted px-1.5 py-0.5 text-sm">plans/features/</code> directory (see <Link href="/docs/plans" className="text-primary underline-offset-4 hover:underline">Plan Structure</Link>)</li>
          <li>A GitHub Personal Access Token (PAT) with <code className="rounded bg-muted px-1.5 py-0.5 text-sm">repo</code> scope</li>
          <li>A Convex deployment running Speedy Gonzales</li>
        </ul>
      </section>

      {/* Step 1 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 1 — Create your project</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Log in", desc: "Sign in to Speedy Gonzales with your email" },
            { step: "2", label: "Dashboard", desc: "Click \"New project\" on the dashboard" },
            { step: "3", label: "Fill in", desc: "Enter a project name, description, and your GitHub repo URL" },
            { step: "4", label: "Create", desc: "Click Create — Speedy runs the first sync automatically" },
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
        <p className="text-sm text-muted-foreground">
          After creating the project, your epics and tickets appear on the kanban board.
          But auto-sync won&apos;t work yet &mdash; you need to set up the webhook.
        </p>
      </section>

      {/* Step 2 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 2 — Set up the GitHub webhook</h2>
        <p className="leading-relaxed text-muted-foreground">
          The webhook tells Speedy every time you push changes. Without it,
          you&apos;d have to click &quot;Sync now&quot; manually every time.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Open settings", desc: "Go to your GitHub repo → Settings → Webhooks → Add webhook" },
            { step: "2", label: "Payload URL", desc: "Enter your Convex HTTP Actions URL + /github-webhook" },
            { step: "3", label: "Content type", desc: "Change to application/json" },
            { step: "4", label: "Secret", desc: "Leave empty for now (optional)" },
            { step: "5", label: "Events", desc: "Select \"Just the push event\"" },
            { step: "6", label: "Save", desc: "Click \"Add webhook\" — GitHub will send a ping to verify" },
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

        <div className="space-y-3">
          <h3 className="font-medium">How to find your Payload URL</h3>
          <p className="text-sm text-muted-foreground">
            Go to <strong className="text-foreground">dashboard.convex.dev</strong> → your
            project → <strong className="text-foreground">Settings</strong> → look for
            <strong className="text-foreground"> HTTP Actions URL</strong>. It looks like:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`https://your-deployment-name.convex.site`}
          </pre>
          <p className="text-sm text-muted-foreground">
            Add <code className="rounded bg-muted px-1.5 py-0.5">/github-webhook</code> at the end:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`https://your-deployment-name.convex.site/github-webhook`}
          </pre>
        </div>
      </section>

      {/* Step 3 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 3 — Test it</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Edit", desc: "Change any file inside plans/features/ in your repo" },
            { step: "2", label: "Push", desc: "Commit and push to GitHub" },
            { step: "3", label: "Watch", desc: "Open your project in Speedy — the kanban should update within seconds" },
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
        <p className="text-sm text-muted-foreground">
          The sync timer next to the &quot;Sync now&quot; button shows when the last sync happened.
          If it updates after your push, the webhook is working.
        </p>
      </section>

      {/* Step 4 — Deploy to production */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 4 — Deploy to production (Vercel)</h2>
        <p className="leading-relaxed text-muted-foreground">
          Once everything works locally, deploy to Vercel so your app is live and
          auto-deploys on every push.
        </p>

        {/* 5.1 Connect repo */}
        <div className="space-y-3">
          <h3 className="font-medium">1. Connect your repo to Vercel</h3>
          <div className="flex flex-col gap-2">
            {[
              { step: "1", label: "Sign in", desc: "Go to vercel.com and sign in with GitHub" },
              { step: "2", label: "Add project", desc: "Click \"Add New Project\" → import your GitHub repository" },
              { step: "3", label: "Deploy", desc: "Vercel auto-detects Next.js — click Deploy, no config needed" },
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
        </div>

        {/* 5.2 Vercel env vars */}
        <div className="space-y-3">
          <h3 className="font-medium">2. Required environment variables in Vercel</h3>
          <p className="text-sm text-muted-foreground">
            Go to your Vercel project → <strong className="text-foreground">Settings</strong> → <strong className="text-foreground">Environment Variables</strong> and add:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud`}
          </pre>
          <p className="text-sm text-muted-foreground">
            Find <code className="rounded bg-muted px-1.5 py-0.5">NEXT_PUBLIC_CONVEX_URL</code> in the Convex dashboard under <strong className="text-foreground">Settings → URL</strong>.
          </p>
        </div>

        {/* 5.3 Convex env vars */}
        <div className="space-y-3">
          <h3 className="font-medium">3. Required environment variables in Convex</h3>
          <p className="text-sm text-muted-foreground">
            These go in the <strong className="text-foreground">Convex dashboard</strong> (not Vercel) under <strong className="text-foreground">Settings → Environment Variables</strong>:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`RESEND_API_KEY=<from resend.com — free tier, for magic link login>
AUTH_SECRET=<random string — run: openssl rand -hex 32>
SITE_URL=https://<your-app>.vercel.app`}
          </pre>
          <p className="text-sm text-muted-foreground">
            Generate <code className="rounded bg-muted px-1.5 py-0.5">AUTH_SECRET</code> with:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`openssl rand -hex 32`}
          </pre>
        </div>

        {/* 4.4 Auto-deploy */}
        <div className="space-y-3">
          <h3 className="font-medium">4. How auto-deploy works</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Once connected, Vercel handles everything automatically:
          </p>
          <div className="flex flex-col gap-2">
            {[
              { step: "1", label: "Push to main", desc: "Every push to main triggers a Vercel build automatically" },
              { step: "2", label: "Build", desc: "Vercel builds your Next.js app (~2 min)" },
              { step: "3", label: "Live", desc: "The new version is live in production — no manual steps" },
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
          <p className="text-sm text-muted-foreground">
            No need to SSH into the server or run <code className="rounded bg-muted px-1.5 py-0.5">git pull</code> manually.
            The agent pushes code, Vercel builds, and it&apos;s live.
          </p>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Troubleshooting</h2>

        <div className="space-y-2">
          <h3 className="font-medium">Webhook not firing</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Go to your GitHub repo → Settings → Webhooks → click your webhook →
            scroll to <strong className="text-foreground">Recent Deliveries</strong>.
            You should see a delivery for each push. If the status is red,
            check that the Payload URL is correct and your Convex deployment is running.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Sync runs but data doesn&apos;t update</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Make sure your changes are inside <code className="rounded bg-muted px-1.5 py-0.5">plans/features/</code>.
            The sync engine ignores files outside this path. Also verify that your{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">GITHUB_PAT</code> environment variable
            is set in Convex with a token that has <code className="rounded bg-muted px-1.5 py-0.5">repo</code> scope.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Content type error</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The webhook must send <code className="rounded bg-muted px-1.5 py-0.5">application/json</code>.
            If you left it as <code className="rounded bg-muted px-1.5 py-0.5">application/x-www-form-urlencoded</code>,
            the handler won&apos;t be able to parse the payload. Edit the webhook in GitHub and change the content type.
          </p>
        </div>
      </section>

      {/* Auto-sync broken - quick fix */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Auto-sync broken? Quick fix</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          If auto-sync stopped working after moving to cloud (or after updating your setup), the most common cause
          is that the GitHub webhook URL points to <code className="rounded bg-muted px-1.5 py-0.5">localhost</code> or an
          expired ngrok URL. The fix is simple — the webhook must <strong className="text-foreground">always</strong> point
          to Convex, not to Next.js.
        </p>

        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-destructive">❌ Wrong webhook URL (breaks on cloud)</p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{`https://localhost:3000/github-webhook
https://abc123.ngrok-free.app/github-webhook`}</pre>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-3">✅ Correct webhook URL (always works)</p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{`https://your-deployment.convex.site/github-webhook`}</pre>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Find your Convex site URL", desc: "dashboard.convex.dev → your project → Settings → HTTP Actions URL (ends in .convex.site)" },
            { step: "2", label: "Go to GitHub", desc: "Your repo → Settings → Webhooks → click the webhook" },
            { step: "3", label: "Update Payload URL", desc: "Replace with https://your-deployment.convex.site/github-webhook" },
            { step: "4", label: "Save and test", desc: "Click Update webhook — then push a small change to verify sync works" },
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

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Why this works</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Convex is always deployed in the cloud — it doesn&apos;t matter if Speedy runs locally or on Vercel.
            GitHub fires the webhook directly to Convex, which handles the sync internally.
            The webhook goes directly to Convex — no middleman needed.
          </p>
        </div>
      </section>

    </div>
  )
}
