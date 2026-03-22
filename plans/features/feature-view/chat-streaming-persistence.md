# Chat Streaming Persistence (Zustand Global Store)

**Status:** review
**Priority:** high

## Problem

When the user navigates away from the chat view (e.g., back to the kanban), React unmounts `ChatPanel` and `useSendChat`. The streaming state dies with the component. On return, the hook runs orphan cleanup and marks the in-progress message as interrupted — even if the stream was still running.

ChatGPT-style "alive chat" UX is impossible with local component state.

## Goal

Move streaming state to a **Zustand global store** so it survives component unmounts. When the user navigates back to the chat, the stream resumes rendering from wherever it left off — exactly like ChatGPT switching between conversations.

## Solution

### 1. Install Zustand

```bash
npm install zustand
```

### 2. Create `store/chatStreamStore.ts`

```ts
import { create } from 'zustand'

interface StreamState {
  epicId: string | null
  isStreaming: boolean
  streamingContent: string
  abortController: AbortController | null
  setStreaming: (epicId: string, controller: AbortController) => void
  appendChunk: (chunk: string) => void
  stopStreaming: () => void
  reset: () => void
}

export const useChatStreamStore = create<StreamState>((set, get) => ({
  epicId: null,
  isStreaming: false,
  streamingContent: '',
  abortController: null,

  setStreaming: (epicId, controller) =>
    set({ epicId, isStreaming: true, streamingContent: '', abortController: controller }),

  appendChunk: (chunk) =>
    set((s) => ({ streamingContent: s.streamingContent + chunk })),

  stopStreaming: () => {
    get().abortController?.abort()
    set({ isStreaming: false, abortController: null })
  },

  reset: () =>
    set({ epicId: null, isStreaming: false, streamingContent: '', abortController: null }),
}))
```

### 3. Refactor `useSendChat`

- Replace local `isStreaming`, `streamingContent`, `abortController` state with the Zustand store
- On each SSE chunk → call `appendChunk(chunk)` on the store
- On stream end → call `stopStreaming()` and persist final message to Convex
- On mount (orphan cleanup) → check `store.epicId === currentEpicId && store.isStreaming` before marking orphans

### 4. Refactor `ChatPanel`

- Read `streamingContent` and `isStreaming` from store (not local state)
- Stop button calls `store.stopStreaming()`
- When component remounts → stream content is already in store, renders immediately

### 5. Rule: No local streaming state in components

Any state that must survive navigation goes to Zustand. Component state is only for UI-only concerns (input focus, hover, scroll position).

## Checklist

- [x] Install zustand
- [x] Create `store/chatStreamStore.ts`
- [x] Refactor `useSendChat` — replace local streaming state with store
- [x] Refactor `ChatPanel` — read streaming state from store
- [x] Orphan cleanup: skip if store says stream is active for this epic
- [x] Stop button wired to `store.stopStreaming()`
- [ ] Test: navigate away mid-stream, return, content is still rendering
- [ ] Test: stop button still works after navigation
- [x] Add rule in `.cursor/rules/` or `RULES.md`: global streaming state goes to Zustand (already existed at `.claude/rules/global-ui-state.md`)

## Files to touch

- `package.json` (add zustand)
- `store/chatStreamStore.ts` (new)
- `hooks/useSendChat.ts`
- `components/chat/ChatPanel.tsx`
- `.cursor/rules/` or `RULES.md` (add zustand rule)
