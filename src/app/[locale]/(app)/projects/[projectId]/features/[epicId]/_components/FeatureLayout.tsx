"use client"

import { useState, useCallback } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { TicketSidebar } from "./TicketSidebar"
import { PlanViewer } from "./PlanViewer"
import { useLivePlan } from "../_hooks/useLivePlan"
import { ChatPanel } from "@/src/components/chat/ChatPanel"

type FeatureLayoutProps = {
  projectId: string
  epicId: string
}

export function FeatureLayout({ projectId, epicId }: FeatureLayoutProps) {
  const { plan: epic, isLoading, isTicketsLoading, getTicketContent, lastSyncAt, syncStatus, repoOwner, repoName } = useLivePlan(epicId, projectId)
  const [selectedTicketId, setSelectedTicketId] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Only show full loading for epic, not tickets
  if (isLoading || !epic) {
    return (
      <div className="flex h-full">
        {/* Left panel skeleton */}
        <div className="w-80 border-r bg-muted/30">
          <div className="border-b p-4">
            <div className="h-6 w-48 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>

        {/* Center panel skeleton */}
        <div className="flex-1 p-6">
          <div className="h-8 w-64 animate-pulse rounded bg-muted mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const realTickets = epic.tickets.filter((t) => t.title !== "Overview" && t.id !== "_context")
  const effectiveId = selectedTicketId || "_context"
  const selectedTicket = epic.tickets.find((t) => t.id === effectiveId)
  const ticketData = getTicketContent(effectiveId)

  return (
    <>
      <div className="flex h-full">
        {/* Left panel: ticket sidebar */}
        <TicketSidebar
          epicTitle={epic.title}
          branch={epic.branch}
          tickets={epic.tickets}
          selectedId={effectiveId}
          onSelect={setSelectedTicketId}
          projectId={projectId}
          epicId={epicId}
          lastSyncAt={lastSyncAt}
          syncStatus={syncStatus}
        />

        {/* Center panel: plan viewer */}
        <PlanViewer
          title={selectedTicket?.title ?? epic.title}
          status={selectedTicket?.status ?? epic.status}
          priority={epic.priority}
          content={ticketData.content}
          ticketId={selectedTicket?.id !== "_context" ? selectedTicket?.id : undefined}
          blockedReason={selectedTicket?.blockedReason}
        />
      </div>

      {/* Chat panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </>
  )
}
