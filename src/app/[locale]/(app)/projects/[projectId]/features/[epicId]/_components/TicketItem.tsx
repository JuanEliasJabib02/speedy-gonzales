"use client"

import { cn } from "@/src/lib/helpers/cn"
import { TICKET_STATUS_COLORS, type Ticket } from "../_constants/mock-data"

type TicketItemProps = {
  ticket: Ticket
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
      <div className={cn("size-2 shrink-0 rounded-full", TICKET_STATUS_COLORS[ticket.status])} />
      {ticket.title}
    </button>
  )
}
