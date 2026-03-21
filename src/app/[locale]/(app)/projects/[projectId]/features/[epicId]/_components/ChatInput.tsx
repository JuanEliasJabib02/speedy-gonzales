"use client"

import { useCallback, useRef, useEffect, useState, useMemo } from "react"
import { Loader2, SendHorizontal, Square, X, Hash, Slash } from "lucide-react"
import { Button } from "@/src/lib/components/ui/button"

type PendingImage = {
  file: File
  previewUrl: string
  storageUrl: string | null
  isUploading: boolean
  error: string | null
}

type TicketOption = {
  slug: string
  title: string
}

const MAX_IMAGES = 4

const SLASH_COMMANDS = [
  { command: "/create-ticket", description: "Create a new ticket for this feature", template: "Create a new ticket for the current feature:\nTitle: \nPriority: medium\nDescription: " },
  { command: "/sync", description: "Trigger a GitHub sync for this project", template: "Please sync the current project from GitHub now." },
  { command: "/tickets", description: "List all tickets for this feature", template: "List all tickets for the current feature with their status and priority." },
  { command: "/update-status", description: "Move a ticket to a new status", template: "Update the status of ticket #" },
] as const

type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onStop: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  isSending: boolean
  isStreaming: boolean
  hasQueued: boolean
  pendingImages: PendingImage[]
  onPasteImage: (file: File) => void
  onRemoveImage: (index: number) => void
  ticketOptions: TicketOption[]
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
  pendingImages,
  onPasteImage,
  onRemoveImage,
  ticketOptions,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionIndex, setMentionIndex] = useState(0)
  const [slashQuery, setSlashQuery] = useState<string | null>(null)
  const [slashIndex, setSlashIndex] = useState(0)

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (pendingImages.length >= MAX_IMAGES) return

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
    [onPasteImage, pendingImages.length],
  )

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [value])

  // Detect # mention trigger
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      onChange(newValue)

      const cursorPos = e.target.selectionStart
      const textBefore = newValue.slice(0, cursorPos)
      const hashMatch = textBefore.match(/#([\w-]*)$/)

      if (hashMatch) {
        setMentionQuery(hashMatch[1])
        setMentionIndex(0)
        setSlashQuery(null)
      } else {
        setMentionQuery(null)
      }

      // Detect / at the start of input
      const slashMatch = newValue.match(/^\/(\S*)$/)
      if (slashMatch) {
        setSlashQuery(slashMatch[1])
        setSlashIndex(0)
      } else {
        setSlashQuery(null)
      }
    },
    [onChange],
  )

  const filteredTickets = useMemo(() => {
    if (mentionQuery === null) return []
    const q = mentionQuery.toLowerCase()
    return ticketOptions.filter(
      (t) => t.slug.toLowerCase().includes(q) || t.title.toLowerCase().includes(q),
    ).slice(0, 8)
  }, [mentionQuery, ticketOptions])

  const filteredSlashCommands = useMemo(() => {
    if (slashQuery === null) return []
    const q = slashQuery.toLowerCase()
    return SLASH_COMMANDS.filter((cmd) => cmd.command.slice(1).includes(q))
  }, [slashQuery])

  const selectSlashCommand = useCallback(
    (cmd: typeof SLASH_COMMANDS[number]) => {
      onChange(cmd.template)
      setSlashQuery(null)
      requestAnimationFrame(() => {
        textareaRef.current?.focus()
      })
    },
    [onChange],
  )

  const insertMention = useCallback(
    (slug: string) => {
      const el = textareaRef.current
      if (!el) return

      const cursorPos = el.selectionStart
      const textBefore = value.slice(0, cursorPos)
      const textAfter = value.slice(cursorPos)
      const hashStart = textBefore.lastIndexOf("#")
      const newValue = `${textBefore.slice(0, hashStart)}#${slug} ${textAfter}`

      onChange(newValue)
      setMentionQuery(null)

      // Move cursor after the inserted mention
      requestAnimationFrame(() => {
        const newPos = hashStart + slug.length + 2
        el.setSelectionRange(newPos, newPos)
        el.focus()
      })
    },
    [value, onChange],
  )

  const handleMentionKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Slash command keyboard nav
      if (slashQuery !== null && filteredSlashCommands.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSlashIndex((i) => Math.min(i + 1, filteredSlashCommands.length - 1))
          return
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setSlashIndex((i) => Math.max(i - 1, 0))
          return
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault()
          selectSlashCommand(filteredSlashCommands[slashIndex])
          return
        }
        if (e.key === "Escape") {
          e.preventDefault()
          setSlashQuery(null)
          return
        }
      }
      // Mention keyboard nav
      if (mentionQuery !== null && filteredTickets.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setMentionIndex((i) => Math.min(i + 1, filteredTickets.length - 1))
          return
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setMentionIndex((i) => Math.max(i - 1, 0))
          return
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault()
          insertMention(filteredTickets[mentionIndex].slug)
          return
        }
        if (e.key === "Escape") {
          e.preventDefault()
          setMentionQuery(null)
          return
        }
      }
      onKeyDown(e)
    },
    [slashQuery, filteredSlashCommands, slashIndex, selectSlashCommand, mentionQuery, filteredTickets, mentionIndex, insertMention, onKeyDown],
  )

  const hasReadyImage = pendingImages.some((img) => img.storageUrl)
  const canSend = (value.trim() || hasReadyImage) && !isSending

  return (
    <div className="relative border-t border-border p-3">
      {pendingImages.length > 0 && (
        <div className="mb-2 flex items-center gap-2">
          {pendingImages.map((img, index) => (
            <div key={img.previewUrl} className="relative size-14 shrink-0 rounded-md overflow-hidden border border-border bg-secondary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt={`Pasted screenshot ${index + 1}`}
                className="size-full object-cover"
              />
              {img.isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="size-4 animate-spin text-white" />
                </div>
              )}
              {img.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/50">
                  <span className="text-[10px] text-white font-medium">Error</span>
                </div>
              )}
              <button
                type="button"
                className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-white shadow-sm"
                onClick={() => onRemoveImage(index)}
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
          {pendingImages.length >= MAX_IMAGES && (
            <span className="text-xs text-muted-foreground">Max {MAX_IMAGES} images</span>
          )}
        </div>
      )}
      {hasQueued && (
        <div className="mb-2 text-xs text-muted-foreground">
          Message queued — will send after current response
        </div>
      )}
      {slashQuery !== null && filteredSlashCommands.length > 0 && (
        <div className="absolute bottom-full left-3 right-3 mb-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md">
          {filteredSlashCommands.map((cmd, i) => (
            <button
              key={cmd.command}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${
                i === slashIndex ? "bg-accent text-accent-foreground" : "text-popover-foreground hover:bg-accent/50"
              }`}
              onMouseDown={(e) => {
                e.preventDefault()
                selectSlashCommand(cmd)
              }}
            >
              <Slash className="size-3 shrink-0 text-muted-foreground" />
              <span className="font-medium font-mono">{cmd.command}</span>
              <span className="truncate text-xs text-muted-foreground">{cmd.description}</span>
            </button>
          ))}
        </div>
      )}
      {mentionQuery !== null && filteredTickets.length > 0 && (
        <div className="absolute bottom-full left-3 right-3 mb-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md">
          {filteredTickets.map((ticket, i) => (
            <button
              key={ticket.slug}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${
                i === mentionIndex ? "bg-accent text-accent-foreground" : "text-popover-foreground hover:bg-accent/50"
              }`}
              onMouseDown={(e) => {
                e.preventDefault()
                insertMention(ticket.slug)
              }}
            >
              <Hash className="size-3 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium">{ticket.slug}</span>
              <span className="truncate text-xs text-muted-foreground">{ticket.title}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          placeholder="Type a message or # to mention a ticket..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleMentionKeyDown}
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
