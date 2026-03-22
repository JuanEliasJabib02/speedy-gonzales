import { ArrowLeft, Brain, GitBranch, Zap } from "lucide-react"
import Link from "next/link"

export default function AIWorkflowPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">AI Development Workflow</h1>
        <p className="mt-2 text-muted-foreground">
          How to leverage Charizard (your OpenClaw agent) via Telegram for faster, collaborative development.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What is Charizard?</h2>
        <p className="leading-relaxed text-muted-foreground">
          Charizard is an <strong>AI agent with persistent memory</strong> connected to your GitHub repository. 
          Unlike generic ChatGPT, Charizard:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Remembers context across conversations (stored in OpenClaw memory)</li>
          <li>Can read and write to your codebase directly</li>
          <li>Understands your project structure, plans, and tickets</li>
          <li>Can run git commands, create commits, and push changes</li>
          <li>Scopes conversations per-feature for focused discussions</li>
        </ul>
      </section>

      {/* Workflow */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The Development Cycle</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-medium">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">1</span>
              Plan your feature
            </h3>
            <p className="ml-7 text-sm text-muted-foreground">
              Create a feature in Speedy Gonzales and write a <code className="rounded bg-muted px-1.5 py-0.5">PLAN.md</code>.
              This file describes what you want to build, the acceptance criteria, and any architecture notes.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-medium">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">2</span>
              Talk to Charizard via Telegram
            </h3>
            <p className="ml-7 text-sm text-muted-foreground">
              Message Charizard on Telegram. Ask questions about the plan,
              discuss implementation, or request code generation. Charizard reads your PLAN.md automatically.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-medium">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">3</span>
              Iterate & Code
            </h3>
            <p className="ml-7 text-sm text-muted-foreground">
              Charizard can delegate coding tasks to Perro salchicha (Claude Code agent). Changes are committed 
              automatically with context about what was built.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-medium">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">4</span>
              Review & Validate
            </h3>
            <p className="ml-7 text-sm text-muted-foreground">
              Tickets move from <strong>in-progress → review</strong> once Perro salchicha finishes. 
              You review the code and changes, then move to <strong>completed</strong> when satisfied.
            </p>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Best Practices</h2>
        <div className="space-y-3">
          <div>
            <h3 className="mb-1 font-medium text-foreground">✅ Write Clear Plans</h3>
            <p className="text-sm text-muted-foreground">
              The better your PLAN.md, the better Charizard&apos;s work. Include acceptance criteria, 
              architecture decisions, and edge cases to consider.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-foreground">✅ Break Down Features into Tickets</h3>
            <p className="text-sm text-muted-foreground">
              Don&apos;t ask Charizard to build a 5,000-line feature at once. Create small, focused tickets 
              (500-1000 lines) so the agent can iterate and test incrementally.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-foreground">✅ Ask for Context Summary</h3>
            <p className="text-sm text-muted-foreground">
              When starting work on a ticket, ask Charizard: &quot;Summarize what we&apos;re building here and 
              the key decisions.&quot; This ensures alignment before coding starts.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-foreground">✅ Review Commits Before Merging</h3>
            <p className="text-sm text-muted-foreground">
              Always review the git diff of agent changes. Charizard is powerful but not perfect—catch bugs 
              before they hit production.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-foreground">✅ Use Telegram for Debugging</h3>
            <p className="text-sm text-muted-foreground">
              If something breaks, paste the error to Charizard via Telegram. It has access to your logs and can help
              diagnose and fix issues faster than you working alone.
            </p>
          </div>
        </div>
      </section>

      {/* Useful Patterns */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Useful Patterns</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="mb-1 font-medium text-foreground">Create a ticket</p>
            <p>
              &quot;Create a ticket for [feature]. Title: [title], Priority: [high/medium/low], Description: [details]&quot;
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-foreground">Ask for code review</p>
            <p>
              &quot;Review the changes in [file] for bugs, performance, or style issues. Suggest improvements.&quot;
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-foreground">Delegate coding</p>
            <p>
              &quot;Implement [feature description]. Use [tech stack]. Follow the pattern in [example file].&quot;
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-foreground">Debug together</p>
            <p>
              &quot;I&apos;m getting [error]. Here&apos;s the stack trace: [paste]. What&apos;s the root cause?&quot;
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-foreground">Update the plan</p>
            <p>
              &quot;The PLAN.md for this feature needs to be updated. New context: [details]. Please update it.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Workflow State */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Ticket States</h2>
        <div className="space-y-2 text-sm">
          <div className="flex gap-3">
            <div className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-medium text-yellow-700">todo</div>
            <p className="text-muted-foreground">Not started. Use this for planning backlog items.</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-700">in-progress</div>
            <p className="text-muted-foreground">Perro salchicha is actively working on this. Don&apos;t manually change this.</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-700">review</div>
            <p className="text-muted-foreground">
              Work is done. Perro salchicha pushed changes. <strong>You review the code here.</strong>
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-700">completed</div>
            <p className="text-muted-foreground">You verified the work is correct and ready for production.</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-700">blocked</div>
            <p className="text-muted-foreground">Waiting on something external (design, API response, etc).</p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Pro Tips 🔥</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong>Charizard remembers everything:</strong> You can reference past decisions and context from 
            earlier conversations. Use it.
          </li>
          <li>
            <strong>Keep discussions per-feature:</strong> Scope each conversation to a single feature. This keeps
            context focused and prevents confusion.
          </li>
          <li>
            <strong>Use GitHub links:</strong> Paste links to commits, PRs, or code snippets. Charizard can 
            fetch and analyze them.
          </li>
          <li>
            <strong>Leverage memory:</strong> Charizard stores important decisions, patterns, and lessons learned. 
            Ask it to remind you of past context.
          </li>
          <li>
            <strong>Test locally first:</strong> Before asking Charizard to code, test your changes locally to 
            catch issues early.
          </li>
        </ul>
      </section>

      {/* When to use what */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">When to Use Charizard vs. Code Yourself</h2>
        <div className="space-y-3">
          <div>
            <h3 className="mb-1 font-medium text-green-700">✅ Use Charizard for:</h3>
            <ul className="ml-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Boilerplate code (components, hooks, API routes)</li>
              <li>Refactoring large sections</li>
              <li>Debugging complex issues with your logs</li>
              <li>Documentation and comments</li>
              <li>Code reviews and style suggestions</li>
              <li>Testing (unit tests, integration tests)</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-blue-700">🤔 Work together on:</h3>
            <ul className="ml-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Architectural decisions</li>
              <li>Edge case handling</li>
              <li>Performance optimization</li>
              <li>Complex business logic</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-orange-700">⚠️ Code yourself for:</h3>
            <ul className="ml-4 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>High-risk features (auth, payments, security)</li>
              <li>Core domain logic unique to your business</li>
              <li>Quick one-liners or urgent fixes</li>
              <li>UI tweaks that require visual judgment</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
