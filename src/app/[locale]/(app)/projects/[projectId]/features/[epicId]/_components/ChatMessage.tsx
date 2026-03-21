import { GitCommitHorizontal, ExternalLink, Zap, Copy, Check } from "lucide-react"
import { cn } from "@/src/lib/helpers/cn"
import { type ReactNode, useState, useCallback } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

type CommitData = {
  hash: string
  message: string
  url: string
  filesChanged: number
}

type ChatMessageData = {
  id: string
  role: "user" | "agent"
  type: "text" | "commit"
  content: string
  commits?: CommitData[]
  timestamp: string
}

type ChatMessageProps = {
  message: ChatMessageData
  userInitial: string
  isStreaming?: boolean
}

function CommitCard({ commit }: { commit: CommitData }) {
  return (
    <a
      href={commit.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-[85%] rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
    >
      <div className="flex items-center gap-2">
        <GitCommitHorizontal className="size-4 text-status-completed" />
        <code className="text-xs text-muted-foreground">{commit.hash}</code>
        <ExternalLink className="ml-auto size-3 text-muted-foreground" />
      </div>
      <p className="mt-1.5 text-sm">{commit.message}</p>
      <span className="mt-1 block text-xs text-muted-foreground">
        {commit.filesChanged} files changed
      </span>
    </a>
  )
}

function StreamingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1">
      <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground" />
      <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
      <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
    </div>
  )
}

const LINK_CLASS = "text-primary underline break-all"

// Matches markdown links [text](url) and plain URLs
const MESSAGE_LINK_RE =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>)\]]+)/g

function linkLabel(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname === "github.com") {
      const parts = u.pathname.split("/").filter(Boolean)
      // /owner/repo/pull/123
      if (parts[2] === "pull" && parts[3]) return `PR #${parts[3]}`
      // /owner/repo/commit/abc123
      if (parts[2] === "commit" && parts[3]) return parts[3].slice(0, 7)
      // /owner/repo/blob/...filepath
      if (parts[2] === "blob" && parts.length > 4) return parts.slice(4).join("/")
      // /owner/repo/issues/123
      if (parts[2] === "issues" && parts[3]) return `Issue #${parts[3]}`
    }
  } catch {
    // not a valid URL — fall through
  }
  return url
}

function renderLinkedContent(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  MESSAGE_LINK_RE.lastIndex = 0
  while ((match = MESSAGE_LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[1] && match[2]) {
      // markdown-style link [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {match[1]}
        </a>
      )
    } else {
      // plain URL
      const url = match[3]
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {linkLabel(url)}
        </a>
      )
    }

    lastIndex = MESSAGE_LINK_RE.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

// Matches fenced code blocks: ```lang\n...\n```
const FENCED_CODE_RE = /```(\w*)\n([\s\S]*?)```/g

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-white/10"
    >
      {copied ? (
        <>
          <Check className="size-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3" />
          Copy
        </>
      )}
    </button>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const trimmedCode = code.replace(/\n$/, "")

  return (
    <div className="relative my-2 overflow-hidden rounded-md">
      {language && (
        <div className="bg-[#1e1e1e] px-3 py-1 text-xs text-muted-foreground border-b border-white/10">
          {language}
        </div>
      )}
      <CopyButton text={trimmedCode} />
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: language ? "0 0 0.375rem 0.375rem" : "0.375rem", fontSize: "0.8125rem" }}
      >
        {trimmedCode}
      </SyntaxHighlighter>
    </div>
  )
}

function renderMessageContent(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  FENCED_CODE_RE.lastIndex = 0
  while ((match = FENCED_CODE_RE.exec(text)) !== null) {
    // Render text before the code block (with link support)
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index)
      parts.push(...renderLinkedContent(textBefore).map((node, i) =>
        typeof node === "string" ? <span key={`t-${lastIndex}-${i}`}>{node}</span> : node
      ))
    }

    parts.push(
      <CodeBlock key={`code-${match.index}`} language={match[1]} code={match[2]} />
    )

    lastIndex = FENCED_CODE_RE.lastIndex
  }

  // Render remaining text after last code block (with link support)
  if (lastIndex < text.length) {
    parts.push(...renderLinkedContent(text.slice(lastIndex)))
  }

  return parts
}

export function ChatMessage({ message, userInitial, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user"
  const hasContent = message.content.length > 0

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {isUser ? (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {userInitial}
        </div>
      ) : (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary">
          <Zap className="size-3.5 text-primary-foreground" />
        </div>
      )}
      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <span className="text-xs font-medium text-muted-foreground">
          {isUser ? "You" : "Speedy"}
        </span>

        <div
          className={cn(
            "max-w-[85%] rounded-lg p-3 text-sm whitespace-pre-wrap",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {isStreaming && !hasContent ? (
            <StreamingIndicator />
          ) : (
            <>
              {renderMessageContent(message.content)}
              {isStreaming && <span className="ml-0.5 inline-block animate-pulse">|</span>}
            </>
          )}
        </div>

        {message.commits && message.commits.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {message.commits.map((commit) => (
              <CommitCard key={commit.hash} commit={commit} />
            ))}
          </div>
        )}

        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
      </div>
    </div>
  )
}
