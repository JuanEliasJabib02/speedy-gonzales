# Add Automated Tests for Critical Paths

**Status:** backlog
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

Add tests for the most critical flows: auth, ticket status transitions, webhook sync, analytics queries. These are the paths that break most often and need regression protection.

## Checklist

- [ ] Set up Vitest (or existing test framework) if not already configured
- [ ] Test: ticket status transitions (todo → in-progress → review → completed)
- [ ] Test: webhook sync — push event → Convex ticket created/updated
- [ ] Test: analytics queries — correct aggregation with sample data
- [ ] Test: updateStatus API endpoint — auth, validation, happy path
- [ ] Test: loop cycle logging endpoint — auth, payload validation
- [ ] Ensure `pnpm test` runs in CI (if CI exists)

## Files

- `convex/` (Convex function tests)
- `__tests__/` or `tests/` (test directory)
- `vitest.config.ts` or `jest.config.ts`
