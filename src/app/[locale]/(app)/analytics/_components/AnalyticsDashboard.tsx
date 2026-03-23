"use client"

import { Clock, CheckCircle, Shield, Hash } from "lucide-react"
import type { Id } from "@/convex/_generated/dataModel"
import { formatResolutionTime } from "../_helpers/formatResolutionTime"
import { StatCard } from "./StatCard"
import { AnalyticsFilters } from "./AnalyticsFilters"
import { TicketsBarChart } from "./TicketsBarChart"
import { ResolutionLineChart } from "./ResolutionLineChart"
import { LoopHealthSection } from "./LoopHealthSection"

type Project = {
  _id: Id<"projects">
  name: string
}

type TicketAnalytics = {
  totalCompleted: number
  cleanApprovals: number
  withFixes: number
  blocked: number
  avgResolutionTimeMs: number
  qualityRate: number
  successRate: number
}

type DayData = {
  date: string
  clean: number
  withFixes: number
  blocked: number
}

type TrendPoint = {
  date: string
  avgMs: number
}

type LoopHealthData = {
  totalCycles: number
  activeCycles: number
  idleCycles: number
  rateLimitHits: number
  modelBreakdown: { opus: number; sonnet: number }
}

type TimeRange = "week" | "month" | "year"

type AnalyticsDashboardProps = {
  projects: Project[] | undefined
  projectId: Id<"projects"> | null
  onProjectChange: (id: Id<"projects"> | null) => void
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  ticketAnalytics: TicketAnalytics | undefined | null
  ticketsByDay: DayData[] | undefined
  resolutionTrend: TrendPoint[] | undefined
  loopHealth: LoopHealthData | undefined
  isLoading: boolean
  hasData: boolean
}

function getQualityAccent(rate: number): "success" | "warning" | "destructive" {
  if (rate >= 80) return "success"
  if (rate >= 50) return "warning"
  return "destructive"
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-7 w-16 animate-pulse rounded bg-muted" />
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="flex h-[340px] items-center justify-center rounded-lg border border-border bg-card">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
    </div>
  )
}

export function AnalyticsDashboard({
  projects,
  projectId,
  onProjectChange,
  timeRange,
  onTimeRangeChange,
  ticketAnalytics,
  ticketsByDay,
  resolutionTrend,
  loopHealth,
  isLoading,
  hasData,
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-foreground">Analytics</h1>
        <AnalyticsFilters
          projects={projects}
          projectId={projectId}
          onProjectChange={onProjectChange}
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      </div>

      {!projectId && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
          Select a project to view analytics
        </div>
      )}

      {projectId && isLoading && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        </>
      )}

      {projectId && !isLoading && !hasData && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card text-center text-sm text-muted-foreground">
          No analytics data yet. The loop will start collecting data on the next cycle.
        </div>
      )}

      {projectId && !isLoading && hasData && ticketAnalytics && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Avg Resolution Time"
              value={formatResolutionTime(ticketAnalytics.avgResolutionTimeMs)}
              icon={Clock}
            />
            <StatCard
              label="Quality Rate"
              value={`${Math.round(ticketAnalytics.qualityRate)}%`}
              icon={Shield}
              accent={getQualityAccent(ticketAnalytics.qualityRate)}
            />
            <StatCard
              label="Success Rate"
              value={`${Math.round(ticketAnalytics.successRate)}%`}
              icon={CheckCircle}
              accent={ticketAnalytics.successRate >= 80 ? "success" : "warning"}
            />
            <StatCard
              label="Total Processed"
              value={String(ticketAnalytics.totalCompleted + ticketAnalytics.blocked)}
              icon={Hash}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TicketsBarChart data={ticketsByDay} />
            <ResolutionLineChart data={resolutionTrend} />
          </div>

          <LoopHealthSection data={loopHealth} />
        </>
      )}
    </div>
  )
}
