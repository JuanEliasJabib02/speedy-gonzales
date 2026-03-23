# PR Link on Kanban FeatureCard

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

When an epic is in `review` status and has an associated PR, show a small clickable GitHub icon/link on the FeatureCard in the kanban board. This lets Juan jump straight to the PR from the dashboard.

## Checklist

- [x] Add `prUrl` field (optional string) to the epics schema in Convex
- [x] Add a mutation or update path to set `prUrl` on an epic (Charizard calls this when creating a PR via GitHub API)
- [x] In `FeatureCard.tsx`: when status is `review` and `prUrl` exists, render a small GitHub icon that opens the PR in a new tab
- [x] Style: subtle, doesn't clutter the card — small icon next to priority badge or ticket count
- [x] Clicking the icon should NOT trigger the card's navigation (stopPropagation)

## Files

- `convex/schema/epics.ts` (or wherever the epics table is defined)
- `convex/epics.ts` (mutation to set prUrl)
- `src/app/[locale]/(app)/projects/[projectId]/_components/FeatureCard.tsx`

## Commits
- `52b936f9938da23dba753f78b31e9c8c963b2f29`
