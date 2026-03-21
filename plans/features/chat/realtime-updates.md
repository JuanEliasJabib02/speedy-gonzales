# Real-time Message Updates

**Status:** todo

## What it does

Chat messages update in real-time using Convex's reactive queries. When the agent responds or pushes changes, the UI updates immediately.

## Checklist

- [ ] Use `useQuery(api.chat.getMessages, { epicId })` for reactive message list
- [ ] Auto-scroll to bottom when new messages arrive
- [ ] Show typing indicator while agent is processing
- [ ] When agent pushes → webhook fires → plan viewer + sidebar update while chatting
- [ ] Handle optimistic updates for user messages

## Notes

- Convex queries are already reactive — messages will update automatically
- The key challenge is handling the agent's response time (could be seconds to minutes)
