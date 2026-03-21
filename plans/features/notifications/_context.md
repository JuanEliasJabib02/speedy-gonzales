# Notifications

**Status:** todo
**Priority:** medium

## Overview

Smart in-app notifications for Speedy Gonzales. When the agent finishes a task, pushes code, moves a ticket, or responds to a chat — the user gets notified without having to watch the screen. 

Think: GitHub-style notification center, but for your AI dev team.

## Scope

- Agent activity notifications (Perro salchicha pushed, Charizard created a ticket)
- Chat response notifications (agent replied to your message)
- Sync notifications (auto-sync completed, sync error)
- Notification center in the app header (bell icon + badge)
- Real-time via Convex reactive queries

## Tickets

- `notifications-schema.md` — Convex schema for notifications
- `notification-center.md` — bell icon + dropdown in header
- `agent-activity-notifications.md` — notify on git push, ticket creation, status change
- `chat-response-notifications.md` — notify when agent replies
