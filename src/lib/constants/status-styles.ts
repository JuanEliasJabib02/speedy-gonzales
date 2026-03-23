export const STATUS_PILL: Record<string, string> = {
  blocked: "bg-status-blocked/15 text-status-blocked",
  todo: "bg-status-todo/15 text-status-todo",
  "in-progress": "bg-status-in-progress/15 text-status-in-progress",
  review: "bg-status-review/15 text-status-review",
  completed: "bg-status-completed/15 text-status-completed",
}

export const STATUS_DOT: Record<string, string> = {
  blocked: "bg-status-blocked",
  todo: "bg-status-todo",
  "in-progress": "bg-status-in-progress",
  review: "bg-status-review",
  completed: "bg-status-completed",
}

export const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-status-in-progress/15 text-status-in-progress",
  high: "bg-status-review/15 text-status-review",
  critical: "bg-status-blocked/15 text-status-blocked",
}
