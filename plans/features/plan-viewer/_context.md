# Plan Viewer

**Status:** todo
**Priority:** medium

## Overview

Renders a PLAN.md file as formatted HTML inside the Feature View center panel. The reading experience — the user should be able to read plans comfortably, like documentation.

## What it renders

- Header: Title + status badge + priority badge
- Progress bar: "X/Y tasks done" — calculated from checkboxes (ChecklistProgress component)
- Body: Line-by-line markdown rendering (basic renderer — headings, lists, checklists, bold, paragraphs)

## UI built (mock)

- [x] PlanViewer component with title, status/priority pills
- [x] ChecklistProgress bar: "completed/total tasks done" text + thin h-1.5 progress bar
- [x] Basic line-by-line markdown renderer (## headings, - [x] checklists, **bold**, - lists, paragraphs)
- [x] Live plan sync via useLivePlan hook (polls filesystem API every 3s in dev)

## Components

- `PlanViewer` — center panel content rendering
- `ChecklistProgress` — progress indicator below plan title

## Still needs

- [ ] Replace basic renderer with react-markdown + remark-gfm
- [ ] Syntax-highlighted code blocks (optional)
- [ ] GFM tables support
- [ ] Wire to Convex queries (content from DB instead of filesystem)

## Depends on

- Feature 4 (GitHub Sync) — content comes from parsed PLAN.md

## Part of

- Feature 6 (Feature View) — this is the center panel
