"use client"

import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react"
import { useRouter } from "@/src/i18n/routing"
import { Button } from "@/src/lib/components/ui/button"
import { cn } from "@/src/lib/helpers/cn"

type ProjectHeaderProps = {
  projectName: string
  showCompleted: boolean
  onToggleCompleted: () => void
  completedCount: number
}

export function ProjectHeader({
  projectName,
  showCompleted,
  onToggleCompleted,
  completedCount,
}: ProjectHeaderProps) {
  const router = useRouter()

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
        <Button variant="secondary" size="sm">
          <RefreshCw className="size-4" />
          Sync now
        </Button>
      </div>
    </div>
  )
}
