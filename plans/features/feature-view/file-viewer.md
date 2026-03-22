# File Viewer

**Status:** completed
**Priority:** medium

## What it does

Display the content of a selected file from GitHub with syntax highlighting. Replaces the ChatPanel when in "Code" mode.

## Checklist

- [x] Create `FileViewer` component
- [x] Fetch file content via GitHub Contents API (`/api/repo-file` route)
- [x] Render with `react-syntax-highlighter` (language auto-detected from file extension)
- [x] Show file path as breadcrumb header
- [x] Show loading skeleton while fetching
- [x] Handle binary files (images, fonts) — show placeholder
- [x] Line numbers visible by default

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/FileViewer.tsx` (new)
- `src/app/api/repo-file/route.ts` (new)
