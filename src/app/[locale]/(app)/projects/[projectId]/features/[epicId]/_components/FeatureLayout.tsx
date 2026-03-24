"use client"

import { useState, useCallback } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { TicketSidebar } from "./TicketSidebar"
import { PlanViewer } from "./PlanViewer"
import { useLivePlan } from "../_hooks/useLivePlan"

type FeatureLayoutProps = {
  projectId: string
  epicId: string
}

export function FeatureLayout({ projectId, epicId }: FeatureLayoutProps) {
  const { plan: epic, isLoading, getTicketContent, lastSyncAt, syncStatus, repoOwner, repoName } = useLivePlan(epicId, projectId)
  const createTicketAction = useAction(api.githubSync.createTicketOnGitHub)
  const [selectedTicketId, setSelectedTicketId] = useState("")

  const handleCreateTicket = useCallback(
    async (args: { title: string; priority: string; description: string }) => {
      await createTicketAction({
        projectId: projectId as Id<"projects">,
        epicId: epicId as Id<"epics">,
        title: args.title,
        priority: args.priority,
        description: args.description || undefined,
      })
    },
    [createTicketAction, projectId, epicId],
  )

  if (isLoading || !epic) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading feature...</span>
        </div>
      </div>
    )
  }

  const realTickets = epic.tickets.filter((t) => t.title !== "Overview" && t.id !== "_context")
  const effectiveId = selectedTicketId || realTickets[0]?.id || ""
  const selectedTicket = epic.tickets.find((t) => t.id === effectiveId)
  const ticketData = getTicketContent(effectiveId)

  return (
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
        onCreateTicket={handleCreateTicket}
      />

      {/* Center panel: plan viewer */}
      <PlanViewer
        title={selectedTicket?.title ?? epic.title}
        status={selectedTicket?.status ?? epic.status}
        priority={epic.priority}
        content={ticketData.content}
        checklist={ticketData.checklist}
        ticketId={selectedTicket?.id !== "_context" ? selectedTicket?.id : undefined}
        blockedReason={selectedTicket?.blockedReason}
      />
    </div>
  )
}
