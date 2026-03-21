# Agent Activity Notifications

**Status:** todo
**Priority:** medium

## What it does

Notify the user when the agent (Charizard or Perro salchicha) takes an action: pushes code, creates/updates a ticket, moves a status.

## Notification types

- 🔀 **agent-push** — "Charizard pushed 2 commits to speedy-gonzales"
- 🎫 **ticket-created** — "Charizard created: syntax-highlighting in chat"
- 🔄 **status-changed** — "Perro salchicha moved wire-convex → completed"

## Checklist

- [ ] Call `createNotification` from `syncRepoInternal` after upsert (detect new tickets vs updates)
- [ ] Call `createNotification` from git push actions (when agent commits)
- [ ] Include link to the affected feature/ticket
- [ ] Add to `upsertPlans` mutation: detect new tickets and create notifications

## Files

- `convex/githubSync.ts` (add notification calls)
- `convex/notifications.ts`
