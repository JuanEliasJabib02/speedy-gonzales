# Unread Message Tracking

**Status:** todo
**Priority:** medium

## What it does

Track which chat messages each user has read, so we can show unread indicators on the chat history view and notification center.

## Checklist

- [ ] Add `chatReadState` table: `userId`, `epicId`, `lastReadAt`
- [ ] Mutation: `markChatRead(epicId)` — called when user opens the chat panel
- [ ] Query: `getUnreadChats(userId)` — returns epicIds where agent replied after lastReadAt
- [ ] Integrate with `ChatPanel` — call `markChatRead` when panel mounts or becomes visible
- [ ] Integrate with `ChatHistoryView` — show unread dot based on this data

## Files

- `convex/schema.ts`
- `convex/chatReadState.ts` (new)
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatPanel.tsx`
