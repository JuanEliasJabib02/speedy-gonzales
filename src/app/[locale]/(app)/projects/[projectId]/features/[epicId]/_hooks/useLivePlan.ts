"use client"

import { useCallback } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export function useLivePlan(epicId: string, projectId?: string) {
  const epic = useQuery(api.epics.getEpic, { epicId: epicId as Id<"epics"> })
  const tickets = useQuery(api.tickets.getByEpic, { epicId: epicId as Id<"epics"> })
  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  )

  // Progressive loading: epic loaded first, tickets may still be loading
  const isEpicLoading = epic === undefined
  const isTicketsLoading = tickets === undefined
  const isLoading = isEpicLoading // Only block on epic, not tickets

  const plan = epic
    ? {
        title: epic.title,
        status: epic.status as "backlog" | "todo" | "in-progress" | "review" | "completed" | "blocked",
        priority: epic.priority,
        branch: `${project?.branchPrefix ?? "feat/"}${epic.path.split("/").pop()}`,
        tickets: [
          {
            id: "_context",
            title: "Overview",
            status: epic.status as "backlog" | "todo" | "in-progress" | "review" | "completed" | "blocked",
            blockedReason: undefined
          },
          // Show ticket placeholders while loading, real tickets when loaded
          ...(isTicketsLoading
            ? [
                { id: "loading-1", title: "Loading tickets...", status: "todo" as const, blockedReason: undefined, isLoading: true },
                { id: "loading-2", title: "Loading tickets...", status: "todo" as const, blockedReason: undefined, isLoading: true },
              ]
            : (tickets ?? []).map((t) => ({
                id: t._id as string,
                title: t.title,
                status: t.status as "backlog" | "todo" | "in-progress" | "review" | "completed" | "blocked",
                blockedReason: t.blockedReason,
                commits: t.commits ?? [],
                updatedAt: t.updatedAt,
                agentName: t.agentName,
                _creationTime: t._creationTime,
                isLoading: false,
              }))
          ),
        ],
        planContent: epic.content,
        checklist: { total: epic.checklistTotal, completed: epic.checklistCompleted },
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
    isEpicLoading,
    isTicketsLoading,
    isLive: epic !== null,
    getTicketContent,
    lastSyncAt: project?.lastSyncAt,
    syncStatus: project?.syncStatus,
    repoOwner: project?.repoOwner,
    repoName: project?.repoName,
    projectBranch: project?.branch,
  }
}
