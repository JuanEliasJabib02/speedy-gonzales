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
          Connect your GitHub repo to Speedy Gonzales in 3 steps.
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
    </div>
  )
}
