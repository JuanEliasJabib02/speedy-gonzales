# Shared Types Consolidation (DUP-01/02/03 v2)

**Status:** todo
**Priority:** low

## What it does

Eliminate duplicate types scattered across files:
- `ChatContext` in route.ts AND useSendChat.ts
- `HistoryMessage` in route.ts AND useSendChat.ts
- `PendingImage` in useSendChat.ts AND ChatInput.tsx

Also: markdown components nearly identical in ChatMessage.tsx and PlanViewer.tsx.

## Checklist

- [ ] Create `src/types/chat.ts` with ChatContext, HistoryMessage, PendingImage
- [ ] Update imports in route.ts, useSendChat.ts, ChatInput.tsx
- [ ] Extract shared markdown components to `src/lib/components/common/MarkdownContent.tsx`
- [ ] Update ChatMessage.tsx and PlanViewer.tsx to use shared component
