"use client"

import { Archive, ArrowLeft, Bot, CheckCircle2 } from "lucide-react"
import type { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
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
  agentName?: string
  agentEmoji?: string
  agentStatus?: string
  agentCurrentFeature?: string
  maxConcurrentPerFeature?: number
  maxConcurrentGlobal?: number
  autonomousLoop?: boolean
  localPath?: string
  notificationEnabled?: boolean
  branchPrefix?: string
  loopStatus?: string
  lastLoopAt?: number
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
  agentName,
  agentEmoji,
  agentStatus,
  agentCurrentFeature,
  maxConcurrentPerFeature,
  maxConcurrentGlobal,
  autonomousLoop,
  localPath,
  notificationEnabled,
  branchPrefix,
  loopStatus,
  lastLoopAt,
}: ProjectHeaderProps) {
  const router = useRouter()

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
          <ConcurrencySettings
            projectId={projectId}
            maxConcurrentPerFeature={maxConcurrentPerFeature ?? 3}
            maxConcurrentGlobal={maxConcurrentGlobal ?? 5}
            autonomousLoop={autonomousLoop ?? false}
            localPath={localPath ?? ""}
            notificationEnabled={notificationEnabled ?? false}
            branchPrefix={branchPrefix ?? "feat/"}
          />
        </div>
      </div>
    </>
  )
}
