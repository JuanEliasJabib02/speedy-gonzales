# Projects

**Status:** in-progress
**Priority:** high

## Overview

The user can create, view, edit, and delete projects. Each project has exactly one GitHub repo — one project, one repo. A project represents a product or application being built.

## How projects get loaded

The ideal flow is: OpenClaw has a config file that lists all projects and their repos. Speedy Gonzales reads this config and shows the projects automatically.

**Fallback for MVP:** Manual project creation from the UI. User types a name, description, and pastes repo URL.

## UI built (mock)

The create project UI is built as part of Dashboard (CreateProjectDialog), but not wired to any backend. All data is currently mock.

- [x] CreateProjectDialog with name, description, repo URL fields
- [ ] Convex schema, mutations, and queries (all todo)

## Depends on

- Feature 1 (Auth) — needs authenticated user

## Blocks

- Feature 4 (GitHub Sync) — needs repos linked to sync
- Feature 3 (Dashboard) — needs projects to display
