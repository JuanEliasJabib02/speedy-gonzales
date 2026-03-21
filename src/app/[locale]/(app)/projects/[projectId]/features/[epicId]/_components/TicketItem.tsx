"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/src/lib/helpers/cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/lib/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/lib/components/ui/popover"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"

const STATUS_COLORS: Record<string, string> = {
  "blocked": "bg-status-blocked",
  "todo": "bg-status-todo",
  "in-progress": "bg-status-in-progress",
  "review": "bg-status-review",
  "completed": "bg-status-completed",
}

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Done" },
] as const

type TicketItemProps = {
  ticket: { id: string; title: string; status: string; blockedReason?: string }
  isActive: boolean
  onClick: () => void
}

export function TicketItem({ ticket, isActive, onClick }: TicketItemProps) {
  const updateStatus = useMutation(api.tickets.updateStatus)
  const [showBlockedInput, setShowBlockedInput] = useState(false)
  const [blockedReason, setBlockedReason] = useState("")

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "blocked") {
      setBlockedReason("")
      setShowBlockedInput(true)
      return
    }
    updateStatus({ ticketId: ticket.id as Id<"tickets">, status: newStatus })
  }

  const handleBlockedSubmit = () => {
    updateStatus({
      ticketId: ticket.id as Id<"tickets">,
      status: "blocked",
      blockedReason: blockedReason.trim() || undefined,
    })
    setShowBlockedInput(false)
    setBlockedReason("")
  }

  const isBlocked = ticket.status === "blocked"

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick() }}
      className={cn(
        "flex w-full items-center gap-1 rounded-md px-1 py-0.5 text-left text-sm transition-colors cursor-pointer",
        isBlocked && "bg-status-blocked/10",
        isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent"
      )}
    >
      <Popover open={showBlockedInput} onOpenChange={setShowBlockedInput}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="shrink-0 flex items-center justify-center w-[44px] h-[44px] rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 hover:bg-muted/50 transition-colors"
            >
              <div className={cn("size-2.5 rounded-full", STATUS_COLORS[ticket.status] ?? "bg-status-todo")} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[140px]" onClick={(e) => e.stopPropagation()}>
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className="gap-2 text-xs"
              >
                <div className={cn("size-2 rounded-full", STATUS_COLORS[option.value])} />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <PopoverTrigger asChild>
          <span className="hidden" />
        </PopoverTrigger>
        <PopoverContent
          className="w-56 p-3"
          align="start"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs font-medium mb-2">Reason for blocking (optional)</p>
          <Input
            value={blockedReason}
            onChange={(e) => setBlockedReason(e.target.value)}
            placeholder="e.g. Waiting on API…"
            className="h-7 text-xs mb-2"
            onKeyDown={(e) => { if (e.key === "Enter") handleBlockedSubmit() }}
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" className="h-6 text-xs flex-1" onClick={handleBlockedSubmit}>
              Block
            </Button>
            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setShowBlockedInput(false)}>
              Cancel
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <span className={cn("truncate", isBlocked && "text-status-blocked font-medium")}>
        {isBlocked && "⛔ "}
        {ticket.title}
      </span>
    </div>
  )
}
