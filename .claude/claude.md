## General
- Always use English for comments, code identifiers, and simple docs.
- Use functional programming patterns with React 19 and TypeScript.
- Prefer `type` over `interface`.

## Components — pure UI only
- Components are pure UI only — no logic, no API calls, no state management.
- All logic stays in custom hooks.
- Extract sub-components when a block exceeds ~100 lines OR has a clear semantic identity (header, card, row, section) — naming is the stronger signal.
## Styling — always use design system tokens
- Use always the design system inside _design-system.md
- Colors: use CSS variables defined in the theme (`--primary`, `--muted`, etc.) — never hardcode hex values.
- Font: Poppins (configured globally) — never set font-family inline.
- Spacing / padding / margin / gap: use Tailwind utility classes (`p-4`, `gap-6`, etc.).
- Use shadcn/ui components before creating custom ones.

## Architecture — Next.js App Router by page scope

Each route owns its logic:

```
src/app/[locale]/(app)/feature/
├── _components/      # Pure UI only
├── _hooks/           # All state and derived values
│   ├── useFeature.ts         # Thin composer — wires sub-hooks, returns flat API
│   ├── useConcernA.ts        # One hook per concern
│   └── useConcernB.ts        # Split when a hook exceeds ~60 lines
├── _helpers/         # Pure functions (no state, no hooks) — one function per file
├── _constants/       # Static data, mock data, enums
└── page.tsx          # Composes hooks + components only
```

- All data access goes through Convex backend — frontend only uses `useQuery` / `useMutation` / `useAction`.
- Shared components across pages live in `src/app/[locale]/(app)/_components/`.
- Types go in the same file where they're used. Only create `_types/` if a type is shared across multiple files in the same feature.

## Shared layer — `src/lib/`

Global utilities that cross route boundaries:

```
src/lib/
├── components/ui/    # shadcn/ui components
├── hooks/            # Global hooks (useCurrentUser, etc.)
├── helpers/          # Pure functions (cn, date formatting, authHelper, createMetadata)
└── constants/        # App-wide constants (routes, errors, icon-sizes)
```

**Rule**: if it's used by 2+ routes → `src/lib/`. If it's used by one route → `feature/_hooks/` or `feature/_helpers/`.

## Convex backend conventions
- Queries, mutations, and actions go in `convex/` at the top level.
- Schema lives in `convex/schema/` — one file per table.
- **Thin wrappers**: query/mutation functions should be minimal wrappers. Extract business logic into plain TypeScript helpers in `convex/model/`.
- **Validators**: use argument validators (`v.string()`, `v.id()`, etc.) on every public function.
- **Auth**: always verify identity with `ctx.auth.getUserIdentity()` in protected functions. Never use spoofable args (email) for access control.
- **Indexes over filters**: use `.withIndex()` instead of `.filter()` — filter scans the full table.
- **Limit `.collect()`**: only use on small result sets (<1000 docs). Prefer `.take(n)`, pagination, or index filtering.
- **No `Date.now()` in queries**: breaks Convex caching. Pass time as a client argument or use a boolean field updated by a scheduled function.
- **Schedule only `internal.*`**: never schedule `api.*` functions — prevents attackers from triggering public endpoints.

## Translations — next-intl
- Use `useTranslations()` hook — never hardcode user-facing strings.
- When a feature is wired to the backend, translate its strings in `messages/` (en, es).
- Mock/maqueta phases can use hardcoded text — translate when the feature is real.

## State scope — where does it live?

- 1–2 components in the same tree → props from parent
- If a component only forwards a prop, move the hook call into the child directly.
- Many components in the same screen → custom hook composer
- Server/API data → Convex `useQuery` / `useMutation` — already reactive and globally accessible
- Transient UI state (modals, filters, sidebar) → local hooks or URL searchParams
