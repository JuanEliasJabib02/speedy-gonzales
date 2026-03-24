# Plans & Tickets in Convex — Full Reactive Dashboard

**Status:** todo
**Priority:** high

## Overview

Move ALL plan content (epics, tickets, checklists) from git `.md` files to Convex. Git only holds code. Convex holds everything: plans, state, progress. Agents create plans directly in Convex → UI updates instantly. When dispatching Perro, the plan is fetched from Convex and injected into his prompt.

## Decisions

- Convex is the ONLY source of truth for plans AND state
- Git `.md` plan files are deprecated — new plans go straight to Convex
- Existing `.md` plans get migrated to Convex (one-time)
- Perro never reads `.md` plan files — he gets the plan injected via prompt
- The Speedy UI gets a plan editor (create/edit tickets from the dashboard)

## Architecture

```
Before:
  Juan → Charizard → writes .md → git push → webhook → Convex syncs → UI

After:
  Juan → Charizard → writes to Convex API directly → UI instant
  Juan → Speedy UI → creates ticket in dashboard → Convex → instant
  Dispatch Perro → fetch plan from Convex → inject into prompt → Perro codes
```

## Dependencies

- `convex-state-authority` must land first (state in Convex)

## Still needs

- [ ] Convex API endpoints for creating/editing epics and tickets
- [ ] Migrate plan content fields in schema (checklist items, file paths, patterns, UI contracts)
- [ ] Charizard create-feature skill writes to Convex instead of .md
- [ ] Perro prompt injection — fetch ticket plan from Convex API at dispatch time
- [ ] Speedy UI — ticket/epic editor (create, edit, reorder)
- [ ] One-time migration of existing .md plans to Convex
- [ ] Remove webhook sync dependency for plans
