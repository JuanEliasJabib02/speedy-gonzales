import { ArrowLeft, Activity, Brain, MessageSquare, Zap, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ContextWindowDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">Context Window</h1>
        <p className="mt-2 text-muted-foreground">
          What the token counter means, how context is managed per request, and why the color changes.
        </p>
      </div>

      {/* The indicator */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The token counter</h2>
        <p className="leading-relaxed text-muted-foreground">
          In the chat header you&apos;ll see something like{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">4.2k / 200k tokens</code> with a colored dot.
          This shows the cumulative tokens used across all messages in the current session, relative to
          the model&apos;s context window limit (200k tokens for Claude Sonnet).
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              icon: Activity,
              color: "text-green-500",
              bg: "bg-green-500/10",
              label: "Green — under 50%",
              desc: "Plenty of context available. The agent sees full recent history without any degradation.",
            },
            {
              icon: Activity,
              color: "text-yellow-500",
              bg: "bg-yellow-500/10",
              label: "Yellow — 50–80%",
              desc: "Context is filling up. Still fine, but consider if you really need to paste large blobs of code.",
            },
            {
              icon: AlertTriangle,
              color: "text-red-500",
              bg: "bg-red-500/10",
              label: "Red — over 80%",
              desc: "Context is nearly full. You may start seeing degraded responses. Best to start a fresh feature session.",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3">
              <div className={`flex size-7 shrink-0 items-center justify-center rounded-md ${item.bg}`}>
                <item.icon className={`size-3.5 ${item.color}`} />
              </div>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground"> &mdash; {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two separate things */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Context window vs. Chat memory — they&apos;re different</h2>
        <p className="leading-relaxed text-muted-foreground">
          These are two separate systems. Understanding the difference is key to working well with Charizard.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <span className="font-semibold">Context window</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              What the model <strong>actively processes</strong> in a single API call.
              Has a hard limit (200k tokens). When it fills up, older messages in the
              request get dropped or truncated.
            </p>
            <p className="text-xs text-muted-foreground">
              This is what the token counter tracks.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-primary" />
              <span className="font-semibold">Chat memory</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Charizard&apos;s <strong>long-term memory</strong> stored in files on the VPS (
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/.openclaw/workspace/memory/</code>).
              This is <em>permanent</em> — it persists across sessions and is never lost.
            </p>
            <p className="text-xs text-muted-foreground">
              The token counter doesn&apos;t affect this.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          So even if the context window goes red, Charizard&apos;s memory files — your decisions,
          preferences, and project history — are still intact. What degrades is the <em>active conversation</em>,
          not long-term recall.
        </p>
      </section>

      {/* History windowing */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="size-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">History windowing — not all messages are sent</h2>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Speedy doesn&apos;t send the entire chat history to the API on every message — that would
          fill the context window instantly on long threads. Instead, each request includes:
        </p>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "System message", desc: "Project info, repo, branch, epic plan, all ticket statuses, and active file (if open). This is always included." },
            { step: "2", label: "Last 12 messages", desc: "The most recent conversation turns, each truncated to 600 characters. Older messages are dropped." },
            { step: "3", label: "Current message", desc: "What you just typed, including any images or ticket mentions." },
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
          This is intentional — it keeps each request lightweight and fast. The trade-off is that
          if you reference something from 15+ messages ago, Charizard may not have it in the active window.
          Use <strong>ticket mentions (#slug)</strong> to explicitly pull in that context instead.
        </p>
      </section>

      {/* Best practices */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Best practices</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong>Use ticket mentions:</strong> type <code className="rounded bg-muted px-1.5 py-0.5 text-sm">#slug</code> to pull a specific ticket&apos;s
            full context into the message — much more reliable than hoping it&apos;s in the history window.
          </li>
          <li>
            <strong>Don&apos;t paste walls of code:</strong> if you need Charizard to review a file, open it in
            the code view — it gets injected automatically and efficiently.
          </li>
          <li>
            <strong>New feature = fresh chat:</strong> each epic has its own isolated chat. If you&apos;re starting
            a completely new area, create a new feature instead of continuing in an old thread.
          </li>
          <li>
            <strong>Red doesn&apos;t mean broken:</strong> it&apos;s a signal, not a hard cutoff. The model still works —
            but responses may lose awareness of things earlier in the conversation.
          </li>
        </ul>
      </section>

      {/* Technical */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How the counter is calculated</h2>
        <p className="leading-relaxed text-muted-foreground">
          Token counts come from the <code className="rounded bg-muted px-1.5 py-0.5 text-sm">usage.total_tokens</code> field in
          the API response. Each agent message stores this in Convex. The counter sums all stored token counts
          across the current epic&apos;s messages. If a message doesn&apos;t have token data (e.g., older messages before
          this feature shipped), it falls back to an estimate based on character count.
        </p>
      </section>
    </div>
  )
}
