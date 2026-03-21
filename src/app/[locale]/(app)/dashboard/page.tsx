"use client"

import { useState } from "react"
import { DashboardHeader } from "./_components/DashboardHeader"
import { ProjectCard } from "./_components/ProjectCard"
import { CreateProjectDialog } from "./_components/CreateProjectDialog"
import { EmptyState } from "./_components/EmptyState"
import { MOCK_PROJECTS } from "./_constants/mock-data"

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const projects = MOCK_PROJECTS

  return (
    <div className="p-6">
      <DashboardHeader onCreateProject={() => setDialogOpen(true)} />

      {projects.length === 0 ? (
        <EmptyState onCreateProject={() => setDialogOpen(true)} />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
