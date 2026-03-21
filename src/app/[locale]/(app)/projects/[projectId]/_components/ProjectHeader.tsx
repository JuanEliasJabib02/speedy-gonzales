"use client"

import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import { cn } from "@/src/lib/helpers/cn"

type ProjectHeaderProps = {
  projectId: Id<"projects">
  projectName: string
  showCompleted: boolean
  onToggleCompleted: () => void
  completedCount: number
  syncStatus: string
}

export function ProjectHeader({
  projectId,
  projectName,
  showCompleted,
  onToggleCompleted,
  completedCount,
  syncStatus,
}: ProjectHeaderProps) {
  const router = useRouter()
  const syncProject = useAction(api.githubSync.syncProject)
  const isSyncing = syncStatus === "syncing"

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="size-4" />
      </Button>
      <h1 className="text-2xl font-semibold">{projectName}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant={showCompleted ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleCompleted}
          className={cn("gap-2", showCompleted && "text-status-completed")}
        >
          <CheckCircle2 className="size-4" />
          Completed ({completedCount})
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={isSyncing}
          onClick={() => syncProject({ projectId })}
        >
          <RefreshCw className={cn("size-4", isSyncing && "animate-spin")} />
          {isSyncing ? "Syncing..." : "Sync now"}
        </Button>
      </div>
    </div>
  )
}
