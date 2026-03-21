"use client"

import { Link } from "@/src/i18n/routing"
import type { Feature } from "../_constants/mock-data"

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-status-in-progress/15 text-status-in-progress",
  high: "bg-status-review/15 text-status-review",
  critical: "bg-status-blocked/15 text-status-blocked",
}

type FeatureCardProps = {
  feature: Feature
  projectId: string
}

export function FeatureCard({ feature, projectId }: FeatureCardProps) {
  return (
    <Link href={`/projects/${projectId}/features/${feature.id}`}>
      <div className="cursor-pointer rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <h4 className="text-sm font-medium">{feature.title}</h4>
        <div className="mt-2">
          <div className="h-1 w-full rounded-full bg-muted">
            <div
              className="h-1 rounded-full bg-primary transition-all"
              style={{ width: `${feature.progress}%` }}
            />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {feature.ticketCount} tickets
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${PRIORITY_STYLES[feature.priority]}`}>
            {feature.priority}
          </span>
        </div>
      </div>
    </Link>
  )
}
