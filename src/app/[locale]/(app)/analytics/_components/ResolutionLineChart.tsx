"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatResolutionTime } from "../_helpers/formatResolutionTime"

type TrendPoint = {
  date: string
  avgMs: number
}

type ResolutionLineChartProps = {
  data: TrendPoint[] | undefined
}

export function ResolutionLineChart({ data }: ResolutionLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
        No resolution time data for this period
      </div>
    )
  }

  const chartData = data.map((d) => ({
    ...d,
    avgMin: Math.round(d.avgMs / 60_000 * 10) / 10,
  }))

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-medium text-foreground">Avg Resolution Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
            tickFormatter={(val: string) => val.slice(5)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
            unit=" min"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 11%)",
              border: "1px solid hsl(0 0% 16%)",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(0 0% 95%)" }}
            formatter={(_value, _name, props) => {
              const avgMs = (props as unknown as { payload: { avgMs: number } }).payload.avgMs
              return [formatResolutionTime(avgMs), "Avg Time"]
            }}
          />
          <Line
            type="monotone"
            dataKey="avgMin"
            name="Avg Time (min)"
            stroke="hsl(220 80% 60%)"
            strokeWidth={2}
            dot={{ fill: "hsl(220 80% 60%)", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
