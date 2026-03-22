# File Tree (GitHub Codebase Browser)

**Status:** completed
**Priority:** medium

## What it does

Show a collapsible file tree of the project's GitHub repository inside the Feature View. Clicking a file opens it in the Code Viewer.

## Checklist

- [x] Create a Next.js API route to fetch the GitHub repo tree (`/api/repo-tree`)
- [x] Create a branches API route (`/api/repo-tree/branches`)
- [x] Build `FileTree` component — collapsible folders, file icons by extension
- [x] Render inside a scrollable left panel (replace or overlay the TicketSidebar when in Code mode)
- [x] Highlight the currently open file
- [x] Auto-expand parent folders of selected file
- [x] Branch selector dropdown
- [x] SessionStorage caching (5 min TTL)
- [x] Loading skeleton
- [x] Handle large repos: lazy-load subdirectories on expand

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/FileTree.tsx` (new)
- `src/app/api/repo-tree/route.ts` (new)
- `src/app/api/repo-tree/branches/route.ts` (new)
