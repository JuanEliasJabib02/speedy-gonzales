# Backlog Status

**Status:** todo
**Priority:** high

## Overview

Add a `backlog` status so features can be planned without entering the autonomous loop. Currently everything in `todo` gets picked up by the loop, which means you can't have "planned but not ready" features sitting in the kanban.

The flow becomes: `backlog → todo → in-progress → review → completed` (+ `blocked`).

- **backlog** = "planned, not ready for agents yet"
- **todo** = "ready to go, loop picks it up"
- Moving from backlog → todo is a manual action (drag in kanban or status change)

## Architecture decisions

- `backlog` is a new status value added to the union validators
- New kanban column before `todo`
- The loop already only queries `todo` tickets — no loop changes needed
- New features/tickets could default to `backlog` instead of `todo` (configurable per project)

## Still needs

- [ ] Add backlog status to schema validators and kanban UI
- [ ] Add backlog column to kanban board
