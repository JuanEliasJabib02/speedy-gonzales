"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type DayData = {
  date: string
  clean: number
  withFixes: number
  blocked: number
}

type TicketsBarChartProps = {
  data: DayData[] | undefined
}

export function TicketsBarChart({ data }: TicketsBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
        No ticket data for this period
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-medium text-foreground">Tickets per Day</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
            tickFormatter={(val: string) => val.slice(5)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(0 0% 55%)" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 11%)",
              border: "1px solid hsl(0 0% 16%)",
              borderRadius: "6px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(0 0% 95%)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
          />
          <Bar dataKey="clean" name="Clean" stackId="tickets" fill="hsl(145 60% 42%)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="withFixes" name="With Fixes" stackId="tickets" fill="hsl(45 90% 50%)" />
          <Bar dataKey="blocked" name="Blocked" stackId="tickets" fill="hsl(0 70% 55%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
