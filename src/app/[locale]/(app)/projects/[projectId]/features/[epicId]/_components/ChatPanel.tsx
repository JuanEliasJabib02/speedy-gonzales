"use client"

import { useRef, useEffect } from "react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { ThemeToggle } from "@/src/lib/components/common/ThemeToggle"
import { useCurrentUser } from "@/src/lib/hooks/useCurrentUser"
import { useSendChat } from "../_hooks/useSendChat"

type ChatPanelProps = {
  width: number
  projectId: string
  epicId: string
}

export function ChatPanel({ width, projectId, epicId }: ChatPanelProps) {
  const { initial } = useCurrentUser()
  const {
    value,
    setValue,
    isSending,
    streamingContent,
    handleSend,
    handleKeyDown,
    messages,
    pendingImage,
    handlePasteImage,
    removePendingImage,
  } = useSendChat(projectId, epicId)

  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages or streaming updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length, streamingContent])

  return (
    <div
      className="flex shrink-0 flex-col bg-card"
      style={{ width }}
    >
      <div className="flex items-center gap-2 border-b border-border p-4">
        <h3 className="text-sm font-medium">Chat</h3>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-status-completed" />
          <span className="text-xs text-muted-foreground">connected</span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
      <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 scrollbar-thin">
        {messages.length === 0 && streamingContent === null ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-xs text-muted-foreground">No messages yet. Start the conversation.</span>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message._id}
                message={{
                  id: message._id,
                  role: message.role as "user" | "agent",
                  type: "text",
                  content: message.content,
                  commits: message.metadata?.commits,
                  timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }}
                userInitial={initial}
              />
            ))}
            {streamingContent !== null && (
              <ChatMessage
                message={{
                  id: "streaming",
                  role: "agent",
                  type: "text",
                  content: streamingContent,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }}
                userInitial={initial}
                isStreaming
              />
            )}
          </>
        )}
      </div>
      <ChatInput
        value={value}
        onChange={setValue}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        isSending={isSending}
        pendingImage={pendingImage}
        onPasteImage={handlePasteImage}
        onRemoveImage={removePendingImage}
      />
    </div>
  )
}
