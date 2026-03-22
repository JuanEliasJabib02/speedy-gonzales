"use client"

import { useEffect, useState } from "react"
import { cn } from "@/src/lib/helpers/cn"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/lib/components/ui/tooltip"

type LoopStatusIndicatorProps = {
  loopStatus?: string
  lastLoopAt?: number
}

function useRelativeTime(timestamp?: number) {
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!timestamp) return

    const update = () => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000)
      if (seconds < 60) setLabel("just now")
      else if (seconds < 3600) setLabel(`${Math.floor(seconds / 60)}m ago`)
      else if (seconds < 86400) setLabel(`${Math.floor(seconds / 3600)}h ago`)
      else setLabel(`${Math.floor(seconds / 86400)}d ago`)
    }
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [timestamp])

  return label
}

export function LoopStatusIndicator({ loopStatus, lastLoopAt }: LoopStatusIndicatorProps) {
  const lastRun = useRelativeTime(lastLoopAt)

  const isRunning = loopStatus === "running"
  const isError = loopStatus === "error"

  const dotColor = isError
    ? "bg-destructive"
    : isRunning
      ? "bg-emerald-500"
      : "bg-emerald-500/60"

  const statusLabel = isError ? "Error" : isRunning ? "Running" : "Idle"

  const content = (
    <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-xs">
      <span
        className={cn(
          "inline-block size-2 rounded-full",
          dotColor,
          isRunning && "animate-pulse",
        )}
      />
      <span className={cn("font-medium", isError && "text-destructive")}>
        {statusLabel}
      </span>
      {lastRun && !isRunning && (
        <span className="text-muted-foreground">{lastRun}</span>
      )}
    </div>
  )

  if (isError) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent>
            <p>Last loop run failed</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}
