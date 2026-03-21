import { GitCommitHorizontal, ExternalLink, Zap, Copy, Check } from "lucide-react"
import { cn } from "@/src/lib/helpers/cn"
import { useState, useCallback } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

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
                message.content
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
              )}
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
