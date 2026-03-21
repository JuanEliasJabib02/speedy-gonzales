"use client"

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

const STATUS_COLORS: Record<string, string> = {
  "todo": "bg-status-todo",
  "in-progress": "bg-status-in-progress",
  "review": "bg-status-review",
  "completed": "bg-status-completed",
}

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Done" },
] as const

type TicketItemProps = {
  ticket: { id: string; title: string; status: string }
  isActive: boolean
  onClick: () => void
}

export function TicketItem({ ticket, isActive, onClick }: TicketItemProps) {
  const updateStatus = useMutation(api.tickets.updateStatus)

  const handleStatusChange = (newStatus: string) => {
    updateStatus({ ticketId: ticket.id as Id<"tickets">, status: newStatus })
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick() }}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors cursor-pointer",
        isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent"
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button type="button" className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1">
            <div className={cn("size-2 rounded-full", STATUS_COLORS[ticket.status] ?? "bg-status-todo")} />
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
      {ticket.title}
    </div>
  )
}
