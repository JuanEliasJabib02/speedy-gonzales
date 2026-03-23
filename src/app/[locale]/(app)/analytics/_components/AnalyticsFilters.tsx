"use client"

import type { Id } from "@/convex/_generated/dataModel"

type Project = {
  _id: Id<"projects">
  name: string
}

type TimeRange = "week" | "month" | "year"

type AnalyticsFiltersProps = {
  projects: Project[] | undefined
  projectId: Id<"projects"> | null
  onProjectChange: (id: Id<"projects"> | null) => void
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
]

export function AnalyticsFilters({
  projects,
  projectId,
  onProjectChange,
  timeRange,
  onTimeRangeChange,
}: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={projectId ?? ""}
        onChange={(e) => {
          const val = e.target.value
          onProjectChange(val ? (val as Id<"projects">) : null)
        }}
        className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">Select a project</option>
        {projects?.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <div className="flex rounded-md border border-border">
        {TIME_RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTimeRangeChange(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              timeRange === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            } ${opt.value === "week" ? "rounded-l-md" : ""} ${opt.value === "year" ? "rounded-r-md" : ""}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
