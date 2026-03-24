"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { ProjectHeader } from "./_components/ProjectHeader"
import { KanbanBoard } from "./_components/KanbanBoard"

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [showBacklog, setShowBacklog] = useState(true)
  const [showCompleted, setShowCompleted] = useState(false)

  const data = useQuery(api.projects.getProjectWithEpics, {
    projectId: projectId as Id<"projects">,
  })

  if (data === undefined) {
    return (
      <div className="flex h-full flex-col gap-6 p-6">
        {/* Project header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>

        {/* Kanban skeleton */}
        <div className="flex gap-4 overflow-x-auto">
          {["Backlog", "Todo", "In Progress", "Review", "Completed"].map((status) => (
            <div key={status} className="flex min-w-[280px] flex-col gap-3">
              <div className="flex items-center justify-between rounded-t-lg bg-muted/30 px-3 py-2">
                <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-6 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="space-y-3 px-3 pb-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 w-full animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { project, epics } = data
  const backlogCount = epics.filter((e) => e.status === "backlog").length
  const completedCount = epics.filter((e) => e.status === "completed").length

  // Map epics to Feature shape for the board
  const features = epics.map((epic) => ({
    id: epic._id,
    title: epic.title,
    status: epic.status as "backlog" | "todo" | "in-progress" | "review" | "blocked" | "completed",
    progress: epic.ticketCount > 0
      ? Math.round((epic.completedTicketCount / epic.ticketCount) * 100)
      : 0,
    ticketCount: epic.ticketCount,
    priority: epic.priority as "low" | "medium" | "high" | "critical",
    prUrl: epic.prUrl,
  }))

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <ProjectHeader
        projectId={projectId as Id<"projects">}
        projectName={project.name}
        showBacklog={showBacklog}
        onToggleBacklog={() => setShowBacklog((v) => !v)}
        backlogCount={backlogCount}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted((v) => !v)}
        completedCount={completedCount}
        agentName={project.agentName}
        agentEmoji={project.agentEmoji}
        agentStatus={project.agentStatus}
        agentCurrentFeature={project.agentCurrentFeature}
        maxConcurrentPerFeature={project.maxConcurrentPerFeature}
        maxConcurrentGlobal={project.maxConcurrentGlobal}
        autonomousLoop={project.autonomousLoop}
        localPath={project.localPath}
        notificationEnabled={project.notificationEnabled}
        branchPrefix={project.branchPrefix}
        loopStatus={project.loopStatus}
        lastLoopAt={project.lastLoopAt}
      />
      <KanbanBoard features={features} showBacklog={showBacklog} showCompleted={showCompleted} projectId={projectId} />
    </div>
  )
}
