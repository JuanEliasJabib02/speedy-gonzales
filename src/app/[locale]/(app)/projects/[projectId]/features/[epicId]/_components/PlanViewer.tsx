"use client"

import { useState, useEffect, useCallback } from "react"
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
import { ChevronDown, CheckCircle2, Wrench, Loader2 } from "lucide-react"
import { ChecklistProgress } from "./ChecklistProgress"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import type { Components } from "react-markdown"
import { MarkdownContent } from "@/src/lib/components/common/MarkdownContent"
import { STATUS_PILL, STATUS_DOT, PRIORITY_STYLES } from "@/src/lib/constants/status-styles"

const planMarkdownComponents: Components = {
  h2({ children }) {
    return <h2 className="mt-6 mb-2 text-lg font-semibold text-foreground">{children}</h2>
  },
  h3({ children }) {
    return <h3 className="mt-4 mb-1 text-base font-medium text-foreground">{children}</h3>
  },
  p({ children }) {
    return <p className="text-sm text-foreground leading-relaxed mb-2">{children}</p>
  },
  ul({ children }) {
    return <ul className="ml-4 list-disc [&>li]:py-0.5 [&>li]:text-sm">{children}</ul>
  },
  ol({ children }) {
    return <ol className="ml-4 list-decimal [&>li]:py-0.5 [&>li]:text-sm">{children}</ol>
  },
  li({ children, ...props }) {
    const checked = (props as Record<string, unknown>).checked
    if (typeof checked === "boolean") {
      return (
        <li className="flex items-center gap-2 py-0.5 text-sm list-none -ml-4">
          <input type="checkbox" checked={checked} readOnly className="size-4 rounded accent-primary" />
          <span className={checked ? "line-through text-muted-foreground" : "text-foreground"}>{children}</span>
        </li>
      )
    }
    return <li className="text-foreground">{children}</li>
  },
  blockquote({ children }) {
    return <blockquote className="border-l-2 border-muted-foreground/30 pl-4 my-2 text-muted-foreground italic">{children}</blockquote>
  },
  table({ children }) {
    return <table className="my-3 w-full border-collapse text-sm">{children}</table>
  },
  th({ children }) {
    return <th className="border border-border bg-muted px-3 py-1.5 text-left text-xs font-semibold">{children}</th>
  },
  td({ children }) {
    return <td className="border border-border px-3 py-1.5 text-sm">{children}</td>
  },
  hr() {
    return <hr className="my-4 border-border" />
  },
}

const STATUS_OPTIONS = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "blocked", label: "Blocked" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Done" },
] as const

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
  const [marking, setMarking] = useState(false)

  const handleStatusChange = (newStatus: "backlog" | "todo" | "in-progress" | "review" | "completed" | "blocked") => {
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

  const handleApprove = useCallback(async (completionType: "clean" | "with-fixes") => {
    if (!ticketId || marking) return
    setMarking(true)
    try {
      await updateStatus({ ticketId: ticketId as Id<"tickets">, status: "completed", completionType })
    } finally {
      setMarking(false)
    }
  }, [ticketId, marking, updateStatus])

  const isBlocked = status === "blocked"
  const isReview = status === "review"

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
                  {isBlocked ? "blocked" : status}
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

        <span className={`rounded-full px-2.5 py-0.5 text-xs ${PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.medium}`}>
          {priority}
        </span>

        {isBlocked && ticketId && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs gap-1 border-status-blocked/30 text-status-blocked hover:bg-status-blocked/10"
            onClick={handleUnblock}
          >
            Unblock
          </Button>
        )}

        {isReview && ticketId && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleApprove("clean")}
              disabled={marking}
              className="h-7 text-xs gap-1.5 bg-status-completed hover:bg-status-completed/80 text-white"
            >
              {marking ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApprove("with-fixes")}
              disabled={marking}
              className="h-7 text-xs gap-1.5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
            >
              {marking ? <Loader2 className="size-3 animate-spin" /> : <Wrench className="size-3.5" />}
              Approve with fixes
            </Button>
          </div>
        )}
      </div>

      {isBlocked && blockedReason && (
        <div className="mb-4 rounded-md border border-status-blocked/30 bg-status-blocked/5 px-3 py-2">
          <p className="text-xs font-medium text-status-blocked">Blocked: {blockedReason}</p>
        </div>
      )}

      {checklist.total > 0 && (
        <ChecklistProgress completed={checklist.completed} total={checklist.total} />
      )}

      <div className="my-4 border-t border-border" />

      <MarkdownContent content={content} components={planMarkdownComponents} className="max-w-none" />
    </div>
  )
}
