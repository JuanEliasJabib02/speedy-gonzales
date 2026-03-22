# Chat Pagination (Load Earlier Messages)

**Status:** in-progress
**Priority:** high

## Overview

The chat loads only the last N messages on mount, scroll to bottom automatically, and auto-loads earlier messages when the user scrolls to the top.

## What's built

- `useSendChat.ts`: `usePaginatedQuery` with `initialNumItems: 20`
- `hasEarlier`: `paginationStatus === "CanLoadMore"`
- `loadEarlier()`: calls `loadMore(20)`
- `loadingEarlier`: `paginationStatus === "LoadingMore"`
- `handleLoadEarlier` in ChatPanel: saves `scrollHeight` before triggering load
- `useLayoutEffect` restores scroll position after messages load — no jump
- Auto-scroll when near bottom: checks `distanceFromBottom < 200` on each update

## Convex queries used

- `chat.getMessagesPaginated` — cursor-based paginated query, `initialNumItems: 20`

## Bugs to fix

### Bug 1 — bottomRef never attached
`bottomRef` is declared and called in `useEffect` but **never rendered in JSX**.
Fix: add `<div ref={bottomRef} />` as the very last element inside the scroll container (after all messages/streaming).

### Bug 2 — No auto-load on scroll to top
Currently only a manual "Load earlier messages" button exists.
Fix: add an `IntersectionObserver` on a sentinel `<div ref={topSentinelRef} />` rendered at the very top of the messages list (above the "Load earlier" area). When the sentinel becomes visible AND `hasEarlier` is true AND not `loadingEarlier`, call `handleLoadEarlier()` automatically.
The manual button can remain as a fallback but should be hidden or secondary.

## Acceptance Criteria

- [x] Loads only recent messages on mount (not full history)
- [ ] Scroll to bottom on mount automatically (bottomRef must be in JSX)
- [x] `hasEarlier` flag available when more messages exist
- [x] `loadEarlier()` triggers paginated load
- [x] `loadingEarlier` state available for spinner UI
- [x] "Load earlier messages" button rendered in ChatPanel (fallback)
- [x] Loading spinner shown while fetching earlier batch
- [x] Scroll position preserved after loading earlier messages (useLayoutEffect, no visual jump)
- [ ] Auto-load on scroll to top — IntersectionObserver on top sentinel
- [ ] Scroll to bottom on page entry — bottomRef div in JSX
