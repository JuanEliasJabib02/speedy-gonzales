import { ExternalLink, Zap, Copy, Check, GitCommitHorizontal, RotateCcw, AlertTriangle, Code2 } from "lucide-react"
import { ActionCard, parseActions, type ParsedAction } from "./ActionCard"
import { LinkPreviewCard, extractGitHubUrls } from "./LinkPreviewCard"
import { CommitDiffPanel } from "./CommitDiffPanel"
import { cn } from "@/src/lib/helpers/cn"
import { useState, useCallback } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

function getProviderFromUrl(url: string): "github" | "bitbucket" | "unknown" {
  try {
    const hostname = new URL(url).hostname
    if (hostname === "github.com" || hostname.endsWith(".github.com")) return "github"
    if (hostname === "bitbucket.org" || hostname.endsWith(".bitbucket.org")) return "bitbucket"
    return "unknown"
  } catch {
    return "unknown"
  }
}

function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
      <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

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
  actions?: ParsedAction[]
  timestamp: string
  isInterrupted?: boolean
}

type ChatMessageProps = {
  message: ChatMessageData
  userInitial: string
  isStreaming?: boolean
  onRetry?: (messageId: string) => void
}

function parseGitHubCommitUrl(url: string): { owner: string; repo: string; sha: string } | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== "github.com") return null
    const parts = parsed.pathname.split("/").filter(Boolean)
    if (parts.length >= 4 && parts[2] === "commit") {
      return { owner: parts[0], repo: parts[1], sha: parts[3] }
    }
    return null
  } catch {
    return null
  }
}

function CommitCard({ commit, onViewDiff }: { commit: CommitData; onViewDiff?: (owner: string, repo: string, sha: string) => void }) {
  const provider = getProviderFromUrl(commit.url)
  const isGitHub = provider === "github"
  const ghCommit = isGitHub ? parseGitHubCommitUrl(commit.url) : null

  return (
    <div
      className={cn(
        "block max-w-[85%] rounded-lg border p-3 transition-colors",
        isGitHub
          ? "border-[#30363d] bg-[#24292f] text-white"
          : "border-border bg-card"
      )}
    >
      <a
        href={commit.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("block", isGitHub ? "hover:opacity-80" : "hover:opacity-80")}
      >
        <div className="flex items-center gap-2">
          {isGitHub ? (
            <GitHubLogo className="size-4 text-white" />
          ) : (
            <GitCommitHorizontal className="size-4 text-status-completed" />
          )}
          <code className={cn("text-xs", isGitHub ? "text-[#8b949e]" : "text-muted-foreground")}>
            {commit.hash}
          </code>
          {isGitHub && (
            <span className="text-[10px] font-medium text-[#8b949e]">GitHub</span>
          )}
          <ExternalLink className={cn("ml-auto size-3", isGitHub ? "text-[#8b949e]" : "text-muted-foreground")} />
        </div>
        <p className="mt-1.5 text-sm">{commit.message}</p>
        <span className={cn("mt-1 block text-xs", isGitHub ? "text-[#8b949e]" : "text-muted-foreground")}>
          {commit.filesChanged} files changed
        </span>
      </a>
      {ghCommit && onViewDiff && (
        <button
          onClick={() => onViewDiff(ghCommit.owner, ghCommit.repo, ghCommit.sha)}
          className={cn(
            "mt-2 flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors",
            isGitHub
              ? "bg-white/10 text-[#c9d1d9] hover:bg-white/15"
              : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          <Code2 className="size-3" />
          View diff
        </button>
      )}
    </div>
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

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "")
    const codeString = String(children).replace(/\n$/, "")

    if (match) {
      return <CodeBlock language={match[1]} code={codeString} />
    }

    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    )
  },
  pre({ children }) {
    return <>{children}</>
  },
  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
        {children}
      </a>
    )
  },
  p({ children }) {
    return <p className="mb-3 last:mb-0">{children}</p>
  },
  ul({ children }) {
    return <ul className="mb-3 ml-4 list-disc last:mb-0 [&>li]:mt-1">{children}</ul>
  },
  ol({ children }) {
    return <ol className="mb-3 ml-4 list-decimal last:mb-0 [&>li]:mt-1">{children}</ol>
  },
  h1({ children }) {
    return <h1 className="mb-3 mt-4 first:mt-0 text-lg font-bold">{children}</h1>
  },
  h2({ children }) {
    return <h2 className="mb-2 mt-3 first:mt-0 text-base font-bold">{children}</h2>
  },
  h3({ children }) {
    return <h3 className="mb-2 mt-3 first:mt-0 text-sm font-bold">{children}</h3>
  },
  blockquote({ children }) {
    return <blockquote className="mb-3 border-l-2 border-muted-foreground/30 pl-3 text-muted-foreground last:mb-0">{children}</blockquote>
  },
  hr() {
    return <hr className="my-3 border-muted-foreground/20" />
  },
  table({ children }) {
    return <div className="mb-3 overflow-x-auto last:mb-0"><table className="w-full text-sm">{children}</table></div>
  },
  th({ children }) {
    return <th className="border border-border px-2 py-1 text-left font-semibold">{children}</th>
  },
  td({ children }) {
    return <td className="border border-border px-2 py-1">{children}</td>
  },
}

