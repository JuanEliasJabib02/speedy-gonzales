import { FeatureCard } from "./FeatureCard"
import type { Feature } from "../_constants/mock-data"

type KanbanColumnProps = {
  label: string
  colorClass: string
  features: Feature[]
  projectId: string
}

export function KanbanColumn({ label, colorClass, features, projectId }: KanbanColumnProps) {
  return (
    <div className="flex min-w-[260px] flex-col rounded-lg bg-card/50 p-3">
      <div className="mb-3 flex items-center gap-2">
        <div className={`size-2 rounded-full ${colorClass}`} />
        <span className="text-sm font-medium">{label}</span>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {features.length}
        </span>
      </div>
      <div className="flex flex-col gap-3">
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
