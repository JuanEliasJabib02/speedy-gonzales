# Agent Block Notes

**Status:** completed
**Priority:** medium

## What it does

When the agent marks a ticket as "blocked", it leaves a note explaining WHY it's blocked. These notes are visible in the feature-view so Juan can quickly scan all blocks and unblock tickets without digging into files.

## User flow

1. Agent (Perro/Charizard) blocks a ticket → adds a `## Blocked` section in the ticket .md with the reason
2. Sync picks up the block note from the markdown
3. In feature-view, blocked tickets show a red banner with the block reason
4. In the ticket sidebar, blocked tickets show a warning icon + short reason on hover
5. Optional: a "Blocks" filter/view that shows all blocked tickets across the feature with their reasons

## Markdown format

```markdown
## Blocked

Waiting for GitHub OAuth to be configured. Can't fetch private repo commits without auth token.
```

## Checklist

- [ ] Define `## Blocked` section format in SPEC.md
- [ ] Update sync parser to extract block reason from `## Blocked` section
- [ ] Store block reason in Convex ticket record
- [ ] Show block reason banner in PlanViewer when ticket is blocked
- [ ] Show warning icon + reason tooltip in TicketSidebar for blocked tickets
- [ ] Add "Blocked" filter in ticket sidebar to show only blocked tickets
