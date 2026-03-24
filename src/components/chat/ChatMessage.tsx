import { User, Bot } from "lucide-react"
import { MarkdownContent } from "@/src/lib/components/common/MarkdownContent"
import { cn } from "@/src/lib/helpers/cn"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

type ChatMessageProps = {
  message: Message
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn(
      "flex gap-3 p-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-3",
        isUser
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      )}>
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="text-sm">
            <MarkdownContent
              content={message.content}
              className="prose prose-sm prose-invert max-w-none"
            />
            {isStreaming && (
              <span className="inline-block w-2 h-5 bg-current animate-pulse ml-1" />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}