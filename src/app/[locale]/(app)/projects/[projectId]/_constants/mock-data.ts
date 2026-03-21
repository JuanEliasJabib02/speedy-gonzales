export type FeatureStatus = "todo" | "in-progress" | "review" | "blocked" | "completed"
export type Priority = "low" | "medium" | "high" | "critical"

export type Feature = {
  id: string
  title: string
  status: FeatureStatus
  progress: number
  ticketCount: number
  priority: Priority
}

export const PROJECT_NAME = "Speedy Gonzales"

export const STATUS_CONFIG: Record<FeatureStatus, { label: string; colorClass: string }> = {
  "todo": { label: "Todo", colorClass: "bg-status-todo" },
  "in-progress": { label: "In Progress", colorClass: "bg-status-in-progress" },
  "review": { label: "Review", colorClass: "bg-status-review" },
  "blocked": { label: "Blocked", colorClass: "bg-status-blocked" },
  "completed": { label: "Completed", colorClass: "bg-status-completed" },
}

export const ACTIVE_COLUMNS: FeatureStatus[] = ["todo", "in-progress", "review", "blocked"]

export const MOCK_FEATURES: Feature[] = [
  { id: "01-auth", title: "Auth", status: "completed", progress: 100, ticketCount: 6, priority: "critical" },
  { id: "02-projects", title: "Projects", status: "in-progress", progress: 30, ticketCount: 5, priority: "high" },
  { id: "03-dashboard", title: "Dashboard", status: "in-progress", progress: 40, ticketCount: 4, priority: "high" },
  { id: "04-github-sync", title: "GitHub Sync", status: "todo", progress: 0, ticketCount: 7, priority: "critical" },
  { id: "05-kanban", title: "Kanban", status: "in-progress", progress: 50, ticketCount: 4, priority: "high" },
  { id: "06-feature-view", title: "Feature View", status: "in-progress", progress: 40, ticketCount: 6, priority: "high" },
  { id: "07-plan-viewer", title: "Plan Viewer", status: "in-progress", progress: 20, ticketCount: 3, priority: "medium" },
  { id: "08-chat", title: "OpenClaw Chat", status: "todo", progress: 0, ticketCount: 5, priority: "medium" },
]
