# Add Auth + Ownership Check to syncProject

**Status:** in-progress
**Priority:** critical
**Agent:** Perro salchicha 🌭

## What it does

The `syncProject` action currently allows any authenticated user to trigger a sync for any project. Adds auth and ownership verification.

## Checklist

- [ ] Add `requireAuth` call to `syncProject` action
- [ ] Fetch the project and verify `project.userId === userId`
- [ ] Throw `ConvexError` with code `FORBIDDEN` if the user doesn't own the project
- [ ] Ensure internal sync calls (`syncRepoInternal`) remain unaffected — they bypass auth by design

## Files

- `convex/githubSync.ts`
