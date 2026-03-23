# Delete Legacy plans/[epicId] API Route

**Status:** in-progress
**Priority:** critical
**Agent:** Perro salchicha 🌭

## What it does

Removes the `src/app/api/plans/[epicId]/route.ts` file entirely. This is pre-Convex legacy code that reads the local filesystem with no auth check and has a path traversal vulnerability via the `epicId` parameter. All plan data is now served from Convex.

## Checklist

- [ ] Delete `src/app/api/plans/[epicId]/route.ts`
- [ ] Search entire codebase for any imports or fetch calls to `/api/plans/` — remove or update them
- [ ] Verify no component depends on this endpoint (it should be fully replaced by Convex queries)

## Files

- `src/app/api/plans/[epicId]/route.ts` (DELETE)
