import { KanbanColumn } from "./KanbanColumn"
import { ACTIVE_COLUMNS, STATUS_CONFIG, type Feature } from "../_constants/kanban-config"

type KanbanBoardProps = {
  features: Feature[]
  showCompleted: boolean
  projectId: string
}

export function KanbanBoard({ features, showCompleted, projectId }: KanbanBoardProps) {
  const columns = showCompleted
    ? [...ACTIVE_COLUMNS, "completed" as const]
    : ACTIVE_COLUMNS

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {columns.map((status) => {
        const config = STATUS_CONFIG[status]
        const columnFeatures = features.filter((f) => f.status === status)
        return (
          <KanbanColumn
            key={status}
            status={status}
            label={config.label}
            colorClass={config.colorClass}
            features={columnFeatures}
            projectId={projectId}
          />
        )
      })}
    </div>
  )
}
