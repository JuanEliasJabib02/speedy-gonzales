# Chat Pagination (Load Earlier Messages)

**Status:** review
**Priority:** high

## Overview

The chat currently loads all messages at once and doesn't scroll to the bottom on mount. As conversations grow this becomes slow and the UX is broken — user lands in the middle of history.

## Problems

- No scroll-to-bottom on mount (user sees top of history, not latest messages)
- All messages loaded at once — no limit
- Long chats will slow down render significantly

## Desired behavior

- On mount: load only the **last 30 messages**, scroll to bottom automatically
- If user scrolls to the top: show "Load earlier messages" button (or auto-trigger)
- Clicking load-more fetches the previous 30 messages and prepends them without losing scroll position

## Tasks

- [ ] Scroll to bottom on mount (fix/confirm existing `scrollToBottom` logic runs on initial load)
- [ ] In Convex query: add `.order("desc").take(30)` and reverse client-side for display
- [ ] Add "Load earlier messages" button at top of chat, visible when more messages exist
- [ ] On load-more: fetch previous batch, prepend to list, restore scroll position (don't jump)
- [ ] Show loading spinner while fetching earlier messages

## Files to touch

- `convex/chatMessages.ts` — query to support pagination (cursor or offset)
- `hooks/useSendChat.ts` or `hooks/useChat.ts` — load-more logic
- `components/ChatPanel.tsx` — scroll-to-bottom on mount, load-more UI
