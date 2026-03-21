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
import { ChevronDown } from "lucide-react"
import { ChecklistProgress } from "./ChecklistProgress"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"

const STATUS_PILL: Record<string, string> = {
  "blocked": "bg-status-blocked/15 text-status-blocked",
  "todo": "bg-status-todo/15 text-status-todo",
  "in-progress": "bg-status-in-progress/15 text-status-in-progress",
  "review": "bg-status-review/15 text-status-review",
  "completed": "bg-status-completed/15 text-status-completed",
}

const STATUS_DOT: Record<string, string> = {
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

const PRIORITY_PILL: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-status-in-progress/15 text-status-in-progress",
  high: "bg-status-review/15 text-status-review",
  critical: "bg-status-blocked/15 text-status-blocked",
}

type PlanViewerProps = {
  title: string
  status: string
  priority: string
  content: string
  checklist: { total: number; completed: number }
  ticketId?: string
  blockedReason?: string
}

export function PlanViewer({ title, status, priority, content, checklist, ticketId, blockedReason }: PlanViewerProps) {
  const updateStatus = useMutation(api.tickets.updateStatus)
  const [showBlockedInput, setShowBlockedInput] = useState(false)
  const [reasonText, setReasonText] = useState("")

  const handleStatusChange = (newStatus: string) => {
    if (!ticketId) return
    if (newStatus === "blocked") {
      setReasonText("")
      setShowBlockedInput(true)
      return
    }
    updateStatus({ ticketId: ticketId as Id<"tickets">, status: newStatus })
  }

  const handleBlockedSubmit = () => {
    if (!ticketId) return
    updateStatus({
      ticketId: ticketId as Id<"tickets">,
      status: "blocked",
      blockedReason: reasonText.trim() || undefined,
    })
    setShowBlockedInput(false)
    setReasonText("")
  }

  const handleUnblock = () => {
    if (!ticketId) return
    updateStatus({ ticketId: ticketId as Id<"tickets">, status: "in-progress" })
  }

  const isBlocked = status === "blocked"

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6 scrollbar-thin">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold">{title}</h2>

        {ticketId ? (
          <Popover open={showBlockedInput} onOpenChange={setShowBlockedInput}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80",
                    STATUS_PILL[status] ?? STATUS_PILL.todo
                  )}
                >
                  <div className={cn("size-1.5 rounded-full", STATUS_DOT[status] ?? "bg-status-todo")} />
                  {isBlocked ? "⛔ blocked" : status}
                  <ChevronDown className="size-3 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[140px]">
                {STATUS_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className="gap-2 text-xs"
                  >
                    <div className={cn("size-2 rounded-full", STATUS_DOT[option.value])} />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <PopoverTrigger asChild>
              <span className="hidden" />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
              <p className="text-xs font-medium mb-2">Reason for blocking (optional)</p>
              <Input
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
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
        ) : (
          <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_PILL[status] ?? STATUS_PILL.todo}`}>
            {status}
          </span>
        )}

        <span className={`rounded-full px-2.5 py-0.5 text-xs ${PRIORITY_PILL[priority] ?? PRIORITY_PILL.medium}`}>
          {priority}
        </span>

        {isBlocked && ticketId && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs gap-1 border-status-blocked/30 text-status-blocked hover:bg-status-blocked/10"
            onClick={handleUnblock}
          >
            Unblock →
          </Button>
        )}
      </div>

      {isBlocked && blockedReason && (
        <div className="mb-4 rounded-md border border-status-blocked/30 bg-status-blocked/5 px-3 py-2">
          <p className="text-xs font-medium text-status-blocked">⛔ Blocked: {blockedReason}</p>
        </div>
      )}

      {checklist.total > 0 && (
        <ChecklistProgress completed={checklist.completed} total={checklist.total} />
      )}

      <div className="my-4 border-t border-border" />

      <div className="max-w-none">
        {content.split("\n").map((line, i) => {
          const key = `line-${i}`
          if (line.startsWith("## ")) return <h2 key={key} className="mt-6 mb-2 text-lg font-semibold text-foreground">{line.replace("## ", "")}</h2>
          if (line.startsWith("### ")) return <h3 key={key} className="mt-4 mb-1 text-base font-medium text-foreground">{line.replace("### ", "")}</h3>
          if (line.startsWith("- [x] ")) return (
            <label key={key} className="flex items-center gap-2 py-0.5 text-sm text-muted-foreground">
              <input type="checkbox" checked={true} readOnly className="size-4 rounded accent-primary" />
              <span className="line-through">{line.replace("- [x] ", "")}</span>
            </label>
          )
          if (line.startsWith("- [ ] ")) return (
            <label key={key} className="flex items-center gap-2 py-0.5 text-sm text-foreground">
              <input type="checkbox" checked={false} readOnly className="size-4 rounded accent-primary" />
              {line.replace("- [ ] ", "")}
            </label>
          )
          if (line.startsWith("- **")) {
            const match = line.match(/^- \*\*(.+?)\*\*(.*)$/)
            if (match) return (
              <li key={key} className="ml-4 list-disc py-0.5 text-sm text-foreground">
                <strong>{match[1]}</strong>{match[2]}
              </li>
            )
          }
          if (line.startsWith("- ")) return <li key={key} className="ml-4 list-disc py-0.5 text-sm text-foreground">{line.replace("- ", "")}</li>
          if (line.trim() === "") return <div key={key} className="h-2" />
          return <p key={key} className="text-sm text-foreground leading-relaxed">{line}</p>
        })}
      </div>
    </div>
  )
}
