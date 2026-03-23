# Fix FeatureLayout Drag Listener Leak

**Status:** review
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

If the FeatureLayout component unmounts while the user is dragging the resize handle, `mousemove` and `mouseup` listeners stay on `document` permanently. Also `document.body.style.cursor` and `document.body.style.userSelect` are never cleaned up.

## Checklist

- [x] Add a `useEffect` cleanup that removes `mousemove` and `mouseup` listeners on unmount
- [x] Reset `document.body.style.cursor` and `document.body.style.userSelect` on unmount
- [x] Use a ref to track whether a drag is in progress, clean up if component unmounts mid-drag

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/FeatureLayout.tsx`

## Commits
- `605545fe997ba698b2b3fbf99e28834d90f63c1f`
