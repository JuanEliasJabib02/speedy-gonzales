import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AutonomousLoopDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">
          Autonomous Dev Loop
        </h1>
        <p className="mt-2 text-muted-foreground">
          A 24/7 cron-driven development cycle. Agents pick up tickets, write
          code, push commits, and move cards &mdash; autonomously.
        </p>
      </div>

      {/* Section 1 — What is the autonomous loop */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What is the autonomous loop</h2>
        <p className="leading-relaxed text-muted-foreground">
          The autonomous loop is Speedy&apos;s core differentiator. It turns your
          ticket board into a self-driving development pipeline. Instead of
          manually assigning work and waiting for updates, the loop continuously
          picks up the highest-priority ticket, dispatches a coding agent,
          verifies the result, and moves on to the next one.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
{`┌─────────────────────────────────────────────────────┐
│                  Autonomous Loop                    │
│                                                     │
│   Query tickets ──► Pick highest priority           │
│        ▲                    │                        │
│        │                    ▼                        │
│   Update status      Dispatch agent                 │
│        ▲                    │                        │
│        │                    ▼                        │
│    Verify ◄──────── Code + Push                     │
│                                                     │
└─────────────────────────────────────────────────────┘`}
        </pre>
        <p className="text-sm text-muted-foreground">
          The cycle repeats every 30 minutes by default, running as long as
          there are <code className="rounded bg-muted px-1.5 py-0.5 text-sm">todo</code> tickets
          in your project.
        </p>
      </section>

      {/* Section 2 — How it works */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How it works</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every 30 minutes, the orchestrator runs a cron job that queries Convex
          for projects with the autonomous loop enabled. For each project, it:
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              step: "1",
              label: "Query",
              desc: "Fetches all tickets with status todo from Convex, filtered to projects where autonomousLoop is enabled",
            },
            {
              step: "2",
              label: "Prioritize",
              desc: "Picks the highest-priority ticket. If multiple tickets share the same priority, the oldest one wins",
            },
            {
              step: "3",
              label: "Conflict check",
              desc: "Checks file dependencies listed in the ticket plan to avoid dispatching two agents that would edit the same files",
            },
            {
              step: "4",
              label: "Dispatch",
              desc: "Sends the ticket plan to a coding agent with full context: the checklist, related files, and project conventions",
            },
            {
              step: "5",
              label: "Execute",
              desc: "The agent writes code, pushes to a feature branch, and marks the ticket as review",
            },
            {
              step: "6",
              label: "Verify",
              desc: "A separate verification agent reviews the diff against the plan. PASS keeps the ticket in review; FAIL re-dispatches with feedback",
            },
            {
              step: "7",
              label: "Repeat",
              desc: "The loop picks the next ticket and starts again",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {" "}
                  &mdash; {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — The coding agent */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The coding agent</h2>
        <p className="leading-relaxed text-muted-foreground">
          Each dispatch creates a fresh agent session with no memory of previous
          runs. The agent receives the ticket plan and works autonomously:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          <li>
            Reads the project&apos;s{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              .claude/
            </code>{" "}
            directory for coding conventions, rules, and skills
          </li>
          <li>
            Reads every file listed in the ticket&apos;s{" "}
            <strong>Files</strong> and{" "}
            <strong>Patterns to follow</strong> sections
          </li>
          <li>Plans its approach before writing any code</li>
          <li>Implements every item in the ticket checklist</li>
          <li>Runs type checking to catch errors before committing</li>
          <li>
            Pushes to the feature branch and marks the ticket as{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              review
            </code>
          </li>
        </ol>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Fresh context every time.</strong>{" "}
            The agent starts each ticket from scratch &mdash; no accumulated
            state, no stale assumptions. This makes each dispatch predictable
            and independent.
          </p>
        </div>
      </section>

      {/* Section 4 — Verification */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Verification</h2>
        <p className="leading-relaxed text-muted-foreground">
          After the coding agent finishes, a separate verification agent reviews
          the work. This two-agent pattern ensures quality without human
          bottlenecks:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            The verifier reads the <strong>original ticket plan</strong> and the{" "}
            <strong>git diff</strong> produced by the coding agent
          </li>
          <li>
            It checks every checklist item against the actual code changes
          </li>
          <li>
            <strong>PASS</strong> &mdash; the ticket stays in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              review
            </code>{" "}
            for human review
          </li>
          <li>
            <strong>FAIL</strong> &mdash; the ticket is re-dispatched to the
            coding agent with specific feedback about what needs fixing
          </li>
        </ul>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">
              Human review is always the final gate.
            </strong>{" "}
            The verification agent catches mechanical issues (missing checklist
            items, type errors, wrong files). Architectural decisions and code
            quality are reviewed by humans in the PR.
          </p>
        </div>
      </section>

      {/* Section 5 — Configuration */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Configuration</h2>
        <p className="leading-relaxed text-muted-foreground">
          Enable the autonomous loop per project. You need an API key and a few
          project settings:
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-medium">Environment variables</h3>
            <div className="overflow-x-auto rounded-lg bg-muted p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 pr-4 font-medium">Variable</th>
                    <th className="pb-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background px-1.5 py-0.5 text-sm">
                        LOOP_API_KEY
                      </code>
                    </td>
                    <td className="py-2">
                      API key for the AI provider used by the coding agent
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Project settings</h3>
            <div className="overflow-x-auto rounded-lg bg-muted p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 pr-4 font-medium">Setting</th>
                    <th className="pb-2 pr-4 font-medium">Type</th>
                    <th className="pb-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background px-1.5 py-0.5 text-sm">
                        autonomousLoop
                      </code>
                    </td>
                    <td className="py-2 pr-4">boolean</td>
                    <td className="py-2">
                      Enable or disable the loop for this project
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background px-1.5 py-0.5 text-sm">
                        localPath
                      </code>
                    </td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2">
                      Absolute path to the local clone of the repository
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background px-1.5 py-0.5 text-sm">
                        maxConcurrentPerFeature
                      </code>
                    </td>
                    <td className="py-2 pr-4">number</td>
                    <td className="py-2">
                      Max agents working on the same feature simultaneously
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <code className="rounded bg-background px-1.5 py-0.5 text-sm">
                        maxConcurrentGlobal
                      </code>
                    </td>
                    <td className="py-2 pr-4">number</td>
                    <td className="py-2">
                      Max agents running across all features in this project
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">To enable:</strong> set{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">
              autonomousLoop: true
            </code>{" "}
            in your project settings and ensure{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">LOOP_API_KEY</code>{" "}
            is configured. The loop will start picking up tickets on the next
            cron cycle.
          </p>
        </div>
      </section>

      {/* Section 6 — Rate limit handling */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Rate limit handling</h2>
        <p className="leading-relaxed text-muted-foreground">
          AI providers enforce rate limits. The orchestrator handles this
          gracefully so the loop never crashes:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            When the primary model is rate-limited, the orchestrator
            automatically falls back to a smaller model
          </li>
          <li>
            If all available models are exhausted, the current cycle is skipped
            and the ticket stays in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              todo
            </code>{" "}
            for the next cycle
          </li>
          <li>
            Rate limit events are logged and included in notifications so you
            can track provider availability
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          No tickets are lost or stuck due to rate limits. The loop simply waits
          for the next 30-minute cycle and tries again.
        </p>
      </section>

      {/* Section 7 — Notifications */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="leading-relaxed text-muted-foreground">
          The orchestrator sends notifications at key moments so you stay
          informed without watching the board:
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              event: "Ticket completed",
              desc: "An agent finished a ticket and it passed verification",
            },
            {
              event: "Ticket blocked",
              desc: "An agent couldn't complete the ticket after multiple attempts",
            },
            {
              event: "Agent crash",
              desc: "An agent session terminated unexpectedly",
            },
            {
              event: "Epic completed",
              desc: "All tickets in an epic are done — the feature is ready for final review",
            },
          ].map((item) => (
            <div
              key={item.event}
              className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3"
            >
              <div>
                <span className="font-medium">{item.event}</span>
                <span className="text-muted-foreground">
                  {" "}
                  &mdash; {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Notifications are delivered through the configured notification
          channel for your project. You can review all activity in the project
          dashboard.
        </p>
      </section>
    </div>
  )
}
