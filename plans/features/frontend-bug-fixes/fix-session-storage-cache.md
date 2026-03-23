# Fix CommitDiffPanel sessionStorage Cache

**Status:** review
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

CommitDiffPanel caches every commit diff in `sessionStorage` with no size limit. Large diffs can exceed the 5-10MB storage limit, causing silent `QuotaExceededError`. Also adds abort controller to `useCommitTimeline`.

## Checklist

- [x] Add a try/catch around `sessionStorage.setItem` to handle `QuotaExceededError`
- [x] On quota error: clear oldest cached entries (LRU or clear all) then retry
- [x] Optionally: limit cache to last N diffs (e.g. 20) instead of unlimited
- [x] In `useCommitTimeline`: add `AbortController` to fetch calls, abort on unmount via useEffect cleanup

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/CommitDiffPanel.tsx`
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_hooks/useCommitTimeline.ts`
