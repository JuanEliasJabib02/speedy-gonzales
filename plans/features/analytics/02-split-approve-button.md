# Split Approve Button — Clean vs With Fixes

**Status:** todo
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Replace the single "Mark as completed" button with two options: "Approve" (agent did it perfectly) and "Approve with fixes" (you had to fix things). This tracks quality in analytics.

## Checklist

- [ ] In `convex/tickets.ts` `updateStatus`: accept optional `completionType` arg when status is `completed`
- [ ] In `PlanViewer.tsx`: replace the "Mark as completed" button with a dropdown or two buttons:
  - ✅ "Approve" (green) → calls updateStatus with `status: "completed", completionType: "clean"`
  - 🔧 "Approve with fixes" (yellow/amber) → calls updateStatus with `status: "completed", completionType: "with-fixes"`
- [ ] Both buttons should show when status is `review`
- [ ] Style: "Approve" is the primary action (bigger/bolder), "Approve with fixes" is secondary
- [ ] The `completionType` is stored on the ticket for analytics queries later

## Files

- `convex/tickets.ts`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/PlanViewer.tsx`
