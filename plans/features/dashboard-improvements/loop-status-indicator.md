# Loop and Agent Status Indicator

**Status:** review
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Shows the autonomous loop status and agent info on each ProjectCard in the dashboard. Right now the schema has `autonomousLoop`, `loopStatus`, `agentName`, `agentEmoji`, `agentStatus`, and `agentCurrentFeature` — none of it is rendered.

This ticket adds a compact status row to ProjectCard showing:
- Loop indicator: "🔄 Loop active" or "⏸ Loop off" based on `autonomousLoop` boolean
- Agent badge: "{agentEmoji} {agentName} — {agentStatus}" (e.g. "🔥 Charizard — working on Chat MVP" or "🔥 Charizard — idle")
- Last sync: "Synced 3 min ago" using `lastSyncAt` timestamp with relative time formatting

## Checklist

- [x] Update `ProjectCard.tsx` — add a status row below the existing repo/sync info
- [x] Show loop status: green dot + "Loop active" when `autonomousLoop === true`, muted "Loop off" otherwise
- [x] Show agent badge: `{agentEmoji} {agentName}` with status text from `agentStatus`. If `agentCurrentFeature` is set, show it
- [x] Show last sync time: relative format ("2 min ago", "1 hour ago") using `lastSyncAt`. Use a small helper function, no external date library
- [x] All styles use design system tokens (CSS variables, Tailwind utilities, no hardcoded colors)

## Files

- `src/app/[locale]/(app)/dashboard/_components/ProjectCard.tsx`
- `src/app/[locale]/(app)/dashboard/_helpers/formatRelativeTime.ts` (new)
