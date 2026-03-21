# Dashboard

**Status:** todo
**Priority:** high

## Overview

The main page after login. Shows all the user's projects as cards. This is the entry point to everything — from here you click into a project.

## UI built (mock)

- [x] DashboardHeader with title + "New project" button (opens CreateProjectDialog)
- [x] Project cards grid (responsive: 1/2/3 cols)
- [x] ProjectCard shows: name, description, stats line (activeFeatures, totalFeatures, ticketCount) — NO progress bar
- [x] Create project dialog (name + description + repo URL fields, cancel/create buttons)
- [x] Empty state (FolderKanban icon + "No projects yet" heading + CTA button)
- [x] Single mock project: "Speedy Gonzales"

## Components

- `DashboardHeader` — page title + new project button
- `ProjectCard` — card with name, description, stats text
- `CreateProjectDialog` — shadcn Dialog with form fields
- `EmptyState` — centered layout with icon + message + CTA

## Still needs

- [ ] Wire to Convex queries (useQuery for projects, useMutation for create)
- [ ] Validation in CreateProjectDialog (non-empty name, valid repo URL)

## Depends on

- Feature 2 (Projects) — needs project CRUD to exist