function UserContent({ text }: { text: string }) {
  const parts = text.split(/(#[\w-]+)/g)
  return (
    <>
      {parts.map((part, i) =>
        /^#[\w-]+$/.test(part) ? (
          <span
            key={i}
            className="inline-flex items-center rounded bg-primary-foreground/20 px-1.5 py-0.5 text-xs font-medium"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export function ChatMessage({ message, userInitial, isStreaming, onRetry }: ChatMessageProps) {
  const isUser = message.role === "user"
  const hasContent = message.content.length > 0
  const [diffTarget, setDiffTarget] = useState<{ owner: string; repo: string; sha: string } | null>(null)

  return (
    <div className={cn("group flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
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
            "max-w-[85%] rounded-lg text-sm",
            isUser
              ? "bg-primary text-primary-foreground p-3 whitespace-pre-wrap"
              : "bg-secondary text-secondary-foreground p-4 leading-7"
          )}
        >
          {isStreaming && !hasContent ? (
            <StreamingIndicator />
          ) : (
            <>
              {isUser ? (
                <UserContent text={message.content} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
              )}
              {isStreaming && <span className="ml-0.5 inline-block animate-pulse">|</span>}
            </>
          )}
        </div>

        {message.isInterrupted && !isStreaming && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-500">
            <AlertTriangle className="size-3.5 shrink-0" />
            <span>Response was interrupted</span>
            {onRetry && (
              <button
                onClick={() => onRetry(message.id)}
                className="ml-auto flex items-center gap-1 rounded px-2 py-0.5 font-medium transition-colors hover:bg-amber-500/10"
              >
                <RotateCcw className="size-3" />
                Retry
              </button>
            )}
          </div>
        )}

        {message.commits && message.commits.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {message.commits.map((commit) => (
              <CommitCard
                key={commit.hash}
                commit={commit}
                onViewDiff={(owner, repo, sha) => setDiffTarget({ owner, repo, sha })}
              />
            ))}
          </div>
        )}

        {diffTarget && (
          <CommitDiffPanel
            open={true}
            onOpenChange={(open) => { if (!open) setDiffTarget(null) }}
            owner={diffTarget.owner}
            repo={diffTarget.repo}
            sha={diffTarget.sha}
          />
        )}

        {!isUser && !isStreaming && (() => {
          // Prefer structured actions from metadata; fall back to regex for old messages
          const actions = message.actions?.length ? message.actions : parseActions(message.content)
          return actions.length > 0 ? (
            <div className="flex flex-col gap-2 mt-1 max-w-[85%]">
              {actions.map((action, i) => (
                <ActionCard key={`${action.type}-${i}`} type={action.type} title={action.title} detail={action.detail} />
              ))}
            </div>
          ) : null
        })()}

        {!isUser && !isStreaming && (() => {
          const githubUrls = extractGitHubUrls(message.content)
          return githubUrls.length > 0 ? (
            <div className="flex flex-col gap-2 mt-1 max-w-[85%] w-full">
              {githubUrls.map((url) => (
                <LinkPreviewCard key={url} url={url} />
              ))}
            </div>
          ) : null
        })()}

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
          {!isUser && !isStreaming && onRetry && (
            <button
              onClick={() => onRetry(message.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
              title="Retry"
            >
              <RotateCcw className="size-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
