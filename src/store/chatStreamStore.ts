import { create } from "zustand"

interface ChatStreamState {
  epicId: string | null
  isStreaming: boolean
  streamingContent: string
  abortController: AbortController | null

  startStream: (epicId: string, controller: AbortController) => void
  appendChunk: (chunk: string) => void
  stopStreaming: () => void
  reset: () => void
}

export const useChatStreamStore = create<ChatStreamState>((set, get) => ({
  epicId: null,
  isStreaming: false,
  streamingContent: "",
  abortController: null,

  startStream: (epicId, controller) =>
    set({ epicId, isStreaming: true, streamingContent: "", abortController: controller }),

  appendChunk: (chunk) =>
    set((s) => ({ streamingContent: s.streamingContent + chunk })),

  stopStreaming: () => {
    get().abortController?.abort()
    set({ isStreaming: false, abortController: null })
  },

  reset: () =>
    set({ epicId: null, isStreaming: false, streamingContent: "", abortController: null }),
}))
