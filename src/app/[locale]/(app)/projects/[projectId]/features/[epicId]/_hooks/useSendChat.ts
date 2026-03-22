"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import type { PendingImage, ChatContext, HistoryMessage } from "@/src/types/chat"
import type { ActiveFile } from "../_components/FeatureLayout"

const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours
const MAX_IMAGES = 4

function getDraftKey(epicId: string) {
  return `chat-draft-${epicId}`
}

function loadDraft(epicId: string): string {
  try {
    const raw = localStorage.getItem(getDraftKey(epicId))
    if (!raw) return ""
    const { text, ts } = JSON.parse(raw)
    if (Date.now() - ts > DRAFT_MAX_AGE_MS) {
      localStorage.removeItem(getDraftKey(epicId))
      return ""
    }
    return text ?? ""
  } catch {
    return ""
  }
}

function saveDraft(epicId: string, text: string) {
  try {
    if (!text) {
      localStorage.removeItem(getDraftKey(epicId))
      return
    }
    localStorage.setItem(getDraftKey(epicId), JSON.stringify({ text, ts: Date.now() }))
  } catch {
    // localStorage full or unavailable — ignore
  }
}

function clearDraft(epicId: string) {
  try {
    localStorage.removeItem(getDraftKey(epicId))
  } catch {
    // ignore
  }
}

