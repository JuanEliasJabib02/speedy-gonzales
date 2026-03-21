import { ChecklistProgress } from "./ChecklistProgress"
import type { TicketStatus } from "../_constants/mock-data"

const STATUS_PILL: Record<string, string> = {
  "todo": "bg-status-todo/15 text-status-todo",
  "in-progress": "bg-status-in-progress/15 text-status-in-progress",
  "review": "bg-status-review/15 text-status-review",
  "completed": "bg-status-completed/15 text-status-completed",
}

const PRIORITY_PILL: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-status-in-progress/15 text-status-in-progress",
  high: "bg-status-review/15 text-status-review",
  critical: "bg-status-blocked/15 text-status-blocked",
}

type PlanViewerProps = {
  title: string
  status: TicketStatus
  priority: string
  content: string
  checklist: { total: number; completed: number }
}

export function PlanViewer({ title, status, priority, content, checklist }: PlanViewerProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6 scrollbar-thin">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_PILL[status] ?? STATUS_PILL.todo}`}>
          {status}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${PRIORITY_PILL[priority] ?? PRIORITY_PILL.medium}`}>
          {priority}
        </span>
      </div>

      {checklist.total > 0 && (
        <ChecklistProgress completed={checklist.completed} total={checklist.total} />
      )}

      <div className="my-4 border-t border-border" />

      <div className="max-w-none">
        {content.split("\n").map((line, i) => {
          const key = `line-${i}`
          if (line.startsWith("## ")) return <h2 key={key} className="mt-6 mb-2 text-lg font-semibold text-foreground">{line.replace("## ", "")}</h2>
          if (line.startsWith("### ")) return <h3 key={key} className="mt-4 mb-1 text-base font-medium text-foreground">{line.replace("### ", "")}</h3>
          if (line.startsWith("- [x] ")) return (
            <label key={key} className="flex items-center gap-2 py-0.5 text-sm text-muted-foreground">
              <input type="checkbox" checked readOnly className="size-4 rounded accent-primary" />
              <span className="line-through">{line.replace("- [x] ", "")}</span>
            </label>
          )
          if (line.startsWith("- [ ] ")) return (
            <label key={key} className="flex items-center gap-2 py-0.5 text-sm text-foreground">
              <input type="checkbox" readOnly className="size-4 rounded accent-primary" />
              {line.replace("- [ ] ", "")}
            </label>
          )
          if (line.startsWith("- **")) {
            const match = line.match(/^- \*\*(.+?)\*\*(.*)$/)
            if (match) return (
              <li key={key} className="ml-4 list-disc py-0.5 text-sm text-foreground">
                <strong>{match[1]}</strong>{match[2]}
              </li>
            )
          }
          if (line.startsWith("- ")) return <li key={key} className="ml-4 list-disc py-0.5 text-sm text-foreground">{line.replace("- ", "")}</li>
          if (line.trim() === "") return <div key={key} className="h-2" />
          return <p key={key} className="text-sm text-foreground leading-relaxed">{line}</p>
        })}
      </div>
    </div>
  )
}
