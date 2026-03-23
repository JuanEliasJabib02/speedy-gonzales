"use client"

import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

type TimeRange = "week" | "month" | "year"

function getDateRange(range: TimeRange): { from: number; to: number } {
  const now = Date.now()
  const day = 86_400_000

  switch (range) {
    case "week":
      return { from: now - 7 * day, to: now }
    case "month":
      return { from: now - 30 * day, to: now }
    case "year":
      return { from: now - 365 * day, to: now }
  }
}

export function useAnalytics() {
  const [projectId, setProjectId] = useState<Id<"projects"> | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>("week")

  const projects = useQuery(api.projects.getProjects)
  const { from, to } = useMemo(() => getDateRange(timeRange), [timeRange])

  const queryArgs = projectId ? { projectId, from, to } : "skip" as const

  const ticketAnalytics = useQuery(api.analytics.getTicketAnalytics, queryArgs)
  const ticketsByDay = useQuery(api.analytics.getTicketsByDay, queryArgs)
  const resolutionTrend = useQuery(api.analytics.getResolutionTimeTrend, queryArgs)
  const loopHealth = useQuery(api.analytics.getLoopHealthStats, queryArgs)

  const isLoading = projectId !== null && (
    ticketAnalytics === undefined ||
    ticketsByDay === undefined ||
    resolutionTrend === undefined ||
    loopHealth === undefined
  )

  const hasData = ticketAnalytics !== undefined && ticketAnalytics !== null && ticketAnalytics.totalCompleted > 0

  return {
    projects,
    projectId,
    setProjectId,
    timeRange,
    setTimeRange,
    ticketAnalytics,
    ticketsByDay,
    resolutionTrend,
    loopHealth,
    isLoading,
    hasData,
  }
}
