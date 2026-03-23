export type FeatureStatus = "backlog" | "todo" | "in-progress" | "review" | "blocked" | "completed"
export type Priority = "low" | "medium" | "high" | "critical"

export type Feature = {
  id: string
  title: string
  status: FeatureStatus
  progress: number
  ticketCount: number
  priority: Priority
  prUrl?: string
}

export const STATUS_CONFIG: Record<FeatureStatus, { label: string; colorClass: string }> = {
  "backlog": { label: "Backlog", colorClass: "bg-status-backlog" },
  "todo": { label: "Todo", colorClass: "bg-status-todo" },
  "in-progress": { label: "In Progress", colorClass: "bg-status-in-progress" },
  "review": { label: "Review", colorClass: "bg-status-review" },
  "blocked": { label: "Blocked", colorClass: "bg-status-blocked" },
  "completed": { label: "Completed", colorClass: "bg-status-completed" },
}

export const ACTIVE_COLUMNS: FeatureStatus[] = ["todo", "in-progress", "review", "blocked"]
