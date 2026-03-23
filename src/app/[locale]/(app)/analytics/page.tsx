"use client"

import { useAnalytics } from "./_hooks/useAnalytics"
import { AnalyticsDashboard } from "./_components/AnalyticsDashboard"

export default function AnalyticsPage() {
  const analytics = useAnalytics()

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <AnalyticsDashboard
        projects={analytics.projects}
        projectId={analytics.projectId}
        onProjectChange={analytics.setProjectId}
        timeRange={analytics.timeRange}
        onTimeRangeChange={analytics.setTimeRange}
        ticketAnalytics={analytics.ticketAnalytics}
        ticketsByDay={analytics.ticketsByDay}
        resolutionTrend={analytics.resolutionTrend}
        loopHealth={analytics.loopHealth}
        isLoading={analytics.isLoading}
        hasData={analytics.hasData}
      />
    </div>
  )
}
