# File Viewer

**Status:** todo
**Priority:** medium

## What it does

Display the content of a selected file from GitHub with syntax highlighting. Replaces the ChatPanel when in "Code" mode.

## Checklist

- [ ] Create `FileViewer` component
- [ ] Fetch file content via GitHub Blob API (`provider.fetchFileContent`) when a file is selected
- [ ] Render with `react-syntax-highlighter` (language auto-detected from file extension)
- [ ] Show file path as breadcrumb header
- [ ] Show loading skeleton while fetching
- [ ] Handle binary files (images, fonts) — show placeholder
- [ ] Line numbers optional (toggle)

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/FileViewer.tsx` (new)
- `src/app/api/repo-file/route.ts` (new)
