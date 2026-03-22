"use client"

import { useState } from "react"
import { ArrowLeft, FileText, GitBranch, Search } from "lucide-react"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { TicketItem } from "./TicketItem"
import { RoadmapModal } from "./RoadmapModal"
import { OverviewModal } from "./OverviewModal"
import { NewTicketModal } from "./NewTicketModal"
import type { ViewMode } from "./FeatureLayout"

type Ticket = {
  id: string
  title: string
  status: string
  blockedReason?: string
  updatedAt?: number
  agentName?: string
  _creationTime?: number
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
  overviewContent?: string
  overviewStatus?: string
  overviewPriority?: string
  onCreateTicket?: (message: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
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

export function TicketSidebar({ epicTitle, branch, tickets, selectedId, onSelect, projectId, epicId, lastSyncAt, syncStatus, overviewContent, overviewStatus, overviewPriority, onCreateTicket, viewMode, onViewModeChange }: TicketSidebarProps) {
  const isSyncing = syncStatus === "syncing"
  const syncAgo = lastSyncAt ? Math.floor((Date.now() - lastSyncAt) / 1000) : null
  const syncLabel = syncAgo === null ? null : syncAgo < 60 ? `${syncAgo}s ago` : syncAgo < 3600 ? `${Math.floor(syncAgo / 60)}m ago` : `${Math.floor(syncAgo / 3600)}h ago`
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<TabKey>("all")

  const activeFilter = STATUS_TABS.find((t) => t.key === activeTab)!

  const contextTicket = tickets.find((t) => t.title === "_context")
  const regularTickets = tickets.filter((t) => t.title !== "_context")

  const filteredTickets = regularTickets
    .filter((t) => activeFilter.match(t.status))
    .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aTime = a.updatedAt ?? a._creationTime ?? 0
      const bTime = b.updatedAt ?? b._creationTime ?? 0
      return bTime - aTime
    })

  const counts = STATUS_TABS.reduce(
    (acc, tab) => {
      acc[tab.key] = regularTickets.filter((t) => tab.match(t.status)).length
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
        <div className="ml-auto flex items-center rounded-md border border-border bg-muted/50 p-0.5">
          <button
            onClick={() => onViewModeChange("plan")}
            className={`rounded px-2 py-0.5 text-[11px] font-medium transition-all ${
              viewMode === "plan"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Plan
          </button>
          <button
            onClick={() => onViewModeChange("code")}
            className={`rounded px-2 py-0.5 text-[11px] font-medium transition-all ${
              viewMode === "code"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Code
          </button>
        </div>
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
        {overviewContent && (
          <OverviewModal
            title={epicTitle}
            status={overviewStatus ?? "todo"}
            priority={overviewPriority ?? "medium"}
            content={overviewContent}
          />
        )}
        <RoadmapModal epicId={epicId} />
        {onCreateTicket && <NewTicketModal epicId={epicId} onSubmit={onCreateTicket} />}
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
      <div className="mx-4 border-t border-border" />
      <div className="flex flex-col gap-1 p-2">
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
