"use client"

import { useState, useCallback } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

type ChatContext = {
  project: {
    name: string
    repoOwner: string
    repoName: string
    branch: string
  }
  epic: {
    title: string
    status: string
    priority: string
    content: string
  }
  tickets: Array<{
    title: string
    status: string
    content: string
  }>
}

type HistoryMessage = {
  role: "user" | "assistant"
  content: string
}

export function useSendChat(projectId: string, epicId: string) {
  const [value, setValue] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [streamingContent, setStreamingContent] = useState<string | null>(null)

  const typedEpicId = epicId as Id<"epics">
  const typedProjectId = projectId as Id<"projects">

  const project = useQuery(api.projects.getProject, { projectId: typedProjectId })
  const epic = useQuery(api.epics.getEpic, { epicId: typedEpicId })
  const tickets = useQuery(api.tickets.getByEpic, { epicId: typedEpicId })
  const messages = useQuery(api.chat.getMessages, { epicId: typedEpicId })
  const sendMessage = useMutation(api.chat.sendMessage)

  const buildContext = useCallback((): ChatContext | null => {
    if (!project || !epic) return null
    return {
      project: {
        name: project.name,
        repoOwner: project.repoOwner,
        repoName: project.repoName,
        branch: project.branch,
      },
      epic: {
        title: epic.title,
        status: epic.status,
        priority: epic.priority,
        content: epic.content.slice(0, 2000),
      },
      tickets: (tickets ?? []).map((t) => ({
        title: t.title,
        status: t.status,
        content: t.content.slice(0, 500),
      })),
    }
  }, [project, epic, tickets])

  const buildHistory = useCallback((): HistoryMessage[] => {
    if (!messages) return []
    // Last 20 messages for history
    return messages.slice(-20).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))
  }, [messages])

  const handleSend = useCallback(async () => {
    const trimmed = value.trim()
    if (!trimmed || isSending) return

    setIsSending(true)
    setValue("")

    try {
      // Save user message to Convex
      await sendMessage({ epicId: typedEpicId, content: trimmed })

      const context = buildContext()
      const history = buildHistory()

      // Start streaming
      setStreamingContent("")

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          epicId,
          message: trimmed,
          context,
          history,
        }),
      })

      if (!res.ok || !res.body) {
        const errorText = await res.text().catch(() => "No body")
        console.error("Chat API error:", res.status, errorText)
        setStreamingContent(null)
        return
      }

      // Read text stream (plain text from toTextStreamResponse)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value: chunk } = await reader.read()
        if (done) break

        const text = decoder.decode(chunk, { stream: true })
        accumulated += text
        setStreamingContent(accumulated)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setStreamingContent(null)
      setIsSending(false)
    }
  }, [value, isSending, sendMessage, typedEpicId, epicId, buildContext, buildHistory])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  return {
    value,
    setValue,
    isSending,
    streamingContent,
    handleSend,
    handleKeyDown,
    messages: messages ?? [],
  }
}
