# Project Cards Grid

**Status:** completed

## What it does

Responsive grid of project cards on the dashboard. Each card shows project name, description, and a stats text line (active features, total features, ticket count). No progress bar — stats are shown as plain text. Click navigates to the kanban view.

## Checklist

- [x] Create `ProjectCard` component with name, description, stats text line
- [x] Stats line: "N active · N features · N tickets" (text-xs, text-muted-foreground)
- [x] Responsive grid: 1 col mobile, 2 cols md, 3 cols lg
- [x] Card styling: bg-card, rounded-lg, border, hover:bg-accent
- [x] Link to `/projects/[projectId]` using next-intl Link
- [x] Single mock project data: "Speedy Gonzales"

## Files

- `src/app/[locale]/(app)/dashboard/_components/ProjectCard.tsx`
