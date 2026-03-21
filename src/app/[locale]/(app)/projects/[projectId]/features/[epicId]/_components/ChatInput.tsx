"use client"

import { SendHorizontal } from "lucide-react"
import { Input } from "@/src/lib/components/ui/input"
import { Button } from "@/src/lib/components/ui/button"

type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  isSending: boolean
}

export function ChatInput({ value, onChange, onSend, onKeyDown, isSending }: ChatInputProps) {
  return (
    <div className="flex items-center gap-2 border-t border-border p-3">
      <Input
        placeholder="Type a message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="flex-1"
        disabled={isSending}
      />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={onSend}
        disabled={!value.trim() || isSending}
      >
        <SendHorizontal className="size-4" />
      </Button>
    </div>
  )
}
