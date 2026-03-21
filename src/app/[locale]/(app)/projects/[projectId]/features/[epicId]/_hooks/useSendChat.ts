"use client"

import { useState, useCallback, useRef } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

type PendingImage = {
  file: File
  previewUrl: string
  storageUrl: string | null
  isUploading: boolean
  error: string | null
}

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
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null)
  const pendingImageRef = useRef<PendingImage | null>(null)

  const typedEpicId = epicId as Id<"epics">
  const typedProjectId = projectId as Id<"projects">

  const project = useQuery(api.projects.getProject, { projectId: typedProjectId })
  const epic = useQuery(api.epics.getEpic, { epicId: typedEpicId })
  const tickets = useQuery(api.tickets.getByEpic, { epicId: typedEpicId })
  const messages = useQuery(api.chat.getMessages, { epicId: typedEpicId })
  const sendMessage = useMutation(api.chat.sendMessage)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const getFileUrl = useMutation(api.files.getUrl)

  const handlePasteImage = useCallback(async (file: File) => {
    const previewUrl = URL.createObjectURL(file)
    const img: PendingImage = { file, previewUrl, storageUrl: null, isUploading: true, error: null }
    setPendingImage(img)
    pendingImageRef.current = img

    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      if (!res.ok) throw new Error("Upload failed")
      const { storageId } = await res.json()
      const storageUrl = await getFileUrl({ storageId })

      if (!storageUrl) throw new Error("Failed to get file URL")
      const updated: PendingImage = { ...img, storageUrl, isUploading: false }
      setPendingImage(updated)
      pendingImageRef.current = updated
    } catch {
      const errored: PendingImage = { ...img, isUploading: false, error: "Upload failed" }
      setPendingImage(errored)
      pendingImageRef.current = errored
    }
  }, [generateUploadUrl, getFileUrl])

  const removePendingImage = useCallback(() => {
    if (pendingImage?.previewUrl) {
      URL.revokeObjectURL(pendingImage.previewUrl)
    }
    setPendingImage(null)
    pendingImageRef.current = null
  }, [pendingImage])

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
    const currentImage = pendingImageRef.current
    if ((!trimmed && !currentImage?.storageUrl) || isSending) return

    setIsSending(true)
    setValue("")

    // Build content with image if present
    let content = trimmed
    if (currentImage?.storageUrl) {
      const imgMarkdown = `![screenshot](${currentImage.storageUrl})`
      content = content ? `${imgMarkdown}\n\n${content}` : imgMarkdown
    }
    removePendingImage()

    try {
      // Save user message to Convex
      await sendMessage({ epicId: typedEpicId, content })

      const context = buildContext()
      const history = buildHistory()

      // Start streaming
      setStreamingContent("")

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          epicId,
          message: content,
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
  }, [value, isSending, sendMessage, typedEpicId, epicId, buildContext, buildHistory, removePendingImage])

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
    pendingImage,
    handlePasteImage,
    removePendingImage,
  }
}
