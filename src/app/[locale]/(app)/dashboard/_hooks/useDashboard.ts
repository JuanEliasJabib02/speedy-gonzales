"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useDashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const projects = useQuery(api.projects.getProjectsWithStats)

  return {
    projects,
    dialogOpen,
    setDialogOpen,
  }
}
