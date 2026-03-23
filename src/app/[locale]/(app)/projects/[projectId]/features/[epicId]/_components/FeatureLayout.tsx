"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { TicketSidebar } from "./TicketSidebar"
import { PlanViewer } from "./PlanViewer"
import { CommitTimeline } from "./CommitTimeline"
import { ResizeHandle } from "./ResizeHandle"
import { useLivePlan } from "../_hooks/useLivePlan"
import { useCommitTimeline } from "../_hooks/useCommitTimeline"

const TIMELINE_MIN_WIDTH = 280
const TIMELINE_MAX_WIDTH = 600
const TIMELINE_DEFAULT_WIDTH = 360

type FeatureLayoutProps = {
  projectId: string
  epicId: string
}

export function FeatureLayout({ projectId, epicId }: FeatureLayoutProps) {
  const { plan: epic, isLoading, getTicketContent, lastSyncAt, syncStatus, repoOwner, repoName, projectBranch } = useLivePlan(epicId, projectId)
  const createTicketAction = useAction(api.githubSync.createTicketOnGitHub)
  const [selectedTicketId, setSelectedTicketId] = useState("")
  const [timelineWidth, setTimelineWidth] = useState(TIMELINE_DEFAULT_WIDTH)
  const [ticketFilter, setTicketFilter] = useState<string | null>(null)

  const { commits, loading: commitsLoading, error: commitsError, hasMore, loadMore, refresh, activeBranch } = useCommitTimeline({
    owner: repoOwner,
    repo: repoName,
    branch: epic?.branch ?? "",
    fallbackBranch: projectBranch ?? "main",
  })

  const isDragging = useRef(false)
  const mouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null)
  const mouseUpRef = useRef<(() => void) | null>(null)

  const cleanupDrag = useCallback(() => {
    if (mouseMoveRef.current) {
      document.removeEventListener("mousemove", mouseMoveRef.current)
      mouseMoveRef.current = null
    }
    if (mouseUpRef.current) {
      document.removeEventListener("mouseup", mouseUpRef.current)
      mouseUpRef.current = null
    }
    if (isDragging.current) {
      isDragging.current = false
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [])

  useEffect(() => {
    return () => {
      cleanupDrag()
    }
  }, [cleanupDrag])

  const handleDragStart = useCallback(() => {
    isDragging.current = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const newWidth = window.innerWidth - e.clientX
      setTimelineWidth(Math.min(TIMELINE_MAX_WIDTH, Math.max(TIMELINE_MIN_WIDTH, newWidth)))
    }

    const handleMouseUp = () => {
      isDragging.current = false
      mouseMoveRef.current = null
      mouseUpRef.current = null
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    mouseMoveRef.current = handleMouseMove
    mouseUpRef.current = handleMouseUp

    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [])

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
        commits={(selectedTicket as { commits?: string[] } | undefined)?.commits ?? []}
        repoOwner={repoOwner}
        repoName={repoName}
      />

      {/* ResizeHandle + right panel: commit timeline */}
      <ResizeHandle onDragStart={handleDragStart} />
      <div
        className="flex shrink-0 flex-col border-l border-border bg-card overflow-hidden"
        style={{ width: timelineWidth }}
      >
        <CommitTimeline
          commits={commits}
          loading={commitsLoading}
          error={commitsError}
          hasMore={hasMore}
          branch={activeBranch}
          repoOwner={repoOwner ?? ""}
          repoName={repoName ?? ""}
          onLoadMore={loadMore}
          onRefresh={refresh}
          ticketFilter={ticketFilter}
          onTicketFilterChange={setTicketFilter}
          tickets={realTickets.map((t) => ({ id: t.id, title: t.title }))}
        />
      </div>
    </div>
  )
}
