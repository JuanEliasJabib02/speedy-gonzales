"use client"

import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { ThemeToggle } from "@/src/lib/components/common/ThemeToggle"
import { useCurrentUser } from "@/src/lib/hooks/useCurrentUser"
import type { ChatMessage as ChatMessageType } from "../_constants/mock-data"

type ChatPanelProps = {
  width: number
  messages: ChatMessageType[]
}

export function ChatPanel({ width, messages }: ChatPanelProps) {
  const { initial } = useCurrentUser()

  return (
    <div
      className="flex shrink-0 flex-col bg-card"
      style={{ width }}
    >
      <div className="flex items-center gap-2 border-b border-border p-4">
        <h3 className="text-sm font-medium">Chat</h3>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-status-todo" />
          <span className="text-xs text-muted-foreground">coming soon</span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 scrollbar-thin">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} userInitial={initial} />
        ))}
      </div>
      <ChatInput />
    </div>
  )
}
