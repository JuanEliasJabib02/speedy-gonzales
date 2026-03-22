# Realtime Ticket Status

**Status:** todo
**Priority:** high

## Overview

The autonomous loop works on feature branches, but Convex only reads from main. This means the kanban stays frozen at `in-progress` until the PR is merged — you never see tickets move to `review` or `blocked` in real time.

This feature adds an HTTP endpoint that the loop calls after each ticket completes. Convex updates immediately, the kanban moves in real time. When the PR eventually merges and git syncs, the status matches what Convex already has.

Git (on the feature branch) remains the source of truth. Convex gets an early heads-up so the UI isn't blind.

## Architecture decisions

- New HTTP action: `POST /update-ticket-status` — takes `{ repoOwner, repoName, ticketPath, status }` and patches the ticket doc directly
- No auth for now (internal use only by the loop) — can add a shared secret later if needed
- The sync engine already uses content hashes — when the PR merges and the .md matches what Convex already has, it's a no-op. No conflicts.
- The autonomous-loop skill gets updated to call this endpoint after each ticket status change on the feature branch

## Still needs

- [ ] HTTP endpoint for direct ticket status update
- [ ] Update autonomous loop to call the endpoint after each ticket

## Depends on

- Nothing — works with the existing sync engine
