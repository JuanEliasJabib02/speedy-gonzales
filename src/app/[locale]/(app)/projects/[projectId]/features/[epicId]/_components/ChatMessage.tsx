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
  commit?: CommitData
  timestamp: string
}

type ChatMessageProps = {
  message: ChatMessageData
  userInitial: string
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

export function ChatMessage({ message, userInitial }: ChatMessageProps) {
  const isUser = message.role === "user"

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

        {message.type === "commit" && message.commit ? (
          <CommitCard commit={message.commit} />
        ) : (
          <div
            className={cn(
              "max-w-[85%] rounded-lg p-3 text-sm",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {message.content}
          </div>
        )}

        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
      </div>
    </div>
  )
}
