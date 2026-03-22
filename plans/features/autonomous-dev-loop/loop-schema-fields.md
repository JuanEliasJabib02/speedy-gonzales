# Loop Schema Fields

**Status:** review
**Priority:** critical
**Agent:** Charizard 🔥

## What it does

Add the autonomous loop configuration fields to the projects schema in Convex so each project can opt into autonomous development.

## Checklist

- [x] Add `autonomousLoop: v.optional(v.boolean())` to `convex/schema/projects.ts`
- [x] Add `localPath: v.optional(v.string())` to `convex/schema/projects.ts`
- [x] Add `notificationEnabled: v.optional(v.string())` to `convex/schema/projects.ts`
- [x] Add `loopStatus: v.optional(v.string())` to `convex/schema/projects.ts` — values: "idle" | "running" | "error"
- [x] Add `lastLoopAt: v.optional(v.number())` to `convex/schema/projects.ts`
- [x] Update `createProject` mutation defaults: `autonomousLoop: false`, `loopStatus: "idle"`

## Files

- `convex/schema/projects.ts`
- `convex/projects.ts` — update `createProject` mutation
