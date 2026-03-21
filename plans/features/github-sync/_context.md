# GitHub Sync

**Status:** todo
**Priority:** critical

## Overview

Reads `plans/` from linked GitHub repos, parses the `.md` files, and stores the data in Convex. Keeps everything in sync via webhooks — when someone pushes to the repo, the app detects it and updates automatically.

This is the **core engine** of Speedy Gonzales. Without it, there's nothing to show.

## How it works

1. User connects GitHub account (OAuth)
2. When a repo is linked, register a webhook
3. On push → webhook fires → sync plans/ → update DB
4. UI updates in real-time

## Depends on

- Feature 2 (Projects) — needs repos linked

## Blocks

- Feature 5 (Kanban) — needs epics to display
- Feature 6 (Feature View) — needs tickets to display
