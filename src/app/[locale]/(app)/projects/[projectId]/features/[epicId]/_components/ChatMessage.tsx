import { GitCommitHorizontal, ExternalLink, Zap } from "lucide-react"
import { cn } from "@/src/lib/helpers/cn"

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
              {message.content}
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
