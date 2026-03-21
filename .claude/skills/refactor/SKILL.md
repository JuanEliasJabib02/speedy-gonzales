---
name: refactor
description: Use when the user wants to refactor a component or module. Splits code into atomic pieces following the project's folder convention with separated UI, hooks, and helpers.
---

# Refactor

When this skill is triggered, refactor the target component or module following the project's atomic structure.

## Folder convention

```
feature/
  _components/   # Small, focused UI-only components
  _hooks/        # Custom hooks — all logic lives here
    useFeature.ts       # Thin composer — wires sub-hooks, returns flat API
    useConcernA.ts      # One hook per concern (~60 line limit, then extract)
  _helpers/      # Pure functions (no state, no hooks) — one function per file
  _constants/    # Static data, mock data, enums
```

## Rules

- Components must be **UI-only** — no business logic, no data fetching
- All logic must live in **custom hooks**
- Logic that doesn't depend on React state must be extracted into **helpers** (pure functions called from hooks)
- Split hooks when they exceed ~60 lines — one concern per file
- Big components must be split into smaller atomic components inside `_components/`
- Types go in the same file where they're used — only create `_types/` if shared across multiple files in the feature
- Prefer `type` over `interface`
- Keep imports clean — no circular dependencies
- All data access goes through Convex — frontend only uses `useQuery` / `useMutation` / `useAction`
- If a refactored helper is used by 2+ routes, move it to `src/lib/helpers/`
