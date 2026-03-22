# Ticket Status HTTP Endpoint

**Status:** review
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Creates a new Convex HTTP action that accepts a POST request to update a ticket's status directly. This is called by the autonomous loop when Perro finishes a ticket on a feature branch, so the kanban updates immediately without waiting for a PR merge.

## Checklist

- [x] Create `update-ticket-status` HTTP route in `convex/http.ts` (or wherever HTTP routes are defined)
- [x] Route: `POST /update-ticket-status`
- [x] Request body: `{ repoOwner: string, repoName: string, ticketPath: string, status: string, blockedReason?: string }`
- [x] Validate status is one of: `todo`, `in-progress`, `review`, `completed`, `blocked`
- [x] Look up project by `repoOwner` + `repoName` using `projects.by_repo` index
- [x] Look up ticket by `path` field matching `ticketPath` within that project's epics
- [x] Patch the ticket's `status` field. If status is `blocked` and `blockedReason` is provided, also store it
- [x] Return `{ ok: true, ticketId, previousStatus, newStatus }` on success
- [x] Return `{ ok: false, error: "..." }` with 404 if project or ticket not found
- [x] If the epic should auto-update status based on tickets (e.g. all tickets review → epic review), trigger that logic too

## Files

- `convex/http.ts`
- `convex/tickets.ts` (new internal mutation for status patch)
