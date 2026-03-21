# CommitsSection Post-Unmount Fix (BUG-02 v2)

**Status:** todo
**Priority:** medium

## What it does

CommitsSection in PlanViewer.tsx fires state updates after the component unmounts (if user navigates away while commits are loading). Also fetchBranches in FileTree.tsx has the same issue.

## Fix

Add cancelled flag to useEffect:

```tsx
// PlanViewer.tsx CommitsSection
useEffect(() => {
  let cancelled = false
  for (const sha of commits) {
    if (details[sha]) continue
    fetch(`/api/commit-diff?...`)
      .then(res => res.json())
      .then(data => { if (!cancelled) setDetails(prev => ({ ...prev, [sha]: data })) })
      .catch(() => { if (!cancelled) setDetails(prev => ({ ...prev, [sha]: null })) })
  }
  return () => { cancelled = true }
}, [commits.join(","), repoOwner, repoName])

// FileTree.tsx fetchBranches — same pattern
```

## Checklist

- [ ] Add cancelled flag to CommitsSection useEffect in PlanViewer.tsx
- [ ] Add cancelled flag to fetchBranches in FileTree.tsx
