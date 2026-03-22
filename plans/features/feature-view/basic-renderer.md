# Basic Markdown Rendering

**Status:** todo
**Priority:** medium

## What it does

A simple line-by-line markdown renderer that handles headings, lists, checklists, bold text, and paragraphs. Used as the initial implementation before switching to react-markdown.

## Checklist

- [x] Parse `## ` and `### ` as headings
- [x] Parse `- [x]` and `- [ ]` as checkboxes
- [x] Parse `- **bold**` as bold list items
- [x] Parse `- ` as regular list items
- [x] Render paragraphs for plain text
- [x] Handle empty lines as spacing

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/PlanViewer.tsx`
