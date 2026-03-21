# Kanban

**Status:** in-progress
**Priority:** high

## Overview

When you click a project from the dashboard, you see a kanban board of features (epics). Each card is a feature, organized by status columns. Click a feature card to enter the Feature View.

## Columns

1. **Todo** — not started
2. **In Progress** — agent is working
3. **Review** — agent finished, needs human review
4. **Blocked** — agent got stuck
5. **Completed** — hidden by default, toggle to show

## Depends on

- Feature 4 (GitHub Sync) — needs epics data in DB

## Blocks

- Feature 6 (Feature View) — kanban cards link to feature detail
