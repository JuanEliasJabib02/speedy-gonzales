# Zustand Global State Rules

## Chat Streaming State

**Never use local component state for streaming.**

All chat streaming state (`isStreaming`, `streamingContent`, `abortController`, `epicId`) must live in
the `useChatStreamStore` Zustand store (`src/store/chatStreamStore.ts`).

This ensures streaming survives React component unmounts during navigation (e.g., chat → kanban → back).

### ✅ Correct
```ts
// In hooks/components: read from store
const { streamingContent, isStreaming } = useChatStreamStore()

// Start streaming
useChatStreamStore.getState().startStream(epicId, controller)

// Append chunks
useChatStreamStore.getState().appendChunk(chunk)

// Stop
useChatStreamStore.getState().stopStreaming()
```

### ❌ Wrong
```ts
// Local state that dies on unmount
const [isStreaming, setIsStreaming] = useState(false)
const [streamingContent, setStreamingContent] = useState('')
```

### Orphan cleanup
When a component mounts and checks for orphaned streaming messages (messages with `isStreaming: true`),
it must first verify the store is not actively streaming for that epic before marking them interrupted:

```ts
const { epicId: storeEpicId, isStreaming: storeIsStreaming } = useChatStreamStore.getState()
if (storeEpicId === currentEpicId && storeIsStreaming) return // skip orphan cleanup — stream still alive
```
