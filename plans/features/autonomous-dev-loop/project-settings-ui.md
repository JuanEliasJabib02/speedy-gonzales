# Project Settings — Autonomous Loop

**Status:** todo
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Add a settings panel to the project page where Juan can configure the autonomous loop: toggle it on/off, set the local path, and configure the Notifications toggle.

## User flow

1. Click the settings gear icon in ProjectHeader (already exists for concurrency)
2. Expand the popover to include autonomous loop settings
3. Toggle switch for "Autonomous Loop"
4. Text input for "Local Path" (server path to cloned repo)
5. Text input for "Slack Channel" (e.g. on/off)
6. Save button

## Checklist

- [ ] Extend `ConcurrencySettings.tsx` popover OR create a new `ProjectSettings.tsx` that includes both concurrency and loop settings
- [ ] Add toggle switch for `autonomousLoop` (boolean)
- [ ] Add text input for `localPath` with placeholder (e.g. `/home/juan/Projects/speedy-gonzales`)
- [ ] Add text input for `notificationEnabled` with placeholder (e.g. `on/off`)
- [ ] Update `updateSettings` mutation to accept the new fields
- [ ] Show current loop status (idle/running) and last run timestamp

## Files

- `convex/projects.ts` — extend `updateSettings` mutation
- `src/app/[locale]/(app)/projects/[projectId]/_components/ConcurrencySettings.tsx` or new component
