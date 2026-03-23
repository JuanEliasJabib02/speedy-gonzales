"use client"

import { Activity, Pause, AlertTriangle, RotateCcw } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { StatCard } from "./StatCard"

type LoopHealthData = {
  totalCycles: number
  activeCycles: number
  idleCycles: number
  rateLimitHits: number
  modelBreakdown: { opus: number; sonnet: number }
}

type LoopHealthSectionProps = {
  data: LoopHealthData | undefined
}

export function LoopHealthSection({ data }: LoopHealthSectionProps) {
  if (!data) return null

  const modelData = [
    { name: "Opus", count: data.modelBreakdown.opus },
    { name: "Sonnet", count: data.modelBreakdown.sonnet },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">Loop Health</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Cycles"
          value={String(data.totalCycles)}
          icon={RotateCcw}
        />
        <StatCard
          label="Active Cycles"
          value={String(data.activeCycles)}
          icon={Activity}
          accent="success"
        />
        <StatCard
          label="Idle Cycles"
          value={String(data.idleCycles)}
          icon={Pause}
        />
        <StatCard
          label="Rate Limit Hits"
          value={String(data.rateLimitHits)}
          icon={AlertTriangle}
          accent={data.rateLimitHits > 0 ? "warning" : "default"}
        />
      </div>

      {(data.modelBreakdown.opus > 0 || data.modelBreakdown.sonnet > 0) && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="mb-3 text-xs font-medium text-muted-foreground">Model Usage</h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={modelData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 11%)",
                  border: "1px solid hsl(0 0% 16%)",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" name="Cycles" fill="hsl(220 80% 60%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
