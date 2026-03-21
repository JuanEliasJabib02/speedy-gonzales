"use client"

import { Link } from "@/src/i18n/routing"
import type { Project } from "../_constants/mock-data"

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent">
        <h3 className="text-base font-medium">{project.name}</h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {project.description}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          {project.activeFeatures} active · {project.totalFeatures} features · {project.ticketCount} tickets
        </p>
      </div>
    </Link>
  )
}
