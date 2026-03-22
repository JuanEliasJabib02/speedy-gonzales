---
description: Apply when managing UI state that must survive navigation (component unmounts) — streaming responses, active selections, ephemeral UI state shared across routes.
globs:
  - src/**/*.ts
  - src/**/*.tsx
---

# Global UI State with Zustand

## The core distinction

There are three kinds of state in this app:

| State type | Lives in | Survives navigation? | Examples |
|---|---|---|---|
| **Server state** | Convex (`useQuery`) | ✅ Yes (re-fetched) | tickets, messages, projects |
| **Global UI state** | Zustand store | ✅ Yes (in-memory) | streaming response, active epic ID |
| **Local component state** | React (`useState`) | ❌ No (dies on unmount) | form inputs, hover states, modal open |

**The problem:** React local state dies when a component unmounts. When the user navigates away and comes back, the component mounts fresh — state is gone.

**The solution:** Zustand lives outside the React tree. It persists in browser memory for the entire session. Components can unmount and remount freely — the store is unaffected.

## When to use Zustand (global UI state)

Use Zustand when **all three** of these are true:
1. The state is **UI-only** (not server data — that goes in Convex)
2. It needs to **survive navigation** (user leaves and comes back)
3. It's **shared or referenced** across multiple components or routes

**Concrete examples in this project:**
- Active streaming response (text accumulated so far + `isStreaming` flag)
- `AbortController` ref for canceling a stream mid-navigation
- Currently active epic/project selection that drives the split view

## When NOT to use Zustand

- Server data → use Convex (`useQuery`, `useMutation`)
- State local to one component that doesn't need to survive navigation → use `useState`
- Form input values → use controlled components with `useState` (or `useDraft` for persistence)
- Data that needs to persist across browser refreshes → use Convex or `localStorage`

> Zustand is for **runtime UI memory**, not persistence. A page refresh clears Zustand.

## Pattern: streaming state store

When streaming state needs to survive navigation, lift it into a Zustand store:

```typescript
// store/useChatStreamStore.ts
import { create } from 'zustand'

interface ChatStreamState {
  epicId: string | null
  streamingText: string
  isStreaming: boolean
  abortController: AbortController | null

  startStream: (epicId: string, controller: AbortController) => void
  appendChunk: (chunk: string) => void
  endStream: () => void
  abort: () => void
}

export const useChatStreamStore = create<ChatStreamState>((set, get) => ({
  epicId: null,
  streamingText: '',
  isStreaming: false,
  abortController: null,

  startStream: (epicId, controller) => set({
    epicId,
    streamingText: '',
    isStreaming: true,
    abortController: controller,
  }),

  appendChunk: (chunk) => set((state) => ({
    streamingText: state.streamingText + chunk,
  })),

  endStream: () => set({
    isStreaming: false,
    abortController: null,
  }),

  abort: () => {
    get().abortController?.abort()
    set({ isStreaming: false, abortController: null })
  },
}))
```

```typescript
// In useSendChat.ts — write to store instead of local state
const { startStream, appendChunk, endStream } = useChatStreamStore()

// In ChatPanel.tsx — read from store
const { streamingText, isStreaming, abort } = useChatStreamStore()
```

## Checklist for new Zustand state

- [ ] Is this UI-only state (not server data)?
- [ ] Does it need to survive component unmounts?
- [ ] Is it keyed by something (epicId, featureId) so multiple instances don't collide?
- [ ] On mount, does the component check if there's an active stream for *its* epicId (not a stale one from another epic)?
- [ ] Is the store cleaned up when the user logs out or switches projects?

## Anti-patterns

```typescript
// BAD — local state dies on navigation
const [streamingText, setStreamingText] = useState('')

// GOOD — store survives navigation  
const streamingText = useChatStreamStore((s) => s.streamingText)
```

```typescript
// BAD — reading the whole store (causes re-renders on every change)
const store = useChatStreamStore()

// GOOD — subscribe to only what you need
const isStreaming = useChatStreamStore((s) => s.isStreaming)
const streamingText = useChatStreamStore((s) => s.streamingText)
```
