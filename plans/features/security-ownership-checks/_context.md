# Security: Ownership Checks

**Status:** todo
**Priority:** critical

## Overview

Any authenticated user can currently modify or read any project's tickets, epics, and trigger syncs — regardless of whether they own the project. This feature adds ownership verification to all public mutations and queries that access project-scoped data.

Addresses audit findings #1, #2, #4.

## Still needs

- [ ] Add ownership check to ticket mutations (`updateStatus`)
- [ ] Add ownership check to epic mutations and queries (`updateStatus`, `getEpic`, `getByEpic`)
- [ ] Add ownership check to `syncProject` action

## Depends on

- `requireAuth` helper already exists and returns `userId` — just need to verify `project.userId === userId` after fetching the resource
