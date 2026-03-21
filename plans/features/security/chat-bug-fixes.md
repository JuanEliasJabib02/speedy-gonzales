# Chat Bug Fixes (BUG-01, BUG-02, BUG-08, LEAK-01, PERF-03, PERF-05)

**Status:** review
**Priority:** high

## Bugs to fix

### BUG-01 — Only first orphaned streaming message cleaned on mount
**File:** useSendChat.ts
```ts
// Fix: use .filter() instead of .find() and clean ALL orphaned messages
const orphans = messages.filter((m) => m.isStreaming === true)
orphans.forEach((o) => markInterrupted({ messageId: o._id }))
```

### BUG-02 — role "assistant" in DB vs "agent" in UI (unsafe cast)
**File:** ChatPanel.tsx
Standardize by normalizing at the mapping layer:
```ts
role: message.role === "assistant" ? "agent" : "user",
```

### BUG-08 — `user: "juan"` hardcoded in AI request
**File:** route.ts ~L257
Remove or make dynamic based on authenticated user.

### LEAK-01 — Blob URLs not revoked on unmount
**File:** useSendChat.ts
Add cleanup useEffect:
```ts
useEffect(() => {
  return () => {
    pendingImagesRef.current.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl)
    })
  }
}, [])
```

### PERF-03 — Auto-scroll forces scroll even when user is reading
**File:** ChatPanel.tsx
Only auto-scroll if user is near the bottom (<100px from bottom).

### PERF-05 — No timeout on AI fetch
**File:** route.ts
Add AbortController with 60s timeout on the upstream fetch.

## Checklist

- [x]BUG-01: fix orphan cleanup to use .filter() not .find()
- [x]BUG-02: normalize role at mapping layer in ChatPanel.tsx
- [x]BUG-08: remove hardcoded user: "juan"
- [x]LEAK-01: add useEffect cleanup for blob URLs
- [x]PERF-03: smart auto-scroll (only when near bottom)
- [x]PERF-05: add 60s timeout on upstream AI fetch

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_hooks/useSendChat.ts`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatPanel.tsx`
- `src/app/api/chat/route.ts`
