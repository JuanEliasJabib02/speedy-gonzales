"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { getEpicData, type EpicData, type Ticket, type TicketStatus } from "../_constants/mock-data"

type LiveTicket = {
  id: string
  title: string
  status: TicketStatus
  content: string
  checklist: { completed: number; total: number }
}

export function useLivePlan(epicId: string) {
  const fallback = useMemo(() => getEpicData(epicId), [epicId])
  const [livePlan, setLivePlan] = useState<EpicData | null>(null)
  const [ticketContents, setTicketContents] = useState<Record<string, { content: string; checklist: { completed: number; total: number } }>>({})

  useEffect(() => {
    let cancelled = false
    setLivePlan(null)
    setTicketContents({})

    async function fetchPlan() {
      try {
        const res = await fetch(`/api/plans/${epicId}`)
        if (!res.ok || cancelled) return

        const data = await res.json()
        if (cancelled) return

        const liveTickets: Ticket[] = (data.tickets as LiveTicket[]).map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status as TicketStatus,
        }))

        const contents: Record<string, { content: string; checklist: { completed: number; total: number } }> = {}
        for (const t of data.tickets as LiveTicket[]) {
          contents[t.id] = { content: t.content, checklist: t.checklist }
        }
        setTicketContents(contents)

        setLivePlan({
          ...fallback,
          title: data.title,
          status: data.status as TicketStatus,
          priority: data.priority,
          planContent: data.content,
          checklist: data.checklist,
          tickets: liveTickets,
        })
      } catch {
        // Keep fallback mock data
      }
    }

    fetchPlan()

    // DEV ONLY: poll every 3s so plan edits appear automatically — remove for production (Task #1)
    const interval = setInterval(fetchPlan, 3000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [epicId, fallback])

  const getTicketContent = useCallback((ticketId: string) => {
    const plan = livePlan ?? fallback
    return ticketContents[ticketId] ?? {
      content: plan.planContent,
      checklist: plan.checklist,
    }
  }, [ticketContents, livePlan, fallback])

  return {
    plan: livePlan ?? fallback,
    isLive: livePlan !== null,
    getTicketContent,
  }
}
