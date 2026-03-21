"use client"

import { CheckCircle2, ArrowRightLeft, RefreshCw, Ticket } from "lucide-react"
import { cn } from "@/src/lib/helpers/cn"

type ActionType = "ticket-created" | "status-updated" | "sync-triggered"

type ActionCardProps = {
  type: ActionType
  title: string
  detail?: string
}

const ACTION_CONFIG: Record<ActionType, { icon: typeof CheckCircle2; label: string; className: string }> = {
  "ticket-created": {
    icon: Ticket,
    label: "Ticket Created",
    className: "border-status-completed/30 bg-status-completed/5",
  },
  "status-updated": {
    icon: ArrowRightLeft,
    label: "Status Updated",
    className: "border-status-in-progress/30 bg-status-in-progress/5",
  },
  "sync-triggered": {
    icon: RefreshCw,
    label: "Sync Triggered",
    className: "border-primary/30 bg-primary/5",
  },
}

export type ParsedAction = {
  type: ActionType
  title: string
  detail?: string
}

export function parseActions(content: string): ParsedAction[] {
  const actions: ParsedAction[] = []

  // ✅ Ticket created: `slug` → `status`
  const ticketCreated = content.match(/(?:✅|ticket created)[:\s]+[`"]?([^`"\n→]+)[`"]?\s*(?:→\s*[`"]?([^`"\n]+)[`"]?)?/gi)
  if (ticketCreated) {
    for (const m of ticketCreated) {
      const parts = m.match(/[`"]?([^`"→\n:]+)[`"]?\s*(?:→\s*[`"]?([^`"\n]+)[`"]?)?$/)
      if (parts) actions.push({ type: "ticket-created", title: parts[1].trim(), detail: parts[2]?.trim() })
    }
  }

  // 🔄 Status updated: `ticket` → `status`
  const statusUpdated = content.match(/(?:🔄|status updated|moved)[:\s]+[`"]?([^`"\n→]+)[`"]?\s*→\s*[`"]?([^`"\n]+)[`"]?/gi)
  if (statusUpdated) {
    for (const m of statusUpdated) {
      const parts = m.match(/[`"]?([^`"→\n:]+)[`"]?\s*→\s*[`"]?([^`"\n]+)[`"]?$/)
      if (parts) actions.push({ type: "status-updated", title: parts[1].trim(), detail: parts[2]?.trim() })
    }
  }

  // 📦 Sync triggered for `project`
  const syncTriggered = content.match(/(?:📦|sync triggered)[:\s]+(?:for\s+)?[`"]?([^`"\n]+)[`"]?/gi)
  if (syncTriggered) {
    for (const m of syncTriggered) {
      const parts = m.match(/[`"]?([^`"\n:]+)[`"]?$/)
      if (parts) actions.push({ type: "sync-triggered", title: parts[1].trim() })
    }
  }

  return actions
}

export function ActionCard({ type, title, detail }: ActionCardProps) {
  const config = ACTION_CONFIG[type]
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-3 rounded-lg border px-3 py-2.5", config.className)}>
      <Icon className="size-4 shrink-0" />
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{config.label}</span>
        <span className="text-sm font-medium truncate">
          {title}
          {detail && <span className="text-muted-foreground font-normal"> → {detail}</span>}
        </span>
      </div>
    </div>
  )
}
