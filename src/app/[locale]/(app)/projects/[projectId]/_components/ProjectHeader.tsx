"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, ArrowLeft, CheckCircle2, Github, RefreshCw } from "lucide-react"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/lib/components/ui/dialog"
import { cn } from "@/src/lib/helpers/cn"

type ProjectHeaderProps = {
  projectId: Id<"projects">
  projectName: string
  showCompleted: boolean
  onToggleCompleted: () => void
  completedCount: number
  syncStatus: string
  lastSyncAt?: number
}

function useSyncTimer(lastSyncAt?: number) {
  const [secondsAgo, setSecondsAgo] = useState<number | null>(null)

  useEffect(() => {
    if (!lastSyncAt) return

    const update = () => setSecondsAgo(Math.floor((Date.now() - lastSyncAt) / 1000))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [lastSyncAt])

  return secondsAgo
}

function formatSyncAge(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}

export function ProjectHeader({
  projectId,
  projectName,
  showCompleted,
  onToggleCompleted,
  completedCount,
  syncStatus,
  lastSyncAt,
}: ProjectHeaderProps) {
  const router = useRouter()
  const syncProject = useAction(api.githubSync.syncProject)
  const isSyncing = syncStatus === "syncing"
  const secondsAgo = useSyncTimer(lastSyncAt)
  const [showSyncDialog, setShowSyncDialog] = useState(false)

  const handleSync = () => {
    setShowSyncDialog(false)
    syncProject({ projectId })
  }

  return (
    <>
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
          {secondsAgo !== null && !isSyncing && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Github className="size-3.5" />
              <span>{formatSyncAge(secondsAgo)}</span>
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            disabled={isSyncing}
            onClick={() => setShowSyncDialog(true)}
          >
            <RefreshCw className={cn("size-4", isSyncing && "animate-spin")} />
            {isSyncing ? "Syncing..." : "Sync now"}
          </Button>
        </div>
      </div>

      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-yellow-500" />
              Sync from GitHub
            </DialogTitle>
            <DialogDescription>
              This will overwrite your current data in Speedy with whatever is on GitHub.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>
              If you edited plan files locally but <strong className="text-foreground">haven&apos;t pushed yet</strong>,
              those changes will be lost — the sync reads from GitHub, not your local files.
            </p>
            <p>
              Make sure you ran <code className="rounded bg-muted px-1.5 py-0.5">git push</code> before continuing.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSyncDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSync}>
              <Github className="size-4" />
              Sync now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
