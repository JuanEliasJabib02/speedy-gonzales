# Fix Unsafe Cast in auth.ts

**Status:** review
**Priority:** low
**Agent:** Perro salchicha 🌭

## What it does

`convex/auth.ts` uses `as unknown as MutationCtx` double-cast in the `createOrUpdateUser` callback. This is a type workaround for convex-dev/auth's restrictive ctx type. Find a proper solution or document the limitation.

## Checklist

- [x] Check if newer @convex-dev/auth version exposes a proper mutation context type
- [ ] If yes, upgrade and remove the cast
- [x] If no, add a `// @ts-expect-error` or `// eslint-disable` with a comment explaining why, linking to the upstream issue
- [x] Either way, remove the `as unknown as MutationCtx` chain — it hides real type errors

## Files

- `convex/auth.ts`

## Commits
- `a04e5c7387fce90706fd0810fdbbe229b523ee22`
