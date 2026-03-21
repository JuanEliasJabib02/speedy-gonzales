type ChecklistProgressProps = {
  completed: number
  total: number
}

export function ChecklistProgress({ completed, total }: ChecklistProgressProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        {completed}/{total} tasks done
      </span>
      <div className="h-1.5 flex-1 rounded-full bg-muted">
        <div
          className="h-1.5 rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