export function useSendChat(projectId: string, epicId: string, activeFile: ActiveFile | null = null) {
  const [value, setValue] = useState(() => loadDraft(epicId))
  const [isSending, setIsSending] = useState(false)
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const pendingImagesRef = useRef<PendingImage[]>([])
  // Debounced draft persistence
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current)
    draftTimerRef.current = setTimeout(() => {
      saveDraft(epicId, value)
    }, 300)
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current)
    }
  }, [value, epicId])

  const abortControllerRef = useRef<AbortController | null>(null)
  const streamingContentRef = useRef<string>("")
  const streamingMessageIdRef = useRef<string | null>(null)
  const queuedMessageRef = useRef<string | null>(null)
  const [hasQueued, setHasQueued] = useState(false)
  const [queueLength, setQueueLength] = useState(0)
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const typedEpicId = epicId as Id<"epics">
  const typedProjectId = projectId as Id<"projects">

  const project = useQuery(api.projects.getProject, { projectId: typedProjectId })
  const epic = useQuery(api.epics.getEpic, { epicId: typedEpicId })
  const tickets = useQuery(api.tickets.getByEpic, { epicId: typedEpicId })
  const recentMessages = useQuery(api.chat.getRecentMessages, !showAll ? { epicId: typedEpicId } : "skip")
  const allMessages = useQuery(api.chat.getMessages, showAll ? { epicId: typedEpicId } : "skip")
  const messages = showAll ? allMessages : recentMessages
  const totalCount = useQuery(api.chat.getMessageCount, { epicId: typedEpicId })
  const hasEarlier = !showAll && totalCount !== undefined && (totalCount > (messages?.length ?? 0))
  const loadEarlier = () => setShowAll(true)
  const loadingEarlier = showAll && !allMessages
  const sendMessage = useMutation(api.chat.sendMessage)
  const deleteMessage = useMutation(api.chat.deleteMessage)
  const markInterrupted = useMutation(api.chat.markMessageInterrupted)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const getFileUrl = useMutation(api.files.getUrl)

  // Revoke blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl)
      })
    }
  }, [])

  // On mount: check for orphaned streaming messages left by a previous page load
  const hasCheckedOrphansRef = useRef(false)
  useEffect(() => {
    if (!messages || hasCheckedOrphansRef.current) return
    hasCheckedOrphansRef.current = true
    const orphans = messages.filter((m) => m.isStreaming === true)
    orphans.forEach((o) => markInterrupted({ messageId: o._id }))
  }, [messages, markInterrupted])

  const handlePasteImage = useCallback(async (file: File) => {
    if (pendingImagesRef.current.length >= MAX_IMAGES) return

    const previewUrl = URL.createObjectURL(file)
    const img: PendingImage = { file, previewUrl, storageUrl: null, isUploading: true, error: null }

    setPendingImages((prev) => [...prev, img])
    pendingImagesRef.current = [...pendingImagesRef.current, img]
    const imgIndex = pendingImagesRef.current.length - 1

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
      setPendingImages((prev) => prev.map((p, i) => (i === imgIndex ? updated : p)))
      pendingImagesRef.current = pendingImagesRef.current.map((p, i) => (i === imgIndex ? updated : p))
    } catch {
      const errored: PendingImage = { ...img, isUploading: false, error: "Upload failed" }
      setPendingImages((prev) => prev.map((p, i) => (i === imgIndex ? errored : p)))
      pendingImagesRef.current = pendingImagesRef.current.map((p, i) => (i === imgIndex ? errored : p))
    }
  }, [generateUploadUrl, getFileUrl])

  const removePendingImage = useCallback((index: number) => {
    setPendingImages((prev) => {
      const img = prev[index]
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
    pendingImagesRef.current = pendingImagesRef.current.filter((_, i) => i !== index)
  }, [])

  const clearAllPendingImages = useCallback(() => {
    pendingImagesRef.current.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl)
    })
    setPendingImages([])
    pendingImagesRef.current = []
  }, [])

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
    // Last 12 messages for history
    return messages.slice(-12).map((m) => {
      const raw = m.content
      const truncated = raw.length > 600 ? raw.slice(0, 600) + "\u2026" : raw
      return { role: m.role as "user" | "assistant", content: truncated }
    })
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
        projectId,
        message: enrichedMessage,
        context,
        history,
        activeFile: activeFile ?? undefined,
      }),
      signal: controller.signal,
    })

    if (!res.ok || !res.body) {
      const errorText = await res.text().catch(() => "No body")
      console.error("Chat API error:", res.status, errorText)
      setStreamingContent(null)
      return
    }

    // Capture the server-created message ID for stop/interrupt handling
    streamingMessageIdRef.current = res.headers.get("X-Message-Id")

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
  }, [epicId, projectId, buildContext, buildHistory, enrichWithMentions, activeFile])

  const handleSend = useCallback(async () => {
    const trimmed = value.trim()
    const currentImages = pendingImagesRef.current
    const readyImages = currentImages.filter((img) => img.storageUrl)
    if (!trimmed && readyImages.length === 0) return

    // Build content with images if present
    let content = trimmed
    if (readyImages.length > 0) {
      const imgLines = readyImages.map(
        (img, i) => `![screenshot-${i + 1}](${img.storageUrl})`,
      ).join("\n")
      content = content ? `${imgLines}\n\n${content}` : imgLines
    }

    // Queue if already sending/streaming
    if (isSending) {
      const existing = queuedMessageRef.current
      queuedMessageRef.current = existing ? `${existing}\n\n${content}` : content
      setHasQueued(true)
      setQueueLength((prev) => prev + 1)
      setValue("")
      clearDraft(epicId)
      clearAllPendingImages()
      return
    }

    setIsSending(true)
    setValue("")
    clearDraft(epicId)
    clearAllPendingImages()
    setOptimisticMessage(content)

    try {
      await sendMessage({ epicId: typedEpicId, content })
      setOptimisticMessage(null)
      await streamResponse(content)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        // User stopped — partial content is already saved by handleStop
      } else {
        console.error("Failed to send message:", error)
      }
    } finally {
      abortControllerRef.current = null
      streamingMessageIdRef.current = null
      setStreamingContent(null)
      setOptimisticMessage(null)
      setIsSending(false)

      // Process queued message
      const queued = queuedMessageRef.current
      if (queued) {
        queuedMessageRef.current = null
        setHasQueued(false)
        setQueueLength(0)
        setIsSending(true)
        setOptimisticMessage(queued)
        try {
          await sendMessage({ epicId: typedEpicId, content: queued })
          setOptimisticMessage(null)
          await streamResponse(queued)
        } catch (qError) {
          if (!(qError instanceof DOMException && qError.name === "AbortError")) {
            console.error("Failed to send queued message:", qError)
          }
        } finally {
          abortControllerRef.current = null
          streamingMessageIdRef.current = null
          setStreamingContent(null)
          setOptimisticMessage(null)
          setIsSending(false)
        }
      }
    }
  }, [value, isSending, sendMessage, typedEpicId, epicId, streamResponse, clearAllPendingImages])

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
      streamingMessageIdRef.current = null
      setStreamingContent(null)
      setIsSending(false)
    }
  }, [isSending, messages, deleteMessage, streamResponse])

  const handleStop = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    // Mark the server-created message as interrupted (server error handler also does this — idempotent)
    const messageId = streamingMessageIdRef.current
    if (messageId) {
      try {
        await markInterrupted({ messageId: messageId as Id<"chatMessages"> })
      } catch {
        // Server may have already finalized — ignore
      }
      streamingMessageIdRef.current = null
    }
  }, [markInterrupted])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const sendDirect = useCallback(async (content: string) => {
    if (!content.trim()) return
    if (isSending) {
      const existing = queuedMessageRef.current
      queuedMessageRef.current = existing ? `${existing}\n\n${content}` : content
      setHasQueued(true)
      setQueueLength((prev) => prev + 1)
      return
    }
    setIsSending(true)
    setOptimisticMessage(content)
    try {
      await sendMessage({ epicId: typedEpicId, content })
      setOptimisticMessage(null)
      await streamResponse(content)
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Failed to send message:", error)
      }
    } finally {
      abortControllerRef.current = null
      streamingMessageIdRef.current = null
      setStreamingContent(null)
      setOptimisticMessage(null)
      setIsSending(false)
    }
  }, [isSending, sendMessage, typedEpicId, streamResponse])

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
    queueLength,
    messages: (messages ?? []).filter((m) => m.isStreaming !== true),
    epic,
    tickets: tickets ?? [],
    optimisticMessage,
    pendingImages,
    handlePasteImage,
    removePendingImage,
    sendDirect,
    hasEarlier,
    loadEarlier,
    loadingEarlier,
  }
}
