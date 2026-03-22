# Loop Status Indicator

**Status:** in-progress
**Priority:** low
**Agent:** Charizard 🔥

## What it does

Show the autonomous loop status in the project header — whether it's idle, running, or errored, and when it last ran. Sits next to the agent indicator.

## States

- **Off** — `autonomousLoop: false` → show nothing or a muted "Loop off" label
- **Idle** — loop enabled but not running → green dot + "Idle" + "Last run: 2h ago"
- **Running** — loop is actively processing → pulsing dot + "Running" + current ticket name
- **Error** — last run failed → red dot + "Error" + error message on hover

## Checklist

- [ ] Add loop status display to `ProjectHeader.tsx` (next to agent indicator)
- [ ] Show only when `autonomousLoop === true`
- [ ] Format `lastLoopAt` as relative time ("2h ago", "just now")
- [ ] Pulsing animation when `loopStatus === "running"`
- [ ] Tooltip with error message when `loopStatus === "error"`

## Files

- `src/app/[locale]/(app)/projects/[projectId]/_components/ProjectHeader.tsx`
