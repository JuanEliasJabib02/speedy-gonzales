import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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
          From zero to a working Speedy Gonzales project. Follow these steps in
          order and you&apos;ll have auto-sync running in under 10 minutes.
        </p>
      </div>

      {/* Prerequisites */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Prerequisites</h2>
        <p className="text-muted-foreground">
          Make sure you have these installed and ready before starting:
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Tool</th>
                <th className="px-4 py-2 text-left font-medium">Required</th>
                <th className="px-4 py-2 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">Node.js 18+</td>
                <td className="px-4 py-2">Yes</td>
                <td className="px-4 py-2">LTS recommended</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">pnpm</td>
                <td className="px-4 py-2">Yes</td>
                <td className="px-4 py-2">
                  Install with <InlineCode>npm install -g pnpm</InlineCode>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">Convex account</td>
                <td className="px-4 py-2">Yes</td>
                <td className="px-4 py-2">Free tier at convex.dev</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground">GitHub account</td>
                <td className="px-4 py-2">Yes</td>
                <td className="px-4 py-2">
                  With a Personal Access Token (PAT) that has <InlineCode>repo</InlineCode> scope
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-foreground">OpenClaw</td>
                <td className="px-4 py-2">Optional</td>
                <td className="px-4 py-2">Only needed for the autonomous dev loop</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Step 1 — Clone & install */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 1 &mdash; Clone and install</h2>
        <p className="text-muted-foreground">
          Fork or clone the Speedy Gonzales repo and install dependencies:
        </p>
        <CodeBlock>{`git clone https://github.com/your-org/speedy-gonzales.git
cd speedy-gonzales
pnpm install`}</CodeBlock>
      </section>

      {/* Step 2 — Configure Convex */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 2 &mdash; Configure Convex</h2>
        <p className="text-muted-foreground">
          Initialize Convex and start the dev server. This creates your backend deployment:
        </p>
        <CodeBlock>{`npx convex dev`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          On first run, Convex will prompt you to log in and create a project. Once done,
          it generates a <InlineCode>.env.local</InlineCode> file with your deployment URL.
        </p>
        <p className="text-sm text-muted-foreground">
          Set the required environment variables in Convex:
        </p>
        <CodeBlock>{`npx convex env set GITHUB_PAT "ghp_your_token_here"
npx convex env set RESEND_API_KEY "re_your_key_here"
npx convex env set AUTH_SECRET "$(openssl rand -hex 32)"
npx convex env set SITE_URL "http://localhost:3000"`}</CodeBlock>
      </section>

      {/* Step 3 — Start the app */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 3 &mdash; Start the app</h2>
        <p className="text-muted-foreground">
          In a separate terminal (keep <InlineCode>npx convex dev</InlineCode> running), start Next.js:
        </p>
        <CodeBlock>{`pnpm dev`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          Open <InlineCode>http://localhost:3000</InlineCode> and sign in with your email.
          You&apos;ll receive a magic link from Resend.
        </p>
      </section>

      {/* Step 4 — Create your first project */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 4 &mdash; Create your first project</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Dashboard", desc: "Click \"New project\" on the dashboard" },
            { step: "2", label: "Fill in", desc: "Enter a project name, description, and your GitHub repo URL" },
            { step: "3", label: "Create", desc: "Click Create — Speedy runs the first sync automatically" },
          ].map((item) => (
            <StepCard key={item.step} {...item} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          If your repo already has a <InlineCode>plans/features/</InlineCode> directory, your epics
          and tickets will appear on the kanban board after the first sync completes.
        </p>
      </section>

      {/* Step 5 — Create plans directory */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 5 &mdash; Create your plans directory</h2>
        <p className="text-muted-foreground">
          If your repo doesn&apos;t have plans yet, create the directory structure:
        </p>
        <CodeBlock>{`mkdir -p plans/features`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          See the{" "}
          <Link href="/docs/plans" className="text-primary underline-offset-4 hover:underline">
            Plan Structure
          </Link>{" "}
          page for the full format reference.
        </p>
      </section>

      {/* Step 6 — Add your first epic + ticket */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 6 &mdash; Add your first epic and ticket</h2>
        <p className="text-muted-foreground">
          Create an epic directory with a <InlineCode>_context.md</InlineCode> and a ticket file:
        </p>
        <CodeBlock>{`mkdir plans/features/onboarding`}</CodeBlock>
        <p className="text-sm font-medium">
          <InlineCode>plans/features/onboarding/_context.md</InlineCode>
        </p>
        <CodeBlock>{`# Onboarding

**Status:** in-progress
**Priority:** high

## Overview

User onboarding flow — welcome screen, project creation wizard,
and first sync walkthrough.

## Still needs

- [ ] Welcome screen design
- [ ] Project creation wizard`}</CodeBlock>
        <p className="text-sm font-medium">
          <InlineCode>plans/features/onboarding/welcome-screen.md</InlineCode>
        </p>
        <CodeBlock>{`# Welcome Screen

**Status:** todo
**Priority:** medium

## What it does

A landing screen for new users after their first login.
Shows a quick overview of Speedy and a button to create
their first project.

## Checklist

- [ ] Design the welcome layout
- [ ] Add "Create project" CTA button
- [ ] Skip if user already has a project`}</CodeBlock>
        <p className="text-sm text-muted-foreground">
          Commit and push these files. On the next sync, the epic and ticket will appear in Speedy.
        </p>
      </section>

      {/* Step 7 — Configure webhook */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 7 &mdash; Configure the GitHub webhook</h2>
        <p className="leading-relaxed text-muted-foreground">
          The webhook tells Speedy every time you push changes to your plans.
          Without it, you&apos;d have to click &quot;Sync now&quot; manually.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Open settings", desc: "Go to your GitHub repo \u2192 Settings \u2192 Webhooks \u2192 Add webhook" },
            { step: "2", label: "Payload URL", desc: "Enter your Convex HTTP Actions URL + /github-webhook" },
            { step: "3", label: "Content type", desc: "Change to application/json" },
            { step: "4", label: "Secret", desc: "Enter your webhook secret (set GITHUB_WEBHOOK_SECRET in Convex)" },
            { step: "5", label: "Events", desc: "Select \"Just the push event\"" },
            { step: "6", label: "Save", desc: "Click \"Add webhook\" \u2014 GitHub sends a ping to verify" },
          ].map((item) => (
            <StepCard key={item.step} {...item} />
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">How to find your Payload URL</h3>
          <p className="text-sm text-muted-foreground">
            Go to <strong className="text-foreground">dashboard.convex.dev</strong> &rarr; your
            project &rarr; <strong className="text-foreground">Settings</strong> &rarr; look for
            <strong className="text-foreground"> HTTP Actions URL</strong>. It looks like:
          </p>
          <CodeBlock>{`https://your-deployment-name.convex.site/github-webhook`}</CodeBlock>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
            <p className="text-sm font-semibold text-destructive">Wrong (breaks on cloud)</p>
            <CodeBlock>{`https://localhost:3000/github-webhook
https://abc123.ngrok-free.app/github-webhook`}</CodeBlock>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-3">Correct (always works)</p>
            <CodeBlock>{`https://your-deployment.convex.site/github-webhook`}</CodeBlock>
          </div>
          <p className="text-sm text-muted-foreground">
            The webhook goes directly to Convex &mdash; it doesn&apos;t matter if Speedy
            runs locally or on Vercel. Convex is always in the cloud.
          </p>
        </div>
      </section>

      {/* Step 8 — Test sync */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 8 &mdash; Test the sync</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Edit", desc: "Change any file inside plans/features/ in your repo" },
            { step: "2", label: "Push", desc: "Commit and push to GitHub" },
            { step: "3", label: "Watch", desc: "Open your project in Speedy \u2014 the kanban should update within seconds" },
          ].map((item) => (
            <StepCard key={item.step} {...item} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          The sync timer next to the &quot;Sync now&quot; button shows when the last sync happened.
          If it updates after your push, the webhook is working.
        </p>
      </section>

      {/* Step 9 — Optional autonomous loop */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Step 9 &mdash; Set up the autonomous loop (optional)</h2>
        <p className="leading-relaxed text-muted-foreground">
          The autonomous dev loop lets AI agents pick up tickets, write code, push commits,
          and move cards &mdash; all without manual intervention. This requires OpenClaw.
        </p>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Get API key", desc: "Sign up for OpenClaw and get your LOOP_API_KEY" },
            { step: "2", label: "Set env var", desc: "Run: npx convex env set LOOP_API_KEY \"your_key_here\"" },
            { step: "3", label: "Enable", desc: "In your project settings, toggle \"Autonomous Loop\" on" },
          ].map((item) => (
            <StepCard key={item.step} {...item} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Once enabled, the loop runs on a cron schedule. It picks the highest-priority
          <InlineCode>todo</InlineCode> ticket, dispatches an agent, and monitors progress.
          See the{" "}
          <Link href="/docs/autonomous-loop" className="text-primary underline-offset-4 hover:underline">
            Autonomous Dev Loop
          </Link>{" "}
          docs for details.
        </p>
      </section>

      {/* Environment variables reference */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Environment variables reference</h2>
        <p className="text-muted-foreground">
          All the environment variables Speedy Gonzales uses, where they go, and what they do:
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Variable</th>
                <th className="px-4 py-2 text-left font-medium">Where</th>
                <th className="px-4 py-2 text-left font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground"><InlineCode>NEXT_PUBLIC_CONVEX_URL</InlineCode></td>
                <td className="px-4 py-2">.env.local / Vercel</td>
                <td className="px-4 py-2">Convex deployment URL for the frontend client</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground"><InlineCode>CONVEX_DEPLOYMENT</InlineCode></td>
                <td className="px-4 py-2">.env.local</td>
                <td className="px-4 py-2">Convex deployment name (auto-generated by <InlineCode>npx convex dev</InlineCode>)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground"><InlineCode>GITHUB_PAT</InlineCode></td>
                <td className="px-4 py-2">Convex</td>
                <td className="px-4 py-2">GitHub Personal Access Token with <InlineCode>repo</InlineCode> scope &mdash; used to read plan files</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground"><InlineCode>GITHUB_WEBHOOK_SECRET</InlineCode></td>
                <td className="px-4 py-2">Convex</td>
                <td className="px-4 py-2">Secret for verifying webhook signatures from GitHub</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground"><InlineCode>RESEND_API_KEY</InlineCode></td>
                <td className="px-4 py-2">Convex</td>
                <td className="px-4 py-2">Resend API key for sending magic link emails</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground"><InlineCode>AUTH_SECRET</InlineCode></td>
                <td className="px-4 py-2">Convex</td>
                <td className="px-4 py-2">Random secret for signing auth tokens &mdash; generate with <InlineCode>openssl rand -hex 32</InlineCode></td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-2 font-medium text-foreground"><InlineCode>SITE_URL</InlineCode></td>
                <td className="px-4 py-2">Convex</td>
                <td className="px-4 py-2">Public URL of your app (for magic link redirects)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-foreground"><InlineCode>LOOP_API_KEY</InlineCode></td>
                <td className="px-4 py-2">Convex</td>
                <td className="px-4 py-2">OpenClaw API key for the autonomous dev loop (optional)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Troubleshooting</h2>

        <div className="space-y-2">
          <h3 className="font-medium">Webhook not firing</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Go to your GitHub repo &rarr; Settings &rarr; Webhooks &rarr; click your webhook &rarr;
            scroll to <strong className="text-foreground">Recent Deliveries</strong>.
            You should see a delivery for each push. If the status is red,
            check that the Payload URL ends in <InlineCode>.convex.site/github-webhook</InlineCode> and
            your Convex deployment is running.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Sync runs but data doesn&apos;t update</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Make sure your changes are inside <InlineCode>plans/features/</InlineCode>.
            The sync engine ignores files outside this path. Also verify that{" "}
            <InlineCode>GITHUB_PAT</InlineCode> is set in Convex with a token
            that has <InlineCode>repo</InlineCode> scope.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Content type error</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The webhook must send <InlineCode>application/json</InlineCode>.
            If you left it as <InlineCode>application/x-www-form-urlencoded</InlineCode>,
            the handler can&apos;t parse the payload. Edit the webhook in GitHub and change the content type.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Auth / magic link not working</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Check that <InlineCode>RESEND_API_KEY</InlineCode>, <InlineCode>AUTH_SECRET</InlineCode>,
            and <InlineCode>SITE_URL</InlineCode> are all set in Convex. The <InlineCode>SITE_URL</InlineCode> must
            match where your app is running (<InlineCode>http://localhost:3000</InlineCode> locally,
            or your Vercel URL in production).
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">&quot;Sync now&quot; shows error state</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Open the Convex dashboard and check the logs for the <InlineCode>syncRepoInternal</InlineCode> action.
            Common causes: expired PAT, repo URL typo, or the <InlineCode>plans/features/</InlineCode> directory
            doesn&apos;t exist in the repo yet.
          </p>
        </div>
      </section>
    </div>
  )
}
