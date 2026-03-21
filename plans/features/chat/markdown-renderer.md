# Full Markdown Renderer in PlanViewer

**Status:** in-progress
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

- [ ] Replace the `content.split("\n").map(...)` block in `PlanViewer.tsx` with a `<ReactMarkdown>` component
- [ ] Add `remark-gfm` plugin for GitHub-flavored markdown (tables, strikethrough, task lists)
- [ ] Style markdown elements with Tailwind prose or custom className mapping:
  - `h2`, `h3`: existing heading styles
  - `ul`, `ol`: proper list styles
  - `code`: inline code style (bg-muted, rounded)
  - `pre > code`: syntax highlighted block via react-syntax-highlighter
  - `table`: styled table with borders
  - `blockquote`: left border + muted text
- [ ] Checklist items (`- [x]` / `- [ ]`) rendered as actual checkboxes (read-only)
- [ ] Links open in new tab with `target="_blank"`

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/PlanViewer.tsx`
