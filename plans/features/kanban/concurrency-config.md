# Concurrency Configuration

**Status:** in-progress
**Priority:** medium
**Agent:** Charizard 🔥

## What it does

Add concurrency limits to project settings so the agent knows how many tickets to run in parallel.

- **Per feature:** max concurrent tickets within a single feature (default: 3)
- **Global:** max total concurrent tickets across ALL features in the project (default: 5)

The orchestrator (Charizard) reads these values before dispatching work. If 2 features are in-progress, it distributes the global budget by priority.

## Data model

Add to `projects` schema:
- `maxConcurrentPerFeature: v.optional(v.number())` — default 3
- `maxConcurrentGlobal: v.optional(v.number())` — default 5

## Checklist

- [ ] Add concurrency fields to `convex/schema/projects.ts`
- [ ] Add a "Settings" section in the project page (or a gear icon in ProjectHeader)
- [ ] Simple form to edit maxConcurrentPerFeature and maxConcurrentGlobal
- [ ] Mutation to update project concurrency settings
- [ ] Display current limits somewhere visible (tooltip on agent indicator, or settings panel)

## Files

- `convex/schema/projects.ts`
- `convex/projects.ts` — add `updateSettings` mutation
- New: project settings UI component (location TBD)
