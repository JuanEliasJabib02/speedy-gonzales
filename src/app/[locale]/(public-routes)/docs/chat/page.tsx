import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ChatDocsPage() {
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
        <h1 className="text-3xl font-semibold tracking-tight">OpenClaw Chat</h1>
        <p className="mt-2 text-muted-foreground">
          AI-powered conversations scoped to each feature in your project.
        </p>
      </div>

      {/* Per-feature chat */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Per-feature chat</h2>
        <p className="leading-relaxed text-muted-foreground">
          Every epic (feature) in Speedy Gonzales has its own isolated chat.
          When you open a feature view, the chat panel loads the conversation
          history for that specific epic. This keeps discussions focused and
          prevents context from bleeding across features.
        </p>
      </section>

      {/* OpenClaw agent */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The Charizard agent</h2>
        <p className="leading-relaxed text-muted-foreground">
          Chat is powered by <strong>OpenClaw&apos;s Charizard agent</strong> &mdash;
          an AI agent with persistent memory and access to your repository.
          Charizard can:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Read and understand your plan files and project structure</li>
          <li>Help you create and refine tickets</li>
          <li>Suggest implementation approaches based on your codebase</li>
          <li>Modify plans and push changes from the conversation</li>
        </ul>
      </section>

      {/* How it works */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How it works</h2>
        <div className="flex flex-col gap-2">
          {[
            { step: "1", label: "Send", desc: "You type a message in the chat panel" },
            { step: "2", label: "Persist", desc: "The message is saved in Convex" },
            { step: "3", label: "Proxy", desc: "A Next.js API route forwards the request to OpenClaw" },
            { step: "4", label: "Process", desc: "Charizard processes your message with full feature context" },
            { step: "5", label: "Stream", desc: "The response streams back via SSE" },
            { step: "6", label: "Display", desc: "Messages appear in real time in the chat panel" },
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

      {/* Real-time updates */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Real-time updates</h2>
        <p className="leading-relaxed text-muted-foreground">
          Messages are stored in a Convex <code className="rounded bg-muted px-1.5 py-0.5 text-sm">chat_messages</code> table
          and loaded via reactive queries. This means:
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Messages appear instantly without polling</li>
          <li>Multiple team members can see the conversation update live</li>
          <li>Chat history persists across sessions and page reloads</li>
        </ul>
      </section>

      {/* Session persistence */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Session persistence</h2>
        <p className="leading-relaxed text-muted-foreground">
          Charizard maintains context across conversations. When you return to a
          feature&apos;s chat, the agent remembers previous discussions, decisions
          made, and the current state of your plans. This eliminates the need to
          re-explain context every time you start a new session.
        </p>
      </section>

      {/* Protocol */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Technical details</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            Uses an <strong>OpenAI-compatible API</strong> protocol &mdash;
            standard <code className="rounded bg-muted px-1.5 py-0.5 text-sm">POST /v1/chat/completions</code> with SSE streaming.
          </li>
          <li>
            Built with the <strong>Vercel AI SDK</strong> for streaming support
            and provider abstraction.
          </li>
          <li>
            A Next.js API route at <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/api/chat</code> proxies
            requests to the OpenClaw server, keeping credentials server-side.
          </li>
          <li>
            Each request includes an agent ID header (<code className="rounded bg-muted px-1.5 py-0.5 text-sm">x-openclaw-agent-id: main</code>)
            to route to the correct Charizard instance.
          </li>
        </ul>
      </section>
    </div>
  )
}
