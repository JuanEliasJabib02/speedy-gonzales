# Chat History Query

**Status:** todo
**Priority:** medium

## What it does

Convex query that returns a list of features with chat activity, sorted by last message date, with unread count per feature.

## Checklist

- [ ] Query: `getChatHistory(userId)` — for each epic with messages, return: epicId, epicTitle, projectId, lastMessage (snippet), lastMessageAt, unreadCount
- [ ] Index: `chatMessages` by `epicId` + `createdAt` for efficient last-message lookup
- [ ] Unread: compare `lastMessageAt` against a `lastReadAt` timestamp per user per epic
- [ ] Reactive — updates when new messages arrive

## Files

- `convex/chatMessages.ts`
- `convex/schema.ts` (add `chatReadState` table: userId + epicId + lastReadAt)
