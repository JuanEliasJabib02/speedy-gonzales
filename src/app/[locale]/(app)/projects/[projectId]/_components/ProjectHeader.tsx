"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Archive, ArrowLeft, Bot, CheckCircle2, ExternalLink, Github, RefreshCw } from "lucide-react"
import { useMutation } from "convex/react"
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
import { ConcurrencySettings } from "./ConcurrencySettings"
import { LoopStatusIndicator } from "./LoopStatusIndicator"

type ProjectHeaderProps = {
  projectId: Id<"projects">
  projectName: string
  showBacklog: boolean
  onToggleBacklog: () => void
  backlogCount: number
  showCompleted: boolean
  onToggleCompleted: () => void
  completedCount: number
  syncStatus: string
  lastSyncAt?: number
  agentName?: string
  agentEmoji?: string
  agentStatus?: string
  agentCurrentFeature?: string
  maxConcurrentPerFeature?: number
  maxConcurrentGlobal?: number
  autonomousLoop?: boolean
  localPath?: string
  notificationEnabled?: boolean
  loopStatus?: string
  lastLoopAt?: number
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
  showBacklog,
  onToggleBacklog,
  backlogCount,
  showCompleted,
  onToggleCompleted,
  completedCount,
  syncStatus,
  lastSyncAt,
  agentName,
  agentEmoji,
  agentStatus,
  agentCurrentFeature,
  maxConcurrentPerFeature,
  maxConcurrentGlobal,
  autonomousLoop,
  localPath,
  notificationEnabled,
  loopStatus,
  lastLoopAt,
}: ProjectHeaderProps) {
  const router = useRouter()
  const forceResync = useMutation(api.githubSync.forceResync)
  const isSyncing = syncStatus === "syncing"
  const secondsAgo = useSyncTimer(lastSyncAt)
  const [showSyncDialog, setShowSyncDialog] = useState(false)

  const handleSync = () => {
    setShowSyncDialog(false)
    forceResync({ projectId })
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-semibold">{projectName}</h1>
        <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-2.5 py-1 text-sm">
          <Bot className="size-3.5 text-muted-foreground" />
          {agentName ? (
            <>
              <span className={cn(agentStatus === "working" && "animate-pulse")}>
                {agentEmoji}
              </span>
              <span className="font-medium">{agentName}</span>
              {agentStatus === "working" && agentCurrentFeature && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-status-in-progress">
                    {agentCurrentFeature}
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="text-muted-foreground/60">No agent</span>
          )}
        </div>
        {autonomousLoop && (
          <LoopStatusIndicator loopStatus={loopStatus} lastLoopAt={lastLoopAt} />
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={showBacklog ? "secondary" : "ghost"}
            size="sm"
            onClick={onToggleBacklog}
            className={cn("gap-2", showBacklog && "text-status-backlog")}
          >
            <Archive className="size-4" />
            Backlog ({backlogCount})
          </Button>
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
          <ConcurrencySettings
            projectId={projectId}
            maxConcurrentPerFeature={maxConcurrentPerFeature ?? 3}
            maxConcurrentGlobal={maxConcurrentGlobal ?? 5}
            autonomousLoop={autonomousLoop ?? false}
            localPath={localPath ?? ""}
            notificationEnabled={notificationEnabled ?? false}
          />
        </div>
      </div>

      <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">
              Manual Sync — Danger Zone
            </DialogTitle>
            <DialogDescription className="text-center">
              This will <strong className="text-destructive">overwrite all plan data</strong> in Speedy
              with whatever is currently on GitHub.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="font-medium text-destructive">
              Unpushed changes will be lost forever.
            </p>
            <p className="text-muted-foreground">
              The sync engine reads from GitHub, not your local files.
              If you edited any <code className="rounded bg-muted px-1.5 py-0.5">plans/</code> files
              and haven&apos;t pushed yet, that work will be overwritten.
            </p>
            <p className="font-medium text-foreground">
              Run <code className="rounded bg-muted px-1.5 py-0.5">git push</code> before continuing.
            </p>
            <a
              href="/docs/sync#faq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Learn more in the docs
              <ExternalLink className="size-3" />
            </a>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSyncDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSync}>
              <AlertTriangle className="size-4" />
              I pushed — Sync now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
