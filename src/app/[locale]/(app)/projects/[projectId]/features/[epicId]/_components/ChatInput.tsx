"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { SendHorizontal } from "lucide-react"
import { Input } from "@/src/lib/components/ui/input"
import { Button } from "@/src/lib/components/ui/button"

type ChatInputProps = {
  epicId: string
}

export function ChatInput({ epicId }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const sendMessage = useMutation(api.chat.sendMessage)

  const handleSend = async () => {
    const trimmed = value.trim()
    if (!trimmed || isSending) return

    setIsSending(true)
    try {
      await sendMessage({
        epicId: epicId as Id<"epics">,
        content: trimmed,
      })
      setValue("")

      // Stream from OpenClaw API
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            epicId,
            message: trimmed,
          }),
        })

        if (!res.ok) {
          console.error("Chat API error:", res.status)
        }
        // The API route saves the assistant message to Convex,
        // so it will appear reactively via useQuery
      } catch {
        console.error("Failed to call chat API")
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-2 border-t border-border p-3">
      <Input
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        disabled={isSending}
      />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={handleSend}
        disabled={!value.trim() || isSending}
      >
        <SendHorizontal className="size-4" />
      </Button>
    </div>
  )
}
