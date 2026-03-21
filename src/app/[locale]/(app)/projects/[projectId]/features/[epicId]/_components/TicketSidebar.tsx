"use client"

import { ArrowLeft, FileText } from "lucide-react"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import { TicketItem } from "./TicketItem"
import type { Ticket } from "../_constants/mock-data"

type TicketSidebarProps = {
  epicTitle: string
  tickets: Ticket[]
  selectedId: string
  onSelect: (id: string) => void
  projectId: string
}

export function TicketSidebar({ epicTitle, tickets, selectedId, onSelect, projectId }: TicketSidebarProps) {
  const router = useRouter()

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
      <div className="mx-4 border-t border-border" />
      <div className="flex flex-col gap-1 p-2">
        {tickets.map((ticket) => (
          <TicketItem
            key={ticket.id}
            ticket={ticket}
            isActive={ticket.id === selectedId}
            onClick={() => onSelect(ticket.id)}
          />
        ))}
      </div>
    </div>
  )
}
