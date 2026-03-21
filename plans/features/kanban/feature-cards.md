# Feature Cards

**Status:** completed

## What it does

Individual cards within kanban columns. Each card represents a feature (epic) and shows its title, progress, ticket count, and priority.

## Checklist

- [x] Create `FeatureCard` component
- [x] Show feature title (text-sm font-medium)
- [x] Progress bar (h-1, bg-muted container, bg-primary fill)
- [x] Ticket count (text-xs text-muted-foreground)
- [x] Priority pill with color coding (low/medium/high/critical)
- [x] Click navigates to `/projects/[projectId]/features/[epicId]`
- [x] Hover effect: bg-accent

## Files

- `src/app/[locale]/(app)/projects/[projectId]/_components/FeatureCard.tsx`
