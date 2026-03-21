# Feature 3: Dashboard

**Status:** todo
**Phase:** 1

## What it does

The main page after login. Shows all the user's projects as cards with progress bars. This is the entry point to everything — from here you click into a project.

## UI

```
┌─────────────────────────────────────────────┐
│  Speedy Gonzales                       [+]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────┐        │
│  │ HostCo                          │        │
│  │ ████████████░░░░░░░░  60%       │        │
│  │ 3 features · 12 tickets         │        │
│  └─────────────────────────────────┘        │
│                                             │
│  ┌─────────────────────────────────┐        │
│  │ Speedy Gonzales                 │        │
│  │ ██░░░░░░░░░░░░░░░░░░  10%      │        │
│  │ 1 feature · 4 tickets           │        │
│  └─────────────────────────────────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

## Project card contents

- Project name
- Description (if set)
- Progress bar — percentage of completed features
- Feature count + ticket count
- Click → navigates to project view (Kanban)

## Actions

- **[+] button** — opens "Create project" dialog
- **Click card** — navigates to `/projects/[projectId]`

## Progress calculation

```
Project progress = average of all feature (epic) progress percentages
Feature progress = (completed tickets / total tickets) × 100
```

If a project has no synced features yet (no `plans/` data), show 0% with a message like "No plans synced yet."

## Empty state

When the user has no projects:
- Show a centered message: "No projects yet"
- Prominent "Create your first project" button

## Frontend components

```
src/app/[locale]/(app)/dashboard/
├── _components/
│   ├── ProjectCard.tsx           # Card with name, progress, stats
│   ├── CreateProjectDialog.tsx   # Dialog to create new project
│   └── EmptyState.tsx            # Shown when no projects exist
├── _hooks/
│   └── useDashboard.ts           # Wires useQuery for projects + create mutation
└── page.tsx                      # Composes everything
```

## Depends on

- Feature 2 (Projects) — needs project CRUD to exist

## Blocks

- Feature 5 (Kanban) — dashboard links to project kanban view
