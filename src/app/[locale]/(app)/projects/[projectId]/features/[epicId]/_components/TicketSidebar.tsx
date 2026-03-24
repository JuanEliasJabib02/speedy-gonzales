"use client"

import { useState, useCallback } from "react"
import { ArrowLeft, FileText, GitBranch, Search, BookOpen, CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "@/src/i18n/routing"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { TicketItem } from "./TicketItem"
import { NewTicketModal } from "./NewTicketModal"
import { timeAgo } from "@/src/lib/helpers/timeAgo"

type Ticket = {
  id: string
  title: string
  status: string
  blockedReason?: string
  updatedAt?: number
  agentName?: string
  _creationTime?: number
  isLoading?: boolean
}

type TicketSidebarProps = {
  epicTitle: string
  branch: string
  tickets: Ticket[]
  selectedId: string
  onSelect: (id: string) => void
  projectId: string
  epicId: string
  lastSyncAt?: number
  syncStatus?: string
  onCreateTicket?: (args: { title: string; priority: string; description: string }) => Promise<void>
}

const STATUS_TABS = [
  { key: "all", label: "All", match: () => true },
  { key: "blocked", label: "Blocked", match: (s: string) => s === "blocked" },
  { key: "todo", label: "Todo", match: (s: string) => s === "todo" },
  { key: "in-progress", label: "In Progress", match: (s: string) => s === "in-progress" },
  { key: "review", label: "Review", match: (s: string) => s === "review" },
  { key: "completed", label: "Done", match: (s: string) => s === "completed" },
] as const

type TabKey = (typeof STATUS_TABS)[number]["key"]

export function TicketSidebar({ epicTitle, branch, tickets, selectedId, onSelect, projectId, epicId, lastSyncAt, syncStatus, onCreateTicket }: TicketSidebarProps) {
  const isSyncing = syncStatus === "syncing"
  const syncLabel = lastSyncAt ? timeAgo(lastSyncAt) : null
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [marking, setMarking] = useState(false)
  const updateStatus = useMutation(api.tickets.updateStatus)

  const activeFilter = STATUS_TABS.find((t) => t.key === activeTab)!

  const handleApprove = useCallback(async () => {
    if (!selectedId || selectedId === "_context" || marking) return
    setMarking(true)
    try {
      await updateStatus({ ticketId: selectedId as Id<"tickets">, status: "completed" })
    } finally {
      setMarking(false)
    }
  }, [selectedId, marking, updateStatus])

  const selectedTicket = tickets.find((t) => t.id === selectedId)
  const showApproveButtons = selectedTicket?.status === "review" && selectedId !== "_context"

  const regularTickets = tickets.filter((t) => t.id !== "_context")

  const filteredTickets = regularTickets
    .filter((t) => t.isLoading || activeFilter.match(t.status)) // Show loading tickets in all tabs
    .filter((t) => t.isLoading || !search || t.title.toLowerCase().includes(search.toLowerCase())) // Skip search for loading tickets
    .sort((a, b) => {
      const aTime = a.updatedAt ?? 0
      const bTime = b.updatedAt ?? 0
      if (aTime !== bTime) return bTime - aTime
      const aCreate = a._creationTime ?? 0
      const bCreate = b._creationTime ?? 0
      return bCreate - aCreate
    })

  const counts = STATUS_TABS.reduce(
    (acc, tab) => {
      acc[tab.key] = regularTickets.filter((t) => !t.isLoading && tab.match(t.status)).length
      return acc
    },
    {} as Record<TabKey, number>,
  )

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-r border-border bg-card overflow-y-auto scrollbar-thin">
      <div className="flex items-center gap-2 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={() => router.push(`/projects/${projectId}`)}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <FileText className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold truncate">{epicTitle}</span>
      </div>
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <GitBranch className="size-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground font-mono truncate">{branch}</span>
        </div>
        {syncLabel && (
          <span className={`text-xs shrink-0 ${isSyncing ? "text-status-in-progress animate-pulse" : "text-muted-foreground"}`}>
            {isSyncing ? "syncing…" : `↻ ${syncLabel}`}
          </span>
        )}
      </div>
      <div className="flex gap-2 px-3 pb-3">
        <NewTicketModal epicId={epicId} onSubmit={onCreateTicket} />
      </div>
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>
      <div className="px-3 pb-3">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as TabKey)}
          className="w-full rounded border border-border bg-card text-xs px-2 py-1 text-foreground"
        >
          {STATUS_TABS.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label} ({counts[tab.key]})
            </option>
          ))}
        </select>
      </div>
      {showApproveButtons && (
        <div className="px-3 pb-3">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={marking}
            className="h-7 w-full text-xs gap-1.5 bg-status-completed hover:bg-status-completed/80 text-white"
          >
            {marking ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
            Approve Ticket
          </Button>
        </div>
      )}
      <div className="mx-4 border-t border-border" />
      <div className="flex flex-col gap-1 p-2">
        {/* Overview item */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect("_context")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect("_context") }}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors cursor-pointer font-medium ${
            selectedId === "_context" ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent"
          }`}
        >
          <BookOpen className="size-4 text-primary shrink-0" />
          <span className="truncate">Overview</span>
        </div>

        {/* Regular tickets */}
        {filteredTickets.map((ticket) => (
          <TicketItem
            key={ticket.id}
            ticket={ticket}
            isActive={ticket.id === selectedId}
            onClick={() => onSelect(ticket.id)}
          />
        ))}
        {filteredTickets.length === 0 && (
          <p className="px-3 py-4 text-xs text-muted-foreground text-center">No tickets found</p>
        )}
      </div>
    </div>
  )
}
