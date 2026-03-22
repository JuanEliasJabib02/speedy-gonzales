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
  const [showCompleted, setShowCompleted] = useState(false)

  const project = useQuery(api.projects.getProject, {
    projectId: projectId as Id<"projects">,
  })
  const epics = useQuery(api.epics.getByProject, {
    projectId: projectId as Id<"projects">,
  })

  if (project === undefined || epics === undefined) {
    return (
      <div className="flex h-full flex-col gap-6 p-6">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 min-w-[260px] animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  const completedCount = epics.filter((e) => e.status === "completed").length

  // Map epics to Feature shape for the board
  const features = epics.map((epic) => ({
    id: epic._id,
    title: epic.title,
    status: epic.status as "todo" | "in-progress" | "review" | "blocked" | "completed",
    progress: epic.ticketCount > 0
      ? Math.round((epic.completedTicketCount / epic.ticketCount) * 100)
      : 0,
    ticketCount: epic.ticketCount,
    priority: epic.priority as "low" | "medium" | "high" | "critical",
  }))

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <ProjectHeader
        projectId={projectId as Id<"projects">}
        projectName={project.name}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted((v) => !v)}
        completedCount={completedCount}
        syncStatus={project.syncStatus}
        lastSyncAt={project.lastSyncAt}
        agentName={project.agentName}
        agentEmoji={project.agentEmoji}
        agentStatus={project.agentStatus}
        agentCurrentFeature={project.agentCurrentFeature}
        maxConcurrentPerFeature={project.maxConcurrentPerFeature}
        maxConcurrentGlobal={project.maxConcurrentGlobal}
      />
      <KanbanBoard features={features} showCompleted={showCompleted} projectId={projectId} />
    </div>
  )
}
