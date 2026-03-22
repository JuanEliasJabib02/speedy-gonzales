# Autonomous Dev Loop

**Status:** in-progress
**Priority:** critical

## Overview

The feature that turns Speedy from an "IDE without an editor" into a **development team that works while you sleep**.

Charizard (the OpenClaw agent) runs 24/7 on the VPS. A cron job fires periodically, queries Speedy for available tickets, analyzes file dependencies to avoid conflicts, dispatches work to Perro salchicha (Claude Code), and sends you a daily report of what got done. You define what to build. The agent executes it.

## Architecture

- **Two-layer agent model** — Charizard (orchestration) dispatches to Perro salchicha (code execution)
- **Convex as config source** — active projects, local paths, and settings stored in Convex
- **Dependency analysis** — tickets that touch the same files run sequential, not parallel
- **Revert as safe exit** — failed tickets get `git revert` + `blocked` status
- **Review is the finish line** — Perro ends at `review`. Only Juan moves to `completed`
- **Cron-driven** — runs on a schedule (every 30 min), not event-driven

## Tickets

1. **loop-schema-fields** (critical) — Add autonomousLoop, localPath, slackChannel to projects schema
2. **active-projects-query** (critical) — Queries to get active projects and todo tickets
3. **loop-trigger** (high) — Entry point: read projects and tickets from Convex
4. **dependency-analysis** (high) — Analyze file conflicts, build execution queue
5. **dispatch-and-monitor** (high) — Spawn Perro, monitor, crash recovery
6. **project-settings-ui** (medium) — Toggle loop, set path, set Slack channel
7. **loop-status-indicator** (low) — Show loop status in project header
8. **cron-setup** (medium) — Register OpenClaw cron jobs

## Still needs

- [ ] Schema fields for loop config
- [ ] Convex queries for active projects + todo tickets
- [ ] Loop trigger logic in Charizard skill
- [ ] Dependency analysis + queue builder
- [ ] Dispatch + monitor + crash recovery
- [ ] Project settings UI
- [ ] Loop status indicator in header
- [ ] OpenClaw cron configuration
