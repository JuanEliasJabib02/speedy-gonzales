"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { TicketSidebar } from "./TicketSidebar"
import { PlanViewer } from "./PlanViewer"
import { ChatPanel } from "./ChatPanel"
import { ResizeHandle } from "./ResizeHandle"
import { useLivePlan } from "../_hooks/useLivePlan"

const CHAT_MIN_WIDTH = 320
const CHAT_MAX_WIDTH = 700
const CHAT_DEFAULT_WIDTH = 380

type FeatureLayoutProps = {
  projectId: string
  epicId: string
}

export type ViewMode = "chat" | "code"

export function FeatureLayout({ projectId, epicId }: FeatureLayoutProps) {
  const { plan: epic, isLoading, getTicketContent, lastSyncAt, syncStatus, repoOwner, repoName } = useLivePlan(epicId, projectId)
  const [selectedTicketId, setSelectedTicketId] = useState("")
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH)

  const storageKey = `speedy-view-mode-${epicId}`
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "chat"
    return (localStorage.getItem(storageKey) as ViewMode) ?? "chat"
  })

  useEffect(() => {
    localStorage.setItem(storageKey, viewMode)
  }, [storageKey, viewMode])
  const isDragging = useRef(false)
  const sendDirectRef = useRef<((message: string) => void) | null>(null)

  const handleSendDirectReady = useCallback((fn: (message: string) => void) => {
    sendDirectRef.current = fn
  }, [])

  const handleCreateTicket = useCallback((message: string) => {
    sendDirectRef.current?.(message)
  }, [])

  const handleDragStart = useCallback(() => {
    isDragging.current = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const newWidth = window.innerWidth - e.clientX
      setChatWidth(Math.min(CHAT_MAX_WIDTH, Math.max(CHAT_MIN_WIDTH, newWidth)))
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [])

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
  const overviewData = getTicketContent("_context")

  return (
    <div className="flex h-full">
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
        overviewContent={overviewData.content}
        overviewStatus={epic.status}
        overviewPriority={epic.priority}
        onCreateTicket={handleCreateTicket}
      />
      <PlanViewer
        title={selectedTicket?.title ?? epic.title}
        status={selectedTicket?.status ?? epic.status}
        priority={epic.priority}
        content={ticketData.content}
        checklist={ticketData.checklist}
        ticketId={selectedTicket?.id !== "_context" ? selectedTicket?.id : undefined}
        blockedReason={selectedTicket?.blockedReason}
        commits={selectedTicket?.commits ?? []}
        repoOwner={repoOwner}
        repoName={repoName}
      />
      <ResizeHandle onDragStart={handleDragStart} />
      <ChatPanel width={chatWidth} projectId={projectId} epicId={epicId} onSendDirectReady={handleSendDirectReady} viewMode={viewMode} onViewModeChange={setViewMode} repoOwner={repoOwner ?? ""} repoName={repoName ?? ""} branch={epic?.branch ?? "main"} />
    </div>
  )
}
