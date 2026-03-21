"use client"

import { useRef, useEffect, useMemo, useCallback } from "react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { ContextSummaryCard } from "./ContextSummaryCard"
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
    handleStop,
    handleRetry,
    handleKeyDown,
    hasQueued,
    messages,
    epic,
    tickets,
    pendingImage,
    handlePasteImage,
    removePendingImage,
  } = useSendChat(projectId, epicId)

  const ticketOptions = useMemo(
    () =>
      tickets.map((t) => ({
        slug: t.path.split("/").pop()?.replace(/\.md$/, "") ?? t.title,
        title: t.title,
      })),
    [tickets],
  )

  const MAX_TOKENS = 200_000

  const totalTokens = useMemo(
    () => messages.reduce((sum, m) => sum + (m.tokenCount ?? 0), 0),
    [messages],
  )

  const tokenRatio = MAX_TOKENS > 0 ? totalTokens / MAX_TOKENS : 0

  const formatTokens = useCallback((n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
  }, [])

  const tokenColorClass =
    tokenRatio >= 0.8
      ? "bg-red-500"
      : tokenRatio >= 0.5
        ? "bg-yellow-500"
        : "bg-green-500"

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
        <div className="ml-auto flex items-center gap-3">
          {totalTokens > 0 && (
            <div className="flex items-center gap-1.5">
              <div className={`size-2 rounded-full ${tokenColorClass}`} />
              <span className="text-xs text-muted-foreground">
                {formatTokens(totalTokens)} / {formatTokens(MAX_TOKENS)} tokens
              </span>
            </div>
          )}
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
            {messages.length > 0 && epic && (
              <ContextSummaryCard
                epicTitle={epic.title}
                epicStatus={epic.status}
                pendingTickets={tickets.filter((t) => t.status !== "completed").length}
                totalTickets={tickets.length}
              />
            )}
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
                onRetry={handleRetry}
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
        onStop={handleStop}
        onKeyDown={handleKeyDown}
        isSending={isSending}
        isStreaming={streamingContent !== null}
        hasQueued={hasQueued}
        pendingImage={pendingImage}
        onPasteImage={handlePasteImage}
        onRemoveImage={removePendingImage}
        ticketOptions={ticketOptions}
      />
    </div>
  )
}
