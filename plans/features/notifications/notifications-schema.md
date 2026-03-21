# Notifications Schema

**Status:** todo
**Priority:** medium

## What it does

Convex schema and mutations for storing and managing notifications.

## Checklist

- [ ] Add `notifications` table to `convex/schema.ts`
- [ ] Fields: `userId`, `type`, `title`, `body`, `link`, `read`, `createdAt`, `projectId?`, `epicId?`
- [ ] Types: `agent-push`, `ticket-created`, `status-changed`, `chat-reply`, `sync-complete`, `sync-error`
- [ ] Mutation: `createNotification` (internal — called by other actions)
- [ ] Mutation: `markRead(notificationId)`
- [ ] Mutation: `markAllRead(userId)`
- [ ] Query: `getUnread(userId)` — reactive

## Files

- `convex/schema.ts`
- `convex/notifications.ts` (new)
