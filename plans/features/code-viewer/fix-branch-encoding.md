# Fix Branch Encoding in GitHub API Routes

**Status:** completed
**Priority:** high

## Problem

`encodeURIComponent("feature/agent-context")` returns `"feature%2Fagent-context"` which GitHub API does not recognize as a valid branch ref — returns 404.

## Fix

Encode each path segment separately, preserving the `/` separator:

```ts
branch.split("/").map(encodeURIComponent).join("/")
```

Applied to both `/api/repo-tree/route.ts` and `/api/repo-file/route.ts`.

## Checklist

- [x] Fix branch encoding in `repo-tree` API route
- [x] Fix ref encoding in `repo-file` API route
- [x] Commit and push fix

## Files

- `src/app/api/repo-tree/route.ts`
- `src/app/api/repo-file/route.ts`
