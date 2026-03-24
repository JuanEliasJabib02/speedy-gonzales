"use client"

import { Github, Trash2, ArrowUpToLine, CheckCircle } from "lucide-react"
import { Link } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import type { Feature } from "../_constants/kanban-config"
import { PRIORITY_STYLES } from "@/src/lib/constants/status-styles"
import { useFeatureCard } from "../_hooks/useFeatureCard"
import { FeatureDeleteDialog } from "./FeatureDeleteDialog"

type FeatureCardProps = {
  feature: Feature
  projectId: string
}

export function FeatureCard({ feature, projectId }: FeatureCardProps) {
  const {
    showDeleteDialog,
    setShowDeleteDialog,
    handlePromote,
    handleApprove,
    handleDeleteClick,
    handleDeleteConfirm,
  } = useFeatureCard(feature, projectId)

  return (
    <>
      <Link href={`/projects/${projectId}/features/${feature.id}`}>
        <div className="cursor-pointer rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium">{feature.title}</h4>
            <div className="flex items-center gap-1">
              {feature.status === "review" && feature.prUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(feature.prUrl, "_blank", "noopener,noreferrer")
                  }}
                >
                  <Github className="size-3.5" />
                </Button>
              )}
              {feature.status === "backlog" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-primary hover:bg-primary/15"
                  onClick={handlePromote}
                >
                  <ArrowUpToLine className="size-3.5" />
                </Button>
              )}
              {feature.status === "review" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-green-600 hover:bg-green-600/15"
                  onClick={handleApprove}
                >
                  <CheckCircle className="size-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-destructive hover:bg-destructive/15"
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
            <span className="text-xs text-muted-foreground">{feature.ticketCount} tickets</span>
            <div className="flex items-center gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-xs ${PRIORITY_STYLES[feature.priority]}`}>
                {feature.priority}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <FeatureDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        featureTitle={feature.title}
        ticketCount={feature.ticketCount}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
