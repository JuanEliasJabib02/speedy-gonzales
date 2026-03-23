# PR Link on Kanban FeatureCard

**Status:** todo
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

When an epic is in `review` status and has an associated PR, show a small clickable GitHub icon/link on the FeatureCard in the kanban board. This lets Juan jump straight to the PR from the dashboard.

## Checklist

- [ ] Add `prUrl` field (optional string) to the epics schema in Convex
- [ ] Add a mutation or update path to set `prUrl` on an epic (Charizard calls this when creating a PR via GitHub API)
- [ ] In `FeatureCard.tsx`: when status is `review` and `prUrl` exists, render a small GitHub icon that opens the PR in a new tab
- [ ] Style: subtle, doesn't clutter the card — small icon next to priority badge or ticket count
- [ ] Clicking the icon should NOT trigger the card's navigation (stopPropagation)

## Files

- `convex/schema/epics.ts` (or wherever the epics table is defined)
- `convex/epics.ts` (mutation to set prUrl)
- `src/app/[locale]/(app)/projects/[projectId]/_components/FeatureCard.tsx`
