import { ArrowLeft, Brain, Code2, GitBranch, MessageSquare, Rocket, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function AgentWorkflowPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">AI-Assisted Development</h1>
        <p className="mt-2 text-muted-foreground">
          How Speedy Gonzales changes the way you build software — with an agent that actually knows your codebase.
        </p>
      </div>

      {/* The shift */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">The fundamental shift</h2>
        <p className="leading-relaxed text-muted-foreground">
          Traditional IDEs are editors. Speedy is a <strong className="text-foreground">development operating system</strong> — it connects your plans, your code, your tickets, and your AI agent into a single loop.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Instead of switching between Notion (plans), GitHub (code), Linear (tickets), and ChatGPT (AI), everything lives in one place with shared context. The agent sees your tickets, your plan, your conversation history — and acts on them.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: MessageSquare,
              title: "Chat as command center",
              desc: "Describe what you want in natural language. The agent reads your plan, creates tickets, writes code, and pushes — all from the chat.",
            },
            {
              icon: Brain,
              title: "Persistent memory",
              desc: "Charizard remembers your project across sessions. You don't re-explain context every time — it's always up to date.",
            },
            {
              icon: GitBranch,
              title: "Git as source of truth",
              desc: "Plans live in your repo as markdown. Every plan change is a commit. No drift between what's planned and what's tracked.",
            },
            {
              icon: Zap,
              title: "Real-time sync",
              desc: "Push to GitHub → Speedy updates instantly via webhook. Your kanban board reflects reality, not a stale snapshot.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <item.icon className="size-4 text-primary" />
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The loop */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">The development loop</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every feature goes through the same loop — but with an agent accelerating each step:
        </p>
        <ol className="space-y-4">
          {[
            {
              step: "1",
              title: "Write a plan",
              desc: "Create a PLAN.md in plans/features/your-feature/. Describe the goal, architecture decisions, and what needs to be built. This is your feature brief.",
              tip: "Keep it short — 100-200 lines is ideal. The agent reads it every time, so concise > comprehensive.",
            },
            {
              step: "2",
              title: "Break it into tickets",
              desc: "Each sub-task is a .md file in the feature folder. Status field controls the kanban. The agent creates these from your plan or your requests in chat.",
              tip: "One ticket per logical unit of work. The agent moves tickets to 'review' when done, you move them to 'completed'.",
            },
            {
              step: "3",
              title: "Chat with the agent",
              desc: "Open the feature chat. The agent has your full context: project, epic, all tickets, conversation history. Ask it to build, review, explain, or refactor.",
              tip: "Be direct. 'Build the RoadmapModal component based on the ticket spec' works better than 'can you maybe help with the modal?'",
            },
            {
              step: "4",
              title: "Agent executes and pushes",
              desc: "Charizard (via Perro salchicha subagent) writes code, commits, and pushes to your repo. The push triggers webhook sync which updates ticket status in Convex.",
              tip: "Always review before merging to main. The agent targets feature branches by default.",
            },
            {
              step: "5",
              title: "Review and iterate",
              desc: "Tickets in 'review' status = ready for you to check. Once verified, move to 'completed'. The agent sees this and knows what's next.",
              tip: "The kanban board is your shared to-do list with the agent. Keep it clean.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {item.step}
              </div>
              <div className="space-y-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                <p className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                  <strong>Tip:</strong> {item.tip}
                </p>
              </div>
            </div>
          ))}
        </ol>
      </section>

      {/* Agents */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">The agents</h2>
        <p className="leading-relaxed text-muted-foreground">
          Speedy uses two AI agents with different roles:
        </p>
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <span className="font-medium">Charizard — Orchestrator</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The main agent you talk to in chat. Reads plans, manages tickets, delegates coding tasks to Perro salchicha,
              and monitors progress. Has persistent memory and full project context. Lives in OpenClaw on the VPS.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xl">🌭</span>
              <span className="font-medium">Perro salchicha — Developer</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Claude Code subagent spawned by Charizard for coding tasks. Works autonomously in the repo — reads files,
              writes code, runs tests, commits, and pushes. Reports back to Charizard when done. Moves tickets to
              <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">review</code> status when finished.
            </p>
          </div>
        </div>
      </section>

      {/* What to ask */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What to ask the agent</h2>
        <p className="leading-relaxed text-muted-foreground">
          The agent works best with specific, actionable requests. Here are examples:
        </p>
        <div className="space-y-3">
          {[
            {
              category: "Planning",
              examples: [
                "Create tickets for all the items in the PLAN.md spec",
                "Break this feature into 5 tickets ordered by dependency",
                "Update the plan to add a caching layer",
              ],
            },
            {
              category: "Coding",
              examples: [
                "Build the RoadmapModal component based on the ticket spec",
                "Add error handling to the /api/chat route",
                "Refactor the ChatMessage component to use react-markdown",
              ],
            },
            {
              category: "Review",
              examples: [
                "What's the current status of all tickets?",
                "Explain how the webhook sync works",
                "What's left to do in this feature?",
              ],
            },
            {
              category: "Debugging",
              examples: [
                "The auth fails in production but works locally — what's different?",
                "The /api/chat route returns 502 — check the logs",
                "Why is the streaming broken in the chat component?",
              ],
            },
          ].map((section) => (
            <div key={section.category} className="rounded-lg border border-border bg-card p-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">{section.category}</p>
              <ul className="space-y-1">
                {section.examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-primary">→</span>
                    <span className="text-muted-foreground">&ldquo;{ex}&rdquo;</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Best practices */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Best practices</h2>
        <ul className="space-y-3">
          {[
            {
              title: "One feature at a time",
              desc: "Keep each epic focused. Don't cram 10 unrelated things into one feature. The agent's context window is finite — smaller scope = better output.",
            },
            {
              title: "Tickets as contracts",
              desc: "Write tickets with clear acceptance criteria. The agent uses the ticket spec to know when it's done. Vague tickets produce vague code.",
            },
            {
              title: "Review before completing",
              desc: "The agent moves tickets to 'review' — you move them to 'completed'. This keeps a human in the loop and prevents blind auto-approval of bad code.",
            },
            {
              title: "Use the plan as context",
              desc: "When asking the agent to build something complex, point it to the plan: 'Build this per the PLAN.md spec in plans/features/chat/'. The plan is the source of truth.",
            },
            {
              title: "Keep chat history clean",
              desc: "Start new conversations for new topics. Long, wandering chat history degrades agent performance. Each feature has isolated history for this reason.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <div className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </ul>
      </section>

      {/* Why this matters */}
      <section className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-2">
          <Rocket className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Why this changes development</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          The bottleneck in software development isn&apos;t ideas — it&apos;s execution. Writing code, managing tasks, maintaining context across sessions, coordinating work. Speedy collapses that gap.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          With an agent that has full context and can execute autonomously, a solo developer can move at team speed. You become the architect and reviewer; the agent becomes your developer.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          The key insight: <strong className="text-foreground">the agent is only as good as the context it has</strong>. Well-written plans, clear tickets, and good conversation = dramatically better output. Garbage in, garbage out — but with the right setup, this is a genuine force multiplier.
        </p>
      </section>
    </div>
  )
}
