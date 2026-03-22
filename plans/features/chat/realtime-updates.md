# Real-time Message Updates

**Status:** review
**Priority:** medium

## What it does

Chat messages update in real-time using Convex's reactive queries. When the agent responds, the UI updates immediately.

## Checklist

- [x] Use `useQuery(api.chat.getMessages, { epicId })` for reactive message list
- [x] Auto-scroll to bottom when new messages arrive
- [x] Empty state when no messages yet
- [x] Show typing indicator while agent is processing
- [x] When agent pushes → webhook fires → plan viewer + sidebar update while chatting
- [x] Handle optimistic updates for user messages

