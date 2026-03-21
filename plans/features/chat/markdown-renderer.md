# Full Markdown Renderer in PlanViewer

**Status:** review
**Priority:** medium

## Problem

The current `PlanViewer` renders markdown line-by-line with manual string matching. It doesn't support:
- Code blocks with syntax highlighting
- Tables
- Nested lists
- Bold/italic inline formatting
- Blockquotes
- Horizontal rules

## Solution

Replace the manual render with `react-markdown` + `remark-gfm` (already installed). Use `react-syntax-highlighter` for code blocks (already used in ChatMessage).

## Checklist

- [x] Replace the `content.split("\n").map(...)` block in `PlanViewer.tsx` with a `<ReactMarkdown>` component
- [x] Add `remark-gfm` plugin for GitHub-flavored markdown (tables, strikethrough, task lists)
- [x] Style markdown elements with Tailwind prose or custom className mapping:
  - `h2`, `h3`: existing heading styles
  - `ul`, `ol`: proper list styles
  - `code`: inline code style (bg-muted, rounded)
  - `pre > code`: syntax highlighted block via react-syntax-highlighter
  - `table`: styled table with borders
  - `blockquote`: left border + muted text
- [x] Checklist items (`- [x]` / `- [ ]`) rendered as actual checkboxes (read-only)
- [x] Links open in new tab with `target="_blank"`

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/PlanViewer.tsx`
