# TypeScript: Strict Types

**Status:** todo
**Priority:** medium

## Overview

Status and priority fields are typed as `v.string()` throughout the Convex schema, allowing arbitrary values. Status type unions are incomplete in frontend code. The `LOCALES` array doesn't include "pt" but middleware protects Portuguese routes. Several unsafe casts exist.

Addresses audit findings #16, #17, #18, #19, #26.

## Still needs

- [ ] Use `v.union(v.literal(...))` for status/priority fields in schema
- [ ] Fix missing "blocked" in `useLivePlan` status union
- [ ] Align LOCALES array with middleware route matchers
- [ ] Replace unsafe `as unknown as MutationCtx` cast in auth.ts
