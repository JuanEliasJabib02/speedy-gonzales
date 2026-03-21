"use client"

import { cn } from "@/src/lib/helpers/cn"

const STATUS_COLORS: Record<string, string> = {
  "todo": "bg-status-todo",
  "in-progress": "bg-status-in-progress",
  "review": "bg-status-review",
  "completed": "bg-status-completed",
}

type TicketItemProps = {
  ticket: { id: string; title: string; status: string }
  isActive: boolean
  onClick: () => void
}

export function TicketItem({ ticket, isActive, onClick }: TicketItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent"
      )}
    >
      <div className={cn("size-2 shrink-0 rounded-full", STATUS_COLORS[ticket.status] ?? "bg-status-todo")} />
      {ticket.title}
    </button>
  )
}
