"use client"

import { Plus } from "lucide-react"
import { Button } from "@/src/lib/components/ui/button"

type DashboardHeaderProps = {
  onCreateProject: () => void
}

export function DashboardHeader({ onCreateProject }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <Button onClick={onCreateProject}>
        <Plus className="size-4" />
        New Project
      </Button>
    </div>
  )
}
