"use client"

import { useState } from "react"
import { ArrowLeft, FileText, GitBranch, Search } from "lucide-react"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
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

export function TicketSidebar({ epicTitle, branch, tickets, selectedId, onSelect, projectId }: TicketSidebarProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const filteredTickets = search
    ? tickets.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    : tickets

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
