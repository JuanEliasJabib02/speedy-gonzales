"use client"

import { useRef, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { ThemeToggle } from "@/src/lib/components/common/ThemeToggle"
import { useCurrentUser } from "@/src/lib/hooks/useCurrentUser"

type ChatPanelProps = {
  width: number
  epicId: string
}

export function ChatPanel({ width, epicId }: ChatPanelProps) {
  const { initial } = useCurrentUser()
  const messages = useQuery(api.chat.getMessages, { epicId: epicId as Id<"epics"> })
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages?.length])

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
        {messages === undefined ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-xs text-muted-foreground">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-xs text-muted-foreground">No messages yet. Start the conversation.</span>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message._id}
              message={{
                id: message._id,
                role: message.role as "user" | "agent",
                type: "text",
                content: message.content,
                timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }}
              userInitial={initial}
            />
          ))
        )}
      </div>
      <ChatInput epicId={epicId} />
    </div>
  )
}
