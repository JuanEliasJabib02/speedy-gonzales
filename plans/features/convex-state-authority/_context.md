# Convex as Single Source of Truth for State

**Status:** todo
**Priority:** high

## Overview

Make Convex the absolute source of truth for ALL state (statuses, timestamps, progress, blocked reasons). Git `.md` files become static plans/instructions only — no status fields. Agents stop writing status to `.md` files and only call Convex endpoints. Epic status auto-calculates from ticket statuses.

## Decisions

- Convex auto-promotes epic status based on ticket statuses (no agent endpoint needed)
- `.md` files stop having Status fields — they're just plans for Perro
- All state mutations go through Convex HTTP endpoints
- The webhook sync parser ignores status in `.md` files going forward

## Architecture

Current flow:
```
Agent finishes ticket → calls /update-ticket-status → Convex updates ticket
BUT: epic status still relies on .md parsing or manual updates
```

New flow:
```
Agent finishes ticket → calls /update-ticket-status → Convex updates ticket
  → Convex trigger auto-recalculates epic status, progress, timestamps
  → UI updates reactively via subscriptions
  → No .md status writes needed
```

## Still needs

- [ ] Auto-calculate epic status from tickets
- [ ] Add timestamps to ticket status transitions
- [ ] Update autonomous-loop to stop writing status to .md files
- [ ] Clean up /update-ticket-status to handle commits and checklist progress
