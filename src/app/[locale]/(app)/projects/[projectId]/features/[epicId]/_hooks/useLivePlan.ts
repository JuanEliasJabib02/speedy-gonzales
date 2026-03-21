"use client"

import { useCallback } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export function useLivePlan(epicId: string) {
  const epic = useQuery(api.epics.getEpic, { epicId: epicId as Id<"epics"> })
  const tickets = useQuery(api.tickets.getByEpic, { epicId: epicId as Id<"epics"> })

  const isLoading = epic === undefined || tickets === undefined

  const plan = epic
    ? {
        title: epic.title,
        status: epic.status as "todo" | "in-progress" | "review" | "completed",
        priority: epic.priority,
        branch: `feat/${epic.path.split("/").pop()}`,
        tickets: [
          { id: "_context", title: "Overview", status: epic.status as "todo" | "in-progress" | "review" | "completed" },
          ...(tickets ?? []).map((t) => ({
            id: t._id as string,
            title: t.title,
            status: t.status as "todo" | "in-progress" | "review" | "completed",
          })),
        ],
        planContent: epic.content,
        checklist: { total: epic.checklistTotal, completed: epic.checklistCompleted },
        chatMessages: [],
      }
    : null

  const getTicketContent = useCallback(
    (ticketId: string) => {
      if (ticketId === "_context" && epic) {
        return {
          content: epic.content,
          checklist: { completed: epic.checklistCompleted, total: epic.checklistTotal },
        }
      }
      const ticket = tickets?.find((t) => t._id === ticketId)
      if (ticket) {
        return {
          content: ticket.content,
          checklist: { completed: ticket.checklistCompleted, total: ticket.checklistTotal },
        }
      }
      return { content: "", checklist: { completed: 0, total: 0 } }
    },
    [epic, tickets],
  )

  return {
    plan,
    isLoading,
    isLive: epic !== null,
    getTicketContent,
  }
}
