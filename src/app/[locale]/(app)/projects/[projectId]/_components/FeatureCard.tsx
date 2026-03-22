"use client"

import { useState } from "react"
import { Play, Square, Loader2 } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Link } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import type { Feature } from "../_constants/kanban-config"

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-status-in-progress/15 text-status-in-progress",
  high: "bg-status-review/15 text-status-review",
  critical: "bg-status-blocked/15 text-status-blocked",
}

type FeatureCardProps = {
  feature: Feature
  projectId: string
}

export function FeatureCard({ feature, projectId }: FeatureCardProps) {
  const updateStatus = useMutation(api.epics.updateStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const showStart = feature.status === "todo" || feature.status === "blocked"
  const showStop = feature.status === "in-progress"

  const handleStatusChange = async (
    e: React.MouseEvent,
    newStatus: string,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsUpdating(true)
    try {
      await updateStatus({
        epicId: feature.id as Id<"epics">,
        status: newStatus,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Link href={`/projects/${projectId}/features/${feature.id}`}>
      <div className="cursor-pointer rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium">{feature.title}</h4>
          {showStart && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-status-in-progress hover:bg-status-in-progress/15"
              disabled={isUpdating}
              onClick={(e) => handleStatusChange(e, "in-progress")}
            >
              {isUpdating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5" />
              )}
            </Button>
          )}
          {showStop && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-status-blocked hover:bg-status-blocked/15"
              disabled={isUpdating}
              onClick={(e) => handleStatusChange(e, "todo")}
            >
              {isUpdating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Square className="size-3.5" />
              )}
            </Button>
          )}
        </div>
        <div className="mt-2">
          <div className="h-1 w-full rounded-full bg-muted">
            <div
              className="h-1 rounded-full bg-primary transition-all"
              style={{ width: `${feature.progress}%` }}
            />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {feature.ticketCount} tickets
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${PRIORITY_STYLES[feature.priority]}`}>
            {feature.priority}
          </span>
        </div>
      </div>
    </Link>
  )
}
