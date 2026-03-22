# Autonomous Dev Loop

**Status:** planned
**Priority:** critical

## Overview

The feature that turns Speedy from an "IDE without an editor" into a **development team that works while you sleep**.

Charizard (the OpenClaw agent) runs 24/7 on the VPS. A cron job fires periodically, queries Speedy for available tickets, analyzes file dependencies to avoid conflicts, dispatches work to Perro salchicha (Claude Code), and sends you a daily Slack report of what got done. You define what to build. The agent executes it.

This is not a "vibe coding" agent that guesses what you want. It's an orchestrated system that follows strict rules: clear tickets, sequential queue (no parallel edits to the same files), immediate revert on failure, blocked status when context is missing — and always lands in `review`, never `completed`. Juan reviews and approves.

## Architecture decisions

- **Two-layer agent model** — Charizard (planning + orchestration) dispatches to Perro salchicha (code execution). Charizard never writes code directly; Perro salchicha never makes architectural decisions.
- **Convex as config source** — which projects are active, their `localPath` on the VPS, and their Slack channel are stored in Convex. No hardcoded project list in the agent.
- **Dependency analysis before dispatch** — Charizard reads ticket descriptions and infers which files each ticket touches. Tickets that overlap go sequential. Never parallel.
- **Revert as the safe exit** — if Perro salchicha fails mid-execution, the only valid move is `git revert` + mark ticket as `blocked` with a reason. No partial work left in the branch.
- **Cron-driven, not event-driven** — the loop runs on a schedule (e.g. every 30 min overnight). Not triggered by ticket creation — avoids accidental back-to-back dispatches.
- **`review` is the finish line** — Perro salchicha always ends at `review`. `completed` is a human action only.
- **Tests as safety net** — once Chat is finished, test coverage gets added. Tests let Perro validate before pushing. Without tests, the agent is flying blind.
- **Slack as the notification channel** — all reports and block alerts go to Slack. Per-project channel config, fallback to default channel.

## How it works

### The full loop (typical overnight)

```
23:00 — Juan defines tickets in Speedy and goes to sleep
         ↓
Every N min — Cron fires, Charizard wakes up
         ↓
Charizard queries Convex
→ projects with autonomousLoop: true and localPath configured
→ tickets in `todo` status for each active project
         ↓
    YES tickets available:
      → Analyze file dependencies across pending tickets
      → Build sequential queue (no overlapping files in parallel)
      → Dispatch Perro salchicha with first ticket in queue
      → Perro: code → commit → push → open PR → mark ticket as `review`
      → Repeat for next ticket in queue
         ↓
    NO tickets available (all blocked):
      → Charizard notifies Slack:
        "Nothing to do — these tickets are blocked: [list]. Need your input."
         ↓
08:00 — Daily report fires (separate cron)
→ Juan receives Slack report: what was completed, what's in review, what's blocked
```

### Dispatch rules (Charizard layer)
- Before any dispatch, analyze which files each ticket is likely to touch
- **Nothing in parallel that touches the same files** — strict sequential queue
- If two tickets both modify `ChatPanel.tsx`, they run back-to-back, not simultaneously
- If all available tickets are blocked → notify Juan immediately, do not guess or improvise

### Execution rules (Perro salchicha layer)
- If the ticket description is unclear → mark `blocked` immediately, never interpret
- If anything breaks mid-execution → `git revert` everything + mark `blocked` with a clear reason
- **Never push broken code** — revert is always the safe exit
- Always end at `review`, never at `completed`
- Commit messages follow the project's conventions

## Daily Slack report

**When:** configured as a cron job in OpenClaw (e.g. 8:00 AM Bogotá)  
**Where:** Slack — per-project channel (`slackChannel` field in Convex), fallback to default  
**Format:**

```
🤖 Autonomous Dev Loop — Overnight Report

📁 speedy-gonzales
  ✅ Completed → stream-reconnect (PR: #42)
  🔄 In review → chat-pagination (PR: #43)
  🚫 Blocked → advanced-notifications — reason: ticket scope too vague

📁 action-experience
  ✅ Completed → reset-password-flow (PR: #17)

⚠️ Needs your input:
  - advanced-notifications in speedy-gonzales is blocked. Clarify scope?
```

## Configuration (per project)

Stored in Convex on each project record:

| Field | Type | Description |
|---|---|---|
| `autonomousLoop` | boolean | Whether the loop is active for this project |
| `localPath` | string | Path on the VPS where the repo is cloned (e.g. `/home/juan/Projects/speedy-gonzales`) |
| `slackChannel` | string | Slack channel for notifications (e.g. `#speedy-gonzales`) |

Charizard only picks up projects where `autonomousLoop: true` and `localPath` is set. Everything else is ignored.

**OpenClaw cron config (`openclaw.json`):**
The loop is registered as a cron job that fires Charizard with a system event. Schedule and behavior are configured there. Project selection comes from Convex — not hardcoded in the cron payload.

## UI in Speedy

- Toggle "Autonomous Loop" on/off per project (in project settings)
- Input for `localPath` (VPS path)
- Slack channel selector / input
- Loop status indicator: idle / running / last run timestamp
- Last report summary (expandable)

## Expected success rate

| Ticket type | Autonomous success rate |
|---|---|
| UI components (Tailwind + shadcn) | ~85% |
| Convex mutations / queries | ~75% |
| Integration features (Convex + UI wired together) | ~65% |
| Debugging known bugs | ~50% |
| Debugging vague bugs | ~25% |

**Overall average: ~70% of tickets complete overnight without intervention.**

The remaining 30% land in `blocked` with a clear reason — Juan resolves them in the morning.

## What needs to be built

### Backend / Convex
- [ ] `autonomousLoop`, `slackChannel`, `localPath` fields in projects schema
- [ ] Query: get all active projects for the loop (`autonomousLoop: true` + `localPath` set)
- [ ] Query: get `todo` tickets per project, ordered by priority

### Charizard logic (OpenClaw agent)
- [ ] Read active projects from Convex on loop trigger
- [ ] Dependency analysis: infer files touched per ticket from description + title
- [ ] Queue builder: sequential ordering with no file conflicts
- [ ] Dispatch logic: spawn Perro salchicha with ticket context
- [ ] Block detection: notify Slack when all tickets are blocked
- [ ] Daily report generator + Slack delivery

### Perro salchicha (execution)
- [ ] Receive ticket context as task
- [ ] Implement, commit, push, open PR
- [ ] Mark ticket as `review` on success
- [ ] `git revert` + mark `blocked` on failure
- [ ] Report back to Charizard with result

### UI
- [ ] Project settings: autonomous loop toggle
- [ ] `localPath` input field
- [ ] Slack channel input
- [ ] Loop status indicator (idle / running / last run)
- [ ] Last report summary card in project view

### Infrastructure
- [ ] Cron job in OpenClaw for the loop (every N minutes, overnight window)
- [ ] Cron job in OpenClaw for the daily report (8:00 AM Bogotá)
- [ ] Slack integration in OpenClaw (already configured, needs project routing)

## Depends on

- Auto-Sync — Charizard reads ticket data from Convex (populated by sync)
- OpenClaw Chat — Charizard's agent identity and memory already live there
- Slack plugin — already connected to OpenClaw, needs per-channel routing
- Projects feature — `autonomousLoop` config lives on project records
