"use client"

import { useState } from "react"
import { ArrowLeft, FileText, GitBranch, Search } from "lucide-react"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { cn } from "@/src/lib/helpers/cn"
import { TicketItem } from "./TicketItem"

type Ticket = {
  id: string
  title: string
  status: string
}

type TicketSidebarProps = {
  epicTitle: string
  branch: string
  tickets: Ticket[]
  selectedId: string
  onSelect: (id: string) => void
  projectId: string
}

const STATUS_TABS = [
  { key: "all", label: "All", match: () => true },
  { key: "todo", label: "Todo", match: (s: string) => s === "todo" },
  { key: "in-progress", label: "In Progress", match: (s: string) => s === "in-progress" },
  { key: "completed", label: "Done", match: (s: string) => s === "completed" },
] as const

type TabKey = (typeof STATUS_TABS)[number]["key"]

const TAB_ACTIVE_STYLES: Record<TabKey, string> = {
  all: "bg-muted text-foreground",
  todo: "bg-muted text-foreground",
  "in-progress": "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  completed: "bg-green-500/15 text-green-600 dark:text-green-400",
}

export function TicketSidebar({ epicTitle, branch, tickets, selectedId, onSelect, projectId }: TicketSidebarProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<TabKey>("all")

  const activeFilter = STATUS_TABS.find((t) => t.key === activeTab)!

  const filteredTickets = tickets
    .filter((t) => activeFilter.match(t.status))
    .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()))

  const counts = STATUS_TABS.reduce(
    (acc, tab) => {
      acc[tab.key] = tickets.filter((t) => tab.match(t.status)).length
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
        <span className="text-sm font-semibold">{epicTitle}</span>
      </div>
      <div className="flex items-center gap-1.5 px-4 pb-3">
        <GitBranch className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground font-mono truncate">{branch}</span>
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
      <div className="flex items-center gap-1 px-3 pb-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
              activeTab === tab.key
                ? TAB_ACTIVE_STYLES[tab.key]
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            {tab.label}
            <span className="ml-1 opacity-70">({counts[tab.key]})</span>
          </button>
        ))}
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
