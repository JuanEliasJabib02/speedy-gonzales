"use client"

import { useState } from "react"
import { Check, Play, Square, Loader2, Github, Trash2 } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Link } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/lib/components/ui/dialog"
import type { Feature } from "../_constants/kanban-config"
import { PRIORITY_STYLES } from "@/src/lib/constants/status-styles"

type FeatureCardProps = {
  feature: Feature
  projectId: string
}

export function FeatureCard({ feature, projectId }: FeatureCardProps) {
  const updateStatus = useMutation(api.epics.updateStatus)
  const deleteEpic = useMutation(api.epics.deleteEpic)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const showStart = feature.status === "todo" || feature.status === "blocked"
  const showStop = feature.status === "in-progress"
  const showApprove = feature.status === "review"

  const handleStatusChange = async (
    e: React.MouseEvent,
    newStatus: "todo" | "in-progress" | "review" | "completed" | "blocked",
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsUpdating(true)
    try {
      await updateStatus({
        epicId: feature.id,
        status: newStatus,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await deleteEpic({ epicId: feature.id })
      setShowDeleteDialog(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Link href={`/projects/${projectId}/features/${feature.id}`}>
        <div className="cursor-pointer rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium">{feature.title}</h4>
            <div className="flex items-center gap-1">
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
              {showApprove && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-status-completed hover:bg-status-completed/15"
                  disabled={isUpdating}
                  onClick={(e) => handleStatusChange(e, "completed")}
                >
                  {isUpdating ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-destructive hover:bg-destructive/15"
                disabled={isUpdating || isDeleting}
                onClick={handleDeleteClick}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
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
          <div className="flex items-center gap-1.5">
            {feature.status === "review" && feature.prUrl && (
              <a
                href={feature.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="size-3.5" />
              </a>
            )}
            <span className={`rounded-full px-2 py-0.5 text-xs ${PRIORITY_STYLES[feature.priority]}`}>
              {feature.priority}
            </span>
          </div>
        </div>
      </div>
      </Link>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feature</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{feature.title}"? This will also delete all {feature.ticketCount} tickets in this feature. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Feature'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
