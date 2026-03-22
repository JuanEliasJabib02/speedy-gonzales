# Agent Indicator in Project Header

**Status:** in-progress
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Show which agent is assigned to a project and what it's currently working on, displayed in the project header next to the project name.

Format: **Project Name** · 🔥 Charizard · `working on feature-view`

When idle: **Project Name** · 🔥 Charizard · `idle`

## Data model

Add to `projects` schema:
- `agentName: v.optional(v.string())` — e.g. "Charizard"
- `agentEmoji: v.optional(v.string())` — e.g. "🔥"
- `agentStatus: v.optional(v.string())` — e.g. "idle" | "working"
- `agentCurrentFeature: v.optional(v.string())` — e.g. "feature-view"

These fields are updated by the autonomous loop when it picks up or finishes work.

## Checklist

- [ ] Add agent fields to `convex/schema/projects.ts`
- [ ] Create migration or default values for existing projects
- [ ] Update `ProjectHeader.tsx` to display agent name + emoji + status
- [ ] Show current feature name when status is "working"
- [ ] Show "idle" with muted styling when no work is happening
- [ ] Add a subtle pulse animation when the agent is actively working

## Files

- `convex/schema/projects.ts`
- `src/app/[locale]/(app)/projects/[projectId]/_components/ProjectHeader.tsx`
