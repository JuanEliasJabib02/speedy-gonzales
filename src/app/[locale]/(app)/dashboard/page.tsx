"use client"

import { DashboardHeader } from "./_components/DashboardHeader"
import { ProjectCard } from "./_components/ProjectCard"
import { CreateProjectDialog } from "./_components/CreateProjectDialog"
import { EmptyState } from "./_components/EmptyState"
import { useDashboard } from "./_hooks/useDashboard"

export default function DashboardPage() {
  const { projects, dialogOpen, setDialogOpen } = useDashboard()

  if (projects === undefined) {
    return (
      <div className="p-6">
        <DashboardHeader onCreateProject={() => setDialogOpen(true)} />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <DashboardHeader onCreateProject={() => setDialogOpen(true)} />

      {projects.length === 0 ? (
        <EmptyState onCreateProject={() => setDialogOpen(true)} />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
