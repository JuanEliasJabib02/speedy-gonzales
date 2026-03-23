import { cn } from "@/src/lib/helpers/cn"
import type { LucideIcon } from "lucide-react"

type StatCardProps = {
  label: string
  value: string
  icon: LucideIcon
  accent?: "default" | "success" | "warning" | "destructive"
}

const accentClasses = {
  default: "text-primary",
  success: "text-emerald-500",
  warning: "text-amber-500",
  destructive: "text-destructive",
} as const

export function StatCard({ label, value, icon: Icon, accent = "default" }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Icon className={cn("size-4", accentClasses[accent])} />
      </div>
      <p className={cn("mt-2 text-2xl font-semibold", accentClasses[accent])}>
        {value}
      </p>
    </div>
  )
}
