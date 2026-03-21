"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ProjectHeader } from "./_components/ProjectHeader"
import { KanbanBoard } from "./_components/KanbanBoard"
import { MOCK_FEATURES, PROJECT_NAME } from "./_constants/mock-data"

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [showCompleted, setShowCompleted] = useState(false)
  const completedCount = MOCK_FEATURES.filter((f) => f.status === "completed").length

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <ProjectHeader
        projectName={PROJECT_NAME}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted((v) => !v)}
        completedCount={completedCount}
      />
      <KanbanBoard features={MOCK_FEATURES} showCompleted={showCompleted} projectId={projectId} />
    </div>
  )
}
