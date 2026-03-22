# Users Table & getCurrentUser

**Status:** todo
**Priority:** medium

## What it does

Convex schema for the users table and a query to get the current authenticated user's data.

## Checklist

- [x] Define users table schema (email, name, authProvider, timestamps)
- [x] Create `by_email` index
- [x] Implement `getCurrentUser` query with auth verification
- [x] Create `requireAuth` helper for protected mutations
- [x] Create `useCurrentUser` React hook (wraps useQuery)

## Files

- `convex/schema/users.ts` — Users table schema
- `convex/users.ts` — getCurrentUser query
- `convex/helpers.ts` — requireAuth helper
- `src/lib/hooks/useCurrentUser.ts` — React hook
