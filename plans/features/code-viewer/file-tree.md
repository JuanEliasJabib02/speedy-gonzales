# File Tree (GitHub Codebase Browser)

**Status:** todo
**Priority:** medium

## What it does

Show a collapsible file tree of the project's GitHub repository inside the Feature View. Clicking a file opens it in the Code Viewer.

## Checklist

- [ ] Create a Convex query or Next.js API route to fetch the GitHub repo tree (reuse `provider.fetchTree` from `githubSync.ts`)
- [ ] Build `FileTree` component — collapsible folders, file icons by extension
- [ ] Render inside a scrollable left panel (replace or overlay the TicketSidebar when in Code mode)
- [ ] Highlight the currently open file
- [ ] Handle large repos: lazy-load subdirectories on expand

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/FileTree.tsx` (new)
- `src/app/api/repo-tree/route.ts` (new) or reuse existing GitHub provider
