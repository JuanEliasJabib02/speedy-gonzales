# Commit Diff Viewer

**Status:** todo
**Priority:** high

## What it does

When the agent mentions a commit in the chat (via a commit card), the user can click to see the full diff inline in Speedy — without going to GitHub.

## User flow

1. Agent pushes code → chat shows a commit card (hash, message, files changed)
2. User clicks "View diff" on the commit card
3. A slide-over panel opens showing the full diff of that commit
4. Syntax-highlighted diff with added/removed lines, file list on the left

## Checklist

- [ ] Add "View diff" button to `CommitCard` in `ChatMessage.tsx`
- [ ] Create `CommitDiffPanel.tsx` — slide-over/drawer component
- [ ] Create `/api/commit-diff/route.ts` — server-side proxy to GitHub API (avoids CORS + keeps PAT server-side)
  - `GET /api/commit-diff?owner=X&repo=Y&sha=Z`
  - Uses `GITHUB_PAT` env var
  - Returns parsed diff data
- [ ] Parse the GitHub diff response into files + hunks
- [ ] Render with `react-diff-viewer-continued` or custom syntax-highlighted diff
- [ ] File tree on the left (list of changed files), diff on the right
- [ ] Handle large diffs gracefully (truncate at 500 lines with "Show more")
- [ ] Loading skeleton while fetching

## API

GitHub endpoint:
```
GET https://api.github.com/repos/{owner}/{repo}/commits/{sha}
Headers: { Authorization: Bearer {GITHUB_PAT}, Accept: application/vnd.github.v3.diff }
```

Returns raw unified diff format.

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx` (add button to CommitCard)
- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/CommitDiffPanel.tsx` (new)
- `src/app/api/commit-diff/route.ts` (new)

## Dependencies

- `react-diff-viewer-continued` or `diff2html` for rendering
- `GITHUB_PAT` env var (already exists)
- Existing `CommitCard` component in `ChatMessage.tsx`
