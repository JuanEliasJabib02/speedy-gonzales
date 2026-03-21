"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"

type ContextSummaryCardProps = {
  epicTitle: string
  epicStatus: string
  pendingTickets: number
  totalTickets: number
}

export function ContextSummaryCard({
  epicTitle,
  epicStatus,
  pendingTickets,
  totalTickets,
}: ContextSummaryCardProps) {
  const [dismissed, setDismissed] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  if (dismissed) return null

  return (
    <div className="rounded-lg border border-border bg-muted p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 text-left font-medium text-foreground"
        >
          {collapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          {epicTitle}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>
      {!collapsed && (
        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
          <span>Status: <span className="text-foreground">{epicStatus}</span></span>
          <span>Tickets: <span className="text-foreground">{totalTickets - pendingTickets}/{totalTickets} completed</span></span>
        </div>
      )}
    </div>
  )
}
