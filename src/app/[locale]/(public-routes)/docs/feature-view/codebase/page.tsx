import { ArrowLeft, Clipboard, Code2, ExternalLink, FolderTree, GitBranch, GitCommit, Link2 } from "lucide-react"
import Link from "next/link"

export default function CodebaseDocsPage() {
  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/docs/feature-view"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Feature View
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Codebase</h1>
        <p className="mt-2 text-muted-foreground">
          Browse the connected GitHub repo without leaving the Feature View.
          Toggle to Code mode in the right panel to explore files, read code,
          and view commit diffs — all with the chat still accessible.
        </p>
      </div>

      {/* How to access */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How to access</h2>
        <p className="leading-relaxed text-muted-foreground">
          The right panel has a <strong>Plan / Code</strong> toggle in the
          header. Click <strong>Code</strong> to switch from the chat to the
          codebase browser. Click <strong>Plan</strong> to go back.
        </p>
      </section>

      {/* Components */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What it includes</h2>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: FolderTree,
              title: "File tree",
              desc: "A collapsible tree of the entire repo. Click a folder to expand, click a file to view its contents. File icons change by extension (tsx, ts, json, md, css, etc.).",
            },
            {
              icon: GitBranch,
              title: "Branch selector",
              desc: "Switch between branches to browse different versions of the code. The tree updates when you change branches.",
            },
            {
              icon: Code2,
              title: "File viewer",
              desc: "File content with syntax highlighting and line numbers. Binary files (images, PDFs) show a message instead of trying to render.",
            },
            {
              icon: Clipboard,
              title: "Copy button",
              desc: "One-click copy of the file contents. Shows a \"Copied\" confirmation for a couple of seconds.",
            },
            {
              icon: ExternalLink,
              title: "Open in GitHub",
              desc: "Jump to the file on GitHub in a new tab. Useful for quick edits or sharing a link with someone.",
            },
            {
              icon: Link2,
              title: "Context bridge",
              desc: "When you view a file, its path and content are automatically injected into the chat. The agent knows what you're looking at — no need to paste code.",
            },
            {
              icon: GitCommit,
              title: "Commit diff viewer",
              desc: "Click \"View diff\" on commit cards in the chat to see full file-level diffs. Useful for reviewing what the agent pushed.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <item.icon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Context bridge detail */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          The context bridge — why it matters
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          In most tools, you'd copy a file path or paste code into the chat for
          the AI to understand. In Speedy, the context bridge does this
          automatically:
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              step: "1",
              desc: "You open a file in the code viewer",
            },
            {
              step: "2",
              desc: "The file path appears as a dismissible pill above the chat input",
            },
            {
              step: "3",
              desc: "The file content is injected into the system message on your next message",
            },
            {
              step: "4",
              desc: "Charizard can reference, review, or modify the file directly",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 rounded-md bg-muted/50 px-4 py-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </span>
              <span className="text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* File search */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">File search (Cmd+P)</h2>
        <p className="leading-relaxed text-muted-foreground">
          Press{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">Cmd+P</code>{" "}
          from anywhere in the Feature View to open a fuzzy file search palette.
          Type a filename to filter, select to open it in the code viewer.
        </p>
      </section>

      {/* Architecture note */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Architecture</h2>
        <p className="leading-relaxed text-muted-foreground">
          The code viewer uses the same GitHub PAT already configured for
          auto-sync. No extra credentials needed. The file tree is fetched once
          per session, and file contents are loaded on demand to keep things
          fast.
        </p>
      </section>
    </div>
  )
}
