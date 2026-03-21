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

      {/* Step 4 — OpenClaw */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 4 — Connect OpenClaw Chat</h2>
        <p className="leading-relaxed text-muted-foreground">
          The AI chat is powered by an OpenClaw agent via an OpenAI-compatible API.
          The agent runs on a remote server exposed through a Cloudflare Tunnel.
        </p>

        <div className="space-y-3">
          <h3 className="font-medium">Environment variables</h3>
          <p className="text-sm text-muted-foreground">
            Add these to your <code className="rounded bg-muted px-1.5 py-0.5">.env.local</code>:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`OPENCLAW_BASE_URL=https://<your-tunnel>.trycloudflare.com/v1
OPENCLAW_API_KEY=<your-gateway-token>
OPENCLAW_MODEL=openclaw:main`}
          </pre>
          <p className="text-sm text-muted-foreground">
            Also set them in Convex for future use:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`npx convex env set OPENCLAW_BASE_URL "https://<your-tunnel>.trycloudflare.com/v1"
npx convex env set OPENCLAW_API_KEY "<your-gateway-token>"
npx convex env set OPENCLAW_MODEL "openclaw:main"`}
          </pre>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">How it works</h3>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>The agent runs on a VPS, exposed via <strong className="text-foreground">Cloudflare Tunnel</strong> (temporary URL for development)</li>
            <li>The Next.js API route at <code className="rounded bg-muted px-1.5 py-0.5">/api/chat</code> proxies requests, keeping credentials server-side</li>
            <li>Streaming is supported via SSE &mdash; responses appear token-by-token</li>
            <li>The <code className="rounded bg-muted px-1.5 py-0.5">user: &quot;juan&quot;</code> field enables persistent sessions across messages</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Connection methods</h3>
          <p className="text-sm text-muted-foreground">
            The default method is <strong className="text-foreground">Cloudflare Tunnel</strong> &mdash;
            the agent runs on a VPS and Cloudflare exposes it via a public HTTPS URL.
            This is the simplest setup and what we use for development.
          </p>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-medium">Method</th>
                  <th className="px-4 py-2.5 text-left font-medium">When to use</th>
                  <th className="px-4 py-2.5 text-left font-medium">URL format</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium text-foreground">Cloudflare Tunnel</td>
                  <td className="px-4 py-2.5">Development (default)</td>
                  <td className="px-4 py-2.5"><code className="rounded bg-muted px-1.5 py-0.5">https://&lt;random&gt;.trycloudflare.com/v1</code></td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium text-foreground">Tailscale</td>
                  <td className="px-4 py-2.5">Production (permanent, private network)</td>
                  <td className="px-4 py-2.5"><code className="rounded bg-muted px-1.5 py-0.5">http://&lt;machine&gt;:18789/v1</code></td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium text-foreground">Same network</td>
                  <td className="px-4 py-2.5">Both on same LAN/VPN</td>
                  <td className="px-4 py-2.5"><code className="rounded bg-muted px-1.5 py-0.5">http://&lt;local-ip&gt;:18789/v1</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            All methods use the same env vars &mdash; just change <code className="rounded bg-muted px-1.5 py-0.5">OPENCLAW_BASE_URL</code> and restart.
          </p>
        </div>

        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Roadmap:</strong> We will migrate to
            <strong className="text-foreground"> Tailscale</strong> for a permanent, secure connection.
            The Cloudflare Tunnel URL is temporary and changes on restart. Since connection
            details are env vars, the migration is just updating <code className="rounded bg-muted px-1.5 py-0.5">OPENCLAW_BASE_URL</code> &mdash; no code changes needed.
          </p>
        </div>
      </section>

      {/* Step 5 — Deploy to production */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 5 — Deploy to production (Vercel)</h2>
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
{`NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
OPENCLAW_BASE_URL=https://<your-tunnel-url>/v1
OPENCLAW_API_KEY=<your-gateway-token>
OPENCLAW_MODEL=openclaw:main`}
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

        {/* 5.4 Tunnel setup */}
        <div className="space-y-3">
          <h3 className="font-medium">4. Tunnel setup (so Vercel can reach OpenClaw)</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            OpenClaw runs on your VPS at <code className="rounded bg-muted px-1.5 py-0.5">127.0.0.1:18789</code>.
            Vercel runs in the cloud and can&apos;t reach localhost, so you need a tunnel to expose it with a public URL.
          </p>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-medium">Option</th>
                  <th className="px-4 py-2.5 text-left font-medium">Setup</th>
                  <th className="px-4 py-2.5 text-left font-medium">URL stability</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium text-foreground">ngrok</td>
                  <td className="px-4 py-2.5">Free account → <code className="rounded bg-muted px-1.5 py-0.5">ngrok http 18789</code></td>
                  <td className="px-4 py-2.5">Fixed URL on free tier (1 static domain)</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium text-foreground">Cloudflare Tunnel</td>
                  <td className="px-4 py-2.5">Custom domain → permanent URL</td>
                  <td className="px-4 py-2.5">Permanent with a domain you own</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground">
            After setting up the tunnel, update <code className="rounded bg-muted px-1.5 py-0.5">OPENCLAW_BASE_URL</code> in Vercel with the tunnel URL
            (e.g. <code className="rounded bg-muted px-1.5 py-0.5">https://your-domain.com/v1</code>).
          </p>

          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Important:</strong> Without a tunnel,
              the AI chat won&apos;t work in production. Vercel serverless functions
              cannot reach <code className="rounded bg-muted px-1.5 py-0.5">127.0.0.1</code> on
              your VPS &mdash; they need a public HTTPS URL.
            </p>
          </div>
        </div>

        {/* 5.5 Auto-deploy */}
        <div className="space-y-3">
          <h3 className="font-medium">5. How auto-deploy works</h3>
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
            The GitHub sync and the chat agent connection are completely independent.
          </p>
        </div>
      </section>

      {/* Switching between local and production */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Switching Between Local and Production</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          You can run Speedy against your local OpenClaw instance (for development) or against the production tunnel
          (ngrok/Cloudflare). The only thing that changes is <code className="rounded bg-muted px-1.5 py-0.5">OPENCLAW_BASE_URL</code>.
        </p>

        <div className="space-y-3">
          <h3 className="font-medium">Mode A — Local dev (Next.js running locally)</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            When you run <code className="rounded bg-muted px-1.5 py-0.5">pnpm dev</code> on your machine and OpenClaw
            is also on the same machine, you can point directly to localhost — no tunnel needed:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
{`# .env.local (local development)
NEXT_PUBLIC_CONVEX_URL=https://necessary-fish-66.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://necessary-fish-66.convex.site
OPENCLAW_BASE_URL=http://127.0.0.1:18789/v1
OPENCLAW_API_KEY=<your-gateway-token>
OPENCLAW_MODEL=openclaw:main`}
          </pre>
          <p className="text-sm text-muted-foreground">
            This is the fastest setup for development — zero latency, no tunnel process needed.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Mode B — Production tunnel (Vercel deploy)</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            When deployed to Vercel, the app runs in the cloud and can&apos;t reach your local machine.
            You need a public tunnel (ngrok or Cloudflare Tunnel) pointing to OpenClaw on your VPS:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
{`# Vercel Environment Variables (Settings → Environment Variables)
NEXT_PUBLIC_CONVEX_URL=https://necessary-fish-66.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://necessary-fish-66.convex.site
OPENCLAW_BASE_URL=https://<your-ngrok-url>.ngrok-free.app/v1
OPENCLAW_API_KEY=<your-gateway-token>
OPENCLAW_MODEL=openclaw:main
AUTH_SECRET=<32-char-random-string>

# Also set in Convex Dashboard (Settings → Environment Variables):
AUTH_RESEND_KEY=<your-resend-api-key>
AUTH_SECRET=<same-as-vercel>
SITE_URL=https://<your-vercel-url>.vercel.app
GITHUB_PAT=<github-personal-access-token>`}
          </pre>
        </div>

        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">How to start ngrok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run on your VPS: <code className="rounded bg-muted px-1.5 py-0.5">nohup ngrok http 18789 &amp;</code>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Get the URL from: <code className="rounded bg-muted px-1.5 py-0.5">curl http://localhost:4040/api/tunnels</code>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Then update <code className="rounded bg-muted px-1.5 py-0.5">OPENCLAW_BASE_URL</code> in Vercel and Redeploy.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">How to switch back to local auto-sync</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            If the production tunnel breaks or you want to develop locally again:
          </p>
          <ol className="ml-4 list-decimal space-y-1 text-sm text-muted-foreground">
            <li>In your <code className="rounded bg-muted px-1.5 py-0.5">.env.local</code>, change <code className="rounded bg-muted px-1.5 py-0.5">OPENCLAW_BASE_URL</code> back to <code className="rounded bg-muted px-1.5 py-0.5">http://127.0.0.1:18789/v1</code></li>
            <li>Restart <code className="rounded bg-muted px-1.5 py-0.5">pnpm dev</code></li>
            <li>Done — the webhook sync still works (it goes directly to Convex, not through OpenClaw)</li>
          </ol>
          <p className="mt-2 text-sm text-muted-foreground">
            The chat agent connection and the GitHub auto-sync are independent. Sync always goes GitHub → Convex (via webhook).
            The chat agent connection uses <code className="rounded bg-muted px-1.5 py-0.5">OPENCLAW_BASE_URL</code> only.
          </p>
        </div>
      </section>
    </div>
  )
}
