import { FeatureCard } from "./FeatureCard"
import type { Feature, FeatureStatus } from "../_constants/kanban-config"

type KanbanColumnProps = {
  status: FeatureStatus
  label: string
  colorClass: string
  features: Feature[]
  projectId: string
}

export function KanbanColumn({ status, label, colorClass, features, projectId }: KanbanColumnProps) {
  const isReviewWithItems = status === "review" && features.length > 0

  return (
    <div className="flex w-[280px] min-w-[280px] flex-col rounded-lg bg-card/50 p-3">
      <div className="mb-3 flex items-center gap-2">
        <div className={`size-2 rounded-full ${colorClass}`} />
        <span className="text-sm font-medium">{label}</span>
        <span
          className={`rounded-md px-1.5 py-0.5 text-xs ${
            isReviewWithItems
              ? "bg-status-review/15 text-status-review font-semibold"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {features.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {features.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8">
            <span className="text-xs text-muted-foreground">No features</span>
          </div>
        ) : (
          features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} projectId={projectId} />
          ))
        )}
      </div>
    </div>
  )
}
