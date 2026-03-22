# Chat Pagination (Load Earlier Messages)

**Status:** review
**Priority:** high

## Overview

The chat loads only the last N messages on mount, scroll to bottom automatically, and offers a "Load earlier messages" button when older history exists.

## What's built

- `useSendChat.ts`: `showAll` state toggle — default loads `getRecentMessages` (limited), switches to `getMessages` (all) on load-more
- `hasEarlier`: computed from `totalCount` vs `messages.length`
- `loadEarlier()`: sets `showAll = true`
- `loadingEarlier`: true while `allMessages` is still undefined after toggling
- Scroll to bottom on mount: `bottomRef.scrollIntoView({ behavior: "instant" })` in `ChatPanel`
- Auto-scroll when near bottom: checks `distanceFromBottom < 200` on each update

## Convex queries used

- `chat.getRecentMessages` — returns last N messages (order desc + take)
- `chat.getMessages` — returns all messages for epic
- `chat.getMessageCount` — returns total count for `hasEarlier` calculation

## Acceptance Criteria

- [x] Loads only recent messages on mount (not full history)
- [x] Scroll to bottom on mount automatically
- [x] `hasEarlier` flag available when more messages exist
- [x] `loadEarlier()` triggers full message load
- [x] `loadingEarlier` state available for spinner UI
- [ ] "Load earlier messages" button rendered in ChatPanel (UI integration pending review)
- [ ] Loading spinner shown while fetching earlier batch
- [ ] Scroll position preserved after loading earlier messages
