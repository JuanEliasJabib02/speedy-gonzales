# Dashboard Improvements

**Status:** todo
**Priority:** high

## Overview

The dashboard (project list view) is functional but barebones — it shows project name, description, repo owner/name, and sync status. No progress data, no agent visibility, no loop status. This feature adds real information density to the ProjectCard so you can see at a glance what's happening in each project.

## Architecture decisions

- New `getProjectStats` Convex query that counts tickets by status per project (join projects → epics → tickets)
- Stats are computed server-side, not client-side — avoid fetching all tickets just to count them
- Refactor `page.tsx` to use a `_hooks/useDashboard.ts` composer hook per project conventions
- Delete unused `_constants/mock-data.ts`
- All new UI uses existing shadcn/ui components and design system tokens

## Still needs

- [ ] Project stats query — Convex query to count tickets by status per project
- [ ] Loop and agent status indicator — show autonomous loop toggle + agent status on ProjectCard
- [ ] Dashboard cleanup — delete mock data, extract useDashboard hook

## Depends on

- Nothing — all data already exists in schema, just needs to be queried and rendered
