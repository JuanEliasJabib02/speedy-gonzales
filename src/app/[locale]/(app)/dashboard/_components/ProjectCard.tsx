"use client"

import { Link } from "@/src/i18n/routing"
import type { Doc } from "@/convex/_generated/dataModel"
import { formatRelativeTime } from "../_helpers/formatRelativeTime"

type ProjectCardProps = {
  project: Doc<"projects">
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project._id}`}>
      <div className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent">
        <h3 className="text-base font-medium">{project.name}</h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {project.description ?? "No description"}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {project.repoOwner}/{project.repoName}
          </span>
          {project.syncStatus === "syncing" && (
            <span className="text-xs text-status-in-progress">Syncing...</span>
          )}
          {project.syncStatus === "error" && (
            <span className="text-xs text-status-blocked">Sync error</span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {project.autonomousLoop ? (
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Loop active
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/40" />
              Loop off
            </span>
          )}

          {project.agentName && (
            <span>
              {project.agentEmoji} {project.agentName}
              {project.agentStatus && project.agentStatus !== "idle" && (
                <> — {project.agentCurrentFeature ?? project.agentStatus}</>
              )}
            </span>
          )}

          {project.lastSyncAt && (
            <span>Synced {formatRelativeTime(project.lastSyncAt)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
