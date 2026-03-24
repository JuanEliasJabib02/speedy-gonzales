"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import type { Feature } from "../_constants/kanban-config"

export function useFeatureCard(feature: Feature, projectId: string) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const pid = projectId as Id<"projects">

  const deleteEpic = useMutation(api.epics.deleteEpic).withOptimisticUpdate(
    (localStore, { epicId }) => {
      const current = localStore.getQuery(api.epics.getByProject, { projectId: pid })
      if (!current) return
      localStore.setQuery(
        api.epics.getByProject,
        { projectId: pid },
        current.filter((e) => e._id !== epicId)
      )
    }
  )

  const promoteToTodo = useMutation(api.epics.promoteToTodo).withOptimisticUpdate(
    (localStore, { epicId }) => {
      const current = localStore.getQuery(api.epics.getByProject, { projectId: pid })
      if (!current) return
      localStore.setQuery(
        api.epics.getByProject,
        { projectId: pid },
        current.map((e) => (e._id === epicId ? { ...e, status: "todo" as const } : e))
      )
    }
  )

  const updateStatus = useMutation(api.epics.updateStatus).withOptimisticUpdate(
    (localStore, { epicId, status }) => {
      const current = localStore.getQuery(api.epics.getByProject, { projectId: pid })
      if (!current) return
      localStore.setQuery(
        api.epics.getByProject,
        { projectId: pid },
        current.map((e) => (e._id === epicId ? { ...e, status } : e))
      )
    }
  )

  const handlePromote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    promoteToTodo({ epicId: feature.id })
  }

  const handleApprove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    updateStatus({ epicId: feature.id, status: "completed" })
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    setShowDeleteDialog(false)
    deleteEpic({ epicId: feature.id })
  }

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handlePromote,
    handleApprove,
    handleDeleteClick,
    handleDeleteConfirm,
  }
}
