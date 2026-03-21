"use client"

import { useState } from "react"
import { Map } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/src/lib/helpers/cn"
import { Button } from "@/src/lib/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/lib/components/ui/dialog"

const STATUS_ORDER: Record<string, number> = {
  blocked: 0,
  "in-progress": 1,
  todo: 2,
  review: 3,
  completed: 4,
}

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const PRIORITY_LABELS: Record<string, { label: string; className: string }> = {
  critical: { label: "Critical", className: "text-red-400" },
  high: { label: "High", className: "text-red-400" },
  medium: { label: "Medium", className: "text-yellow-400" },
  low: { label: "Low", className: "text-green-400" },
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  todo: { label: "Todo", className: "bg-status-todo/20 text-status-todo" },
  "in-progress": { label: "In Progress", className: "bg-status-in-progress/20 text-status-in-progress" },
  review: { label: "Review", className: "bg-status-review/20 text-status-review" },
  completed: { label: "Completed", className: "bg-status-completed/20 text-status-completed" },
  blocked: { label: "Blocked", className: "bg-status-blocked/20 text-status-blocked" },
}

type Ticket = {
  _id: string
  title: string
  status: string
  priority: string
  checklistTotal: number
  checklistCompleted: number
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  const status = STATUS_BADGE[ticket.status] ?? STATUS_BADGE.todo
  const hasChecklist = ticket.checklistTotal > 0

  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent/50 transition-colors">
      <div className={cn("size-2 shrink-0 rounded-full", `bg-status-${ticket.status}`)} />
      <span className="flex-1 text-sm truncate">{ticket.title}</span>
      {hasChecklist && (
        <span className="text-xs text-muted-foreground shrink-0">
          {ticket.checklistCompleted}/{ticket.checklistTotal}
        </span>
      )}
      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", status.className)}>
        {status.label}
      </span>
    </div>
  )
}

type RoadmapModalProps = {
  epicId: string
}

export function RoadmapModal({ epicId }: RoadmapModalProps) {
  const [open, setOpen] = useState(false)
  const tickets = useQuery(api.tickets.getByEpic, { epicId: epicId as Id<"epics"> })

  const sortedTickets = (tickets ?? [])
    .filter((t) => !t.isDeleted && t.title !== "_context")
    .sort((a, b) => {
      const priorityDiff = (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3)
      if (priorityDiff !== 0) return priorityDiff
      return (STATUS_ORDER[a.status] ?? 2) - (STATUS_ORDER[b.status] ?? 2)
    })

  const grouped = sortedTickets.reduce<Record<string, Ticket[]>>((acc, ticket) => {
    const key = ticket.priority || "low"
    if (!acc[key]) acc[key] = []
    acc[key].push(ticket as Ticket)
    return acc
  }, {})

  const priorityKeys = Object.keys(grouped).sort(
    (a, b) => (PRIORITY_ORDER[a] ?? 3) - (PRIORITY_ORDER[b] ?? 3),
  )

  const totalTickets = sortedTickets.length
  const completedTickets = sortedTickets.filter((t) => t.status === "completed").length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
          <Map className="size-3.5" />
          Roadmap
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="size-4" />
            Roadmap
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {completedTickets}/{totalTickets} tickets completed
          </p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto scrollbar-thin -mx-6 px-6">
          {priorityKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No tickets found</p>
          ) : (
            <div className="flex flex-col gap-4">
              {priorityKeys.map((priority) => {
                const info = PRIORITY_LABELS[priority] ?? PRIORITY_LABELS.low
                return (
                  <div key={priority}>
                    <h4 className={cn("text-xs font-semibold uppercase tracking-wider mb-2 px-3", info.className)}>
                      {info.label} priority
                    </h4>
                    <div className="flex flex-col gap-0.5">
                      {grouped[priority].map((ticket) => (
                        <TicketRow key={ticket._id} ticket={ticket} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
