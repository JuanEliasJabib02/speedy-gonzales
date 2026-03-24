"use client"

import { cn } from "@/src/lib/helpers/cn"
import { STATUS_DOT } from "@/src/lib/constants/status-styles"
import { timeAgo } from "@/src/lib/helpers/timeAgo"

type TicketItemProps = {
  ticket: { id: string; title: string; status: string; blockedReason?: string; updatedAt?: number; agentName?: string }
  isActive: boolean
  onClick: () => void
}

export function TicketItem({ ticket, isActive, onClick }: TicketItemProps) {
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
      <div className="shrink-0 flex items-center justify-center w-[44px] h-[44px]">
        <div className={cn("size-2.5 rounded-full", STATUS_DOT[ticket.status] ?? "bg-status-todo")} />
      </div>
      <div className="flex flex-col min-w-0 gap-0.5">
        <span
          className={cn("truncate", isBlocked && "text-status-blocked font-medium")}
          title={isBlocked && ticket.blockedReason ? `Blocked: ${ticket.blockedReason}` : undefined}
        >
          {isBlocked && "⛔ "}
          {ticket.title}
        </span>
        {(ticket.agentName || ticket.updatedAt) && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            {ticket.updatedAt && <span className="shrink-0">{timeAgo(ticket.updatedAt)}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
