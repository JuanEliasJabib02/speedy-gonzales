"use client"

import { useState, useCallback, useRef } from "react"
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

export function FeatureLayout({ projectId, epicId }: FeatureLayoutProps) {
  const { plan: epic, getTicketContent } = useLivePlan(epicId)
  const [selectedTicketId, setSelectedTicketId] = useState(epic.tickets[0]?.id ?? "_context")
  const [chatWidth, setChatWidth] = useState(CHAT_DEFAULT_WIDTH)
  const isDragging = useRef(false)

  const selectedTicket = epic.tickets.find((t) => t.id === selectedTicketId)
  const ticketData = getTicketContent(selectedTicketId)

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

  return (
    <div className="flex h-full">
      <TicketSidebar
        epicTitle={epic.title}
        tickets={epic.tickets}
        selectedId={selectedTicketId}
        onSelect={setSelectedTicketId}
        projectId={projectId}
      />
      <PlanViewer
        title={selectedTicket?.title ?? epic.title}
        status={selectedTicket?.status ?? epic.status}
        priority={epic.priority}
        content={ticketData.content}
        checklist={ticketData.checklist}
      />
      <ResizeHandle onDragStart={handleDragStart} />
      <ChatPanel width={chatWidth} messages={epic.chatMessages} />
    </div>
  )
}
