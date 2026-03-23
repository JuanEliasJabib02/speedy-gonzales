# Delete Dead authHelper.ts

**Status:** review
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

Removes `src/lib/helpers/authHelper.ts` which is never imported anywhere. It checks `cookies.get("access_token")` — a cookie that doesn't exist in the Convex Auth flow. The real auth is handled by `convexAuth.isAuthenticated()` in middleware. Keeping this file risks someone using it by mistake.

## Checklist

- [x] Delete `src/lib/helpers/authHelper.ts`
- [x] Search for any references to `authHelper`, `getAuthRedirect`, or `isAuthenticated` from this file — should find none
- [x] Confirm middleware still uses `convexAuth.isAuthenticated()` correctly

## Files

- `src/lib/helpers/authHelper.ts` (DELETE)
