# Add Auth + Ownership Check to syncProject

**Status:** review
**Priority:** critical
**Agent:** Perro salchicha 🌭

## What it does

The `syncProject` action currently allows any authenticated user to trigger a sync for any project. Adds auth and ownership verification.

## Checklist

- [x] Add `requireAuth` call to `syncProject` action
- [x] Fetch the project and verify `project.userId === userId`
- [x] Throw `ConvexError` with code `FORBIDDEN` if the user doesn't own the project
- [x] Ensure internal sync calls (`syncRepoInternal`) remain unaffected — they bypass auth by design

## Files

- `convex/githubSync.ts`
