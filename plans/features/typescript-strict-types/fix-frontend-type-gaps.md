# Fix Frontend Type Gaps

**Status:** review
**Priority:** medium
**Agent:** Perro salchicha 🌭

## What it does

Several frontend type issues: `useLivePlan` status union is missing "blocked", `Feature` type in kanban uses `id: string` instead of `Id<"epics">`, and `Record<string, unknown>` is used for DB patches losing type safety.

## Checklist

- [x] In `useLivePlan.ts`: add "blocked" to the status type union cast
- [x] In `kanban-config.ts`: change `Feature.id` from `string` to `Id<"epics">` — remove unsafe casts in `FeatureCard`
- [x] Replace `Record<string, unknown>` patch objects with `Partial<Doc<"tickets">>` or `Partial<Doc<"epics">>` in mutations
- [x] Fix `LOCALES` array in `src/i18n/locales.ts` — either add "pt" or remove "pt" from middleware matchers in `src/middleware.ts`

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_hooks/useLivePlan.ts`
- `src/app/[locale]/(app)/projects/[projectId]/_constants/kanban-config.ts`
- `convex/projects.ts`
- `convex/tickets.ts`
- `src/i18n/locales.ts`
- `src/middleware.ts`

## Commits
- `8de6a50730d444a95109351e00535bc922e5321c`
