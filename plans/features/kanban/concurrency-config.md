# Concurrency Configuration

**Status:** review
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

- [x] Add concurrency fields to `convex/schema/projects.ts`
- [x] Add a "Settings" section in the project page (gear icon in ProjectHeader)
- [x] Simple form to edit maxConcurrentPerFeature and maxConcurrentGlobal
- [x] Mutation to update project concurrency settings
- [x] Display current limits somewhere visible (settings popover in header)

## Files

- `convex/schema/projects.ts`
- `convex/projects.ts` — add `updateSettings` mutation
- `src/app/[locale]/(app)/projects/[projectId]/_components/ConcurrencySettings.tsx`
