"use client"

import { useCallback, useRef, useEffect } from "react"
import { Loader2, SendHorizontal, Square, X } from "lucide-react"
import { Button } from "@/src/lib/components/ui/button"

type PendingImage = {
  file: File
  previewUrl: string
  storageUrl: string | null
  isUploading: boolean
  error: string | null
}

type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onStop: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  isSending: boolean
  isStreaming: boolean
  hasQueued: boolean
  pendingImage: PendingImage | null
  onPasteImage: (file: File) => void
  onRemoveImage: () => void
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  onKeyDown,
  isSending,
  isStreaming,
  hasQueued,
  pendingImage,
  onPasteImage,
  onRemoveImage,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) onPasteImage(file)
          return
        }
      }
    },
    [onPasteImage],
  )

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [value])

  const canSend = (value.trim() || pendingImage?.storageUrl) && !isSending

  return (
    <div className="border-t border-border p-3">
      {pendingImage && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative size-14 shrink-0 rounded-md overflow-hidden border border-border bg-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pendingImage.previewUrl}
              alt="Pasted screenshot"
              className="size-full object-cover"
            />
            {pendingImage.isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="size-4 animate-spin text-white" />
              </div>
            )}
            {pendingImage.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-destructive/50">
                <span className="text-[10px] text-white font-medium">Error</span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0"
            onClick={onRemoveImage}
          >
            <X className="size-3" />
          </Button>
        </div>
      )}
      {hasQueued && (
        <div className="mb-2 text-xs text-muted-foreground">
          Message queued — will send after current response
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          placeholder="Type a message or paste an image..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={handlePaste}
          rows={1}
          className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        {isStreaming ? (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onStop}
          >
            <Square className="size-4 fill-current" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onSend}
            disabled={!canSend}
          >
            <SendHorizontal className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
