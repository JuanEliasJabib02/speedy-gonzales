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
  const abortControllerRef = useRef<AbortController | null>(null)
  const streamingContentRef = useRef<string>("")
  const queuedMessageRef = useRef<string | null>(null)
  const [hasQueued, setHasQueued] = useState(false)

  const typedEpicId = epicId as Id<"epics">
  const typedProjectId = projectId as Id<"projects">

  const project = useQuery(api.projects.getProject, { projectId: typedProjectId })
  const epic = useQuery(api.epics.getEpic, { epicId: typedEpicId })
  const tickets = useQuery(api.tickets.getByEpic, { epicId: typedEpicId })
  const messages = useQuery(api.chat.getMessages, { epicId: typedEpicId })
  const sendMessage = useMutation(api.chat.sendMessage)
  const saveAssistantMessage = useMutation(api.chat.saveAssistantMessage)
  const deleteMessage = useMutation(api.chat.deleteMessage)
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

  const enrichWithMentions = useCallback(
    (content: string): string => {
      const mentions = content.match(/#([\w-]+)/g)
      if (!mentions || !tickets) return content

      const mentionedContent: string[] = []
      for (const mention of mentions) {
        const slug = mention.slice(1)
        const ticket = (tickets ?? []).find(
          (t) => t.path.split("/").pop()?.replace(/\.md$/, "") === slug,
        )
        if (ticket) {
          mentionedContent.push(
            `\n\n---\n**Referenced ticket: ${ticket.title}** (${ticket.status})\n${ticket.content.slice(0, 1000)}`,
          )
        }
      }
      return mentionedContent.length > 0 ? `${content}${mentionedContent.join("")}` : content
    },
    [tickets],
  )

  const streamResponse = useCallback(async (content: string) => {
    const context = buildContext()
    const history = buildHistory()
    const enrichedMessage = enrichWithMentions(content)

    setStreamingContent("")
    const controller = new AbortController()
    abortControllerRef.current = controller

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        epicId,
        message: enrichedMessage,
        context,
        history,
      }),
      signal: controller.signal,
    })

    if (!res.ok || !res.body) {
      const errorText = await res.text().catch(() => "No body")
      console.error("Chat API error:", res.status, errorText)
      setStreamingContent(null)
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let accumulated = ""
    streamingContentRef.current = ""

    while (true) {
      const { done, value: chunk } = await reader.read()
      if (done) break

      const text = decoder.decode(chunk, { stream: true })
      accumulated += text
      streamingContentRef.current = accumulated
      setStreamingContent(accumulated)
    }
  }, [epicId, buildContext, buildHistory, enrichWithMentions])

  const handleSend = useCallback(async () => {
    const trimmed = value.trim()
    const currentImage = pendingImageRef.current
    if (!trimmed && !currentImage?.storageUrl) return

    // Build content with image if present
    let content = trimmed
    if (currentImage?.storageUrl) {
      const imgMarkdown = `![screenshot](${currentImage.storageUrl})`
      content = content ? `${imgMarkdown}\n\n${content}` : imgMarkdown
    }

    // Queue if already sending/streaming
    if (isSending) {
      const existing = queuedMessageRef.current
      queuedMessageRef.current = existing ? `${existing}\n\n${content}` : content
      setHasQueued(true)
      setValue("")
      removePendingImage()
      return
    }

    setIsSending(true)
    setValue("")
    removePendingImage()

    try {
      await sendMessage({ epicId: typedEpicId, content })
      await streamResponse(content)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        // User stopped — partial content is already saved by handleStop
      } else {
        console.error("Failed to send message:", error)
      }
    } finally {
      abortControllerRef.current = null
      setStreamingContent(null)
      setIsSending(false)

      // Process queued message
      const queued = queuedMessageRef.current
      if (queued) {
        queuedMessageRef.current = null
        setHasQueued(false)
        setIsSending(true)
        try {
          await sendMessage({ epicId: typedEpicId, content: queued })
          await streamResponse(queued)
        } catch (qError) {
          if (!(qError instanceof DOMException && qError.name === "AbortError")) {
            console.error("Failed to send queued message:", qError)
          }
        } finally {
          abortControllerRef.current = null
          setStreamingContent(null)
          setIsSending(false)
        }
      }
    }
  }, [value, isSending, sendMessage, typedEpicId, streamResponse, removePendingImage])

  const handleRetry = useCallback(async (assistantMessageId: string) => {
    if (isSending) return
    const msgs = messages ?? []
    const idx = msgs.findIndex((m) => m._id === assistantMessageId)
    if (idx < 0) return

    // Find the preceding user message
    let userMsg: (typeof msgs)[number] | undefined
    for (let i = idx - 1; i >= 0; i--) {
      if (msgs[i].role === "user") {
        userMsg = msgs[i]
        break
      }
    }
    if (!userMsg) return

    setIsSending(true)
    try {
      await deleteMessage({ messageId: assistantMessageId as Id<"chatMessages"> })
      await streamResponse(userMsg.content)
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Failed to retry message:", error)
      }
    } finally {
      abortControllerRef.current = null
      setStreamingContent(null)
      setIsSending(false)
    }
  }, [isSending, messages, deleteMessage, streamResponse])

  const handleStop = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    const partial = streamingContentRef.current
    if (partial) {
      try {
        await saveAssistantMessage({ epicId: typedEpicId, content: partial })
      } catch {
        // Server may have already saved — ignore duplicate
      }
    }
  }, [saveAssistantMessage, typedEpicId])

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
    handleStop,
    handleRetry,
    handleKeyDown,
    hasQueued,
    messages: messages ?? [],
    epic,
    tickets: tickets ?? [],
    pendingImage,
    handlePasteImage,
    removePendingImage,
  }
}
