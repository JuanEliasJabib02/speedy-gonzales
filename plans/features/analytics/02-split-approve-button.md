# Split Approve Button — Clean vs With Fixes

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Replace the single "Mark as completed" button with two options: "Approve" (agent did it perfectly) and "Approve with fixes" (you had to fix things). This tracks quality in analytics.

## Checklist

- [x] In `convex/tickets.ts` `updateStatus`: accept optional `completionType` arg when status is `completed`
- [x] In `PlanViewer.tsx`: replace the "Mark as completed" button with a dropdown or two buttons:
  - ✅ "Approve" (green) → calls updateStatus with `status: "completed", completionType: "clean"`
  - 🔧 "Approve with fixes" (yellow/amber) → calls updateStatus with `status: "completed", completionType: "with-fixes"`
- [x] Both buttons should show when status is `review`
- [x] Style: "Approve" is the primary action (bigger/bolder), "Approve with fixes" is secondary
- [x] The `completionType` is stored on the ticket for analytics queries later

## Files

- `convex/tickets.ts`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/PlanViewer.tsx`

## Commits

- `aadbac4c7d3711e5201cd1f02d22daca9fa4ada8`
- `2e53fe55bc67b09442f653a548c761b1dfec3a37`
