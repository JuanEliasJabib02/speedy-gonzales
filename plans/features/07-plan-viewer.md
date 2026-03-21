# Feature 7: Plan Viewer

**Status:** todo
**Phase:** 4

## What it does

Renders a PLAN.md file as formatted HTML inside the Feature View center panel. This is the reading experience — the user should be able to read plans comfortably, like documentation.

## What it renders

A PLAN.md file with frontmatter:

```markdown
---
title: Implement Login
status: in_progress
priority: high
---

## Description
Implement the login flow with email and password.

## Checklist
- [x] Create login form
- [x] Connect to auth provider
- [ ] Handle error states
- [ ] Redirect after successful login

## Notes
Use the existing `useAuthActions` hook from Convex Auth.
```

Gets rendered as:

- **Header:** Title + status badge + priority badge
- **Progress bar:** "2/4 tasks done (50%)" — calculated from checkboxes
- **Body:** Full markdown rendered as HTML
  - Headings, paragraphs, bold/italic
  - Code blocks with syntax highlighting (optional)
  - Checklists with checkbox styling (read-only)
  - Links, images, tables
  - GFM (GitHub Flavored Markdown) support

## Checklist progress

Parsed from the markdown body:
- Count `- [x]` (checked) and `- [ ]` (unchecked)
- Show as: progress bar + "X/Y tasks done"
- Displayed at the top of the viewer, below the title

## Dependencies

- `react-markdown` — markdown to React components
- `remark-gfm` — GitHub Flavored Markdown plugin (tables, strikethrough, task lists)

## Frontend component

```
src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/
├── _components/
│   ├── PlanViewer.tsx          # Main component: header + progress + rendered markdown
│   └── ChecklistProgress.tsx   # Small progress bar for checklist
```

`PlanViewer` receives:
- `title: string`
- `status: string`
- `priority: string`
- `content: string` (raw markdown body, without frontmatter)
- `checklistProgress: number` (0-100)

All data comes from the Convex DB (already parsed during sync).

## Depends on

- Feature 4 (GitHub Sync) — content comes from parsed PLAN.md

## Part of

- Feature 6 (Feature View) — this is the center panel
