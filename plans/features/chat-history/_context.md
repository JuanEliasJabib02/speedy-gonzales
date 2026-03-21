# Chat History

**Status:** todo
**Priority:** medium

## Overview

A view that lists all recent chat conversations across features, sorted by last activity. Conversations with unread agent responses float to the top. Think: iMessage-style chat list.

Makes it easy to jump between feature conversations without hunting through the kanban.

## Scope

- List view: all features with chat activity, sorted by last message
- Unread indicator: features where the agent responded since you last read
- Preview: last message snippet
- Quick navigation: click to jump to the feature chat
- Could live as a sidebar, a modal, or a dedicated `/chats` route

## Tickets

- `chat-history-query.md` — Convex query to get recent chats per feature
- `chat-history-view.md` — UI for the chat list
- `unread-tracking.md` — track which messages have been read per user
