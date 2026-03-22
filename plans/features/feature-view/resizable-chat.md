# Resizable Chat Panel

**Status:** completed
**Priority:** medium

## What it does

The chat panel width can be adjusted by dragging its left edge. Allows the user to give more or less space to the chat vs the plan viewer.

## Checklist

- [x] Create `ResizeHandle` component (1px drag handle, cursor-col-resize)
- [x] Track drag state in FeatureLayout with mousedown/mousemove/mouseup
- [x] Min width: 320px, Max width: 700px, Default: 380px
- [x] Prevent text selection during drag (userSelect: none)
- [x] Handle hover state on resize handle (bg-accent)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ResizeHandle.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/FeatureLayout.tsx`
