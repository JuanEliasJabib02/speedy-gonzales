# Hydration Mismatch Fix (BUG-01 v2)

**Status:** todo
**Priority:** medium

## What it does

`Math.random()` in skeleton loaders generates different values on server vs client, causing React hydration mismatch warnings.

## Affected files

- `FileTree.tsx` — SkeletonRows component
- `FileViewer.tsx` — skeleton loading state

## Fix

Replace random widths with a deterministic array:

```tsx
const SKELETON_WIDTHS = [75, 60, 85, 55, 70, 90, 65, 80, 50, 80, 65, 75]

// In SkeletonRows:
style={{ width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%`, marginLeft: `${(i % 3) * 12}px` }}
```

## Checklist

- [ ] Fix SkeletonRows in FileTree.tsx
- [ ] Fix skeleton in FileViewer.tsx
