# Loop Schema Fields

**Status:** in-progress
**Priority:** critical
**Agent:** Charizard 🔥

## What it does

Add the autonomous loop configuration fields to the projects schema in Convex so each project can opt into autonomous development.

## Checklist

- [ ] Add `autonomousLoop: v.optional(v.boolean())` to `convex/schema/projects.ts`
- [ ] Add `localPath: v.optional(v.string())` to `convex/schema/projects.ts`
- [ ] Add `slackChannel: v.optional(v.string())` to `convex/schema/projects.ts`
- [ ] Add `loopStatus: v.optional(v.string())` to `convex/schema/projects.ts` — values: "idle" | "running" | "error"
- [ ] Add `lastLoopAt: v.optional(v.number())` to `convex/schema/projects.ts`
- [ ] Update `createProject` mutation defaults: `autonomousLoop: false`, `loopStatus: "idle"`

## Files

- `convex/schema/projects.ts`
- `convex/projects.ts` — update `createProject` mutation
