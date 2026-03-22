"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { ArrowLeft, FileText } from "lucide-react"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import { TicketSidebar } from "./TicketSidebar"
import { PlanViewer } from "./PlanViewer"
import { ChatPanel } from "./ChatPanel"
import { FileTree } from "./FileTree"
import { FileViewer } from "./FileViewer"
import { ResizeHandle } from "./ResizeHandle"
import { useLivePlan } from "../_hooks/useLivePlan"

const CHAT_MIN_WIDTH = 320
const CHAT_MAX_WIDTH = 700
const CHAT_DEFAULT_WIDTH = 380

type FeatureLayoutProps = {
  projectId: string
  epicId: string
}

export type ViewMode = "plan" | "code"

export type ActiveFile = {
  path: string
  content: string
}

export function FeatureLayout({ projectId, epicId }: FeatureLayoutProps) {
  const { plan: epic, isLoading, getTicketContent, lastSyncAt, syncStatus, repoOwner, repoName } = useLivePlan(epicId, projectId)
  const [selectedTicketId, setSelectedTicketId] = useState("")
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH)

  const storageKey = `speedy-view-mode-${epicId}`
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "plan"
    const stored = localStorage.getItem(storageKey)
    return (stored === "plan" || stored === "code") ? stored : "plan"
  })

  useEffect(() => {
    localStorage.setItem(storageKey, viewMode)
  }, [storageKey, viewMode])

  // Code mode state
  const [selectedFile, setSelectedFile] = useState<{ path: string; sha: string } | null>(null)
  // TODO: use epic?.branch when branch-per-feature workflow is implemented
  const [branch] = useState("main")

  // Context bridge: track the active file being viewed
  const [activeFile, setActiveFile] = useState<ActiveFile | null>(null)

  const router = useRouter()
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

  // Notify when a file is fully loaded into the viewer
  const handleFileContentLoaded = useCallback((path: string, content: string) => {
    setActiveFile({ path, content })
  }, [])

  // Dismiss active file from ChatInput pill
  const handleDismissActiveFile = useCallback(() => {
    setActiveFile(null)
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
      {/* Left panel: TicketSidebar in Plan mode, slim header in Code mode */}
      {viewMode === "plan" ? (
        <TicketSidebar
          epicTitle={epic.title}
          branch="main"
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
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      ) : (
        /* Code mode: slim top bar with back + title + toggle */
        <div className="flex w-[240px] shrink-0 flex-col border-r border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-3 border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              onClick={() => router.push(`/projects/${projectId}`)}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <FileText className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-semibold truncate flex-1">{epic.title}</span>
            <div className="flex items-center rounded-md border border-border bg-muted/50 p-0.5">
              <button
                onClick={() => setViewMode("plan")}
                className="rounded px-2 py-0.5 text-[11px] font-medium transition-all text-muted-foreground hover:text-foreground"
              >
                Plan
              </button>
              <button
                onClick={() => setViewMode("code")}
                className="rounded px-2 py-0.5 text-[11px] font-medium transition-all bg-background text-foreground shadow-sm"
              >
                Code
              </button>
            </div>
          </div>
          <FileTree
            owner={repoOwner ?? ""}
            repo={repoName ?? ""}
            branch={branch}
            selectedFile={selectedFile?.path ?? undefined}
            onFileSelect={(path, sha) => setSelectedFile({ path, sha })}
          />
        </div>
      )}

      {/* Center panel: PlanViewer in Plan mode, FileViewer in Code mode */}
      {viewMode === "code" ? (
        <div className="relative flex flex-1 overflow-hidden">
          {selectedFile ? (
            <FileViewer
              owner={repoOwner ?? ""}
              repo={repoName ?? ""}
              path={selectedFile.path}
              ref={branch}
              onContentLoaded={handleFileContentLoaded}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Select a file to view
            </div>
          )}
        </div>
      ) : (
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
      )}

      {/* ResizeHandle and ChatPanel always visible */}
      <ResizeHandle onDragStart={handleDragStart} />
      <ChatPanel
        width={chatWidth}
        projectId={projectId}
        epicId={epicId}
        onSendDirectReady={handleSendDirectReady}
        activeFile={activeFile}
        onDismissActiveFile={handleDismissActiveFile}
      />
    </div>
  )
}
