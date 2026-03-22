# Ticket Metadata Tracking (updatedAt + agentName)

**Status:** todo
**Priority:** high

## What it does

Adds `updatedAt` and `agentName` fields to the tickets table in Convex. This enables:

1. **Sort tickets by last modified** — most recently touched tickets appear first in the sidebar
2. **Agent attribution** — track which agent (Charizard, Goku, etc.) last worked on a ticket
3. **Future analytics** — completion rate per agent, velocity dashboards, activity timelines

## Schema changes

Add to `convex/schema/tickets.ts`:
```ts
updatedAt: v.optional(v.number()),    // timestamp (ms) of last status/content change
agentName: v.optional(v.string()),    // "Charizard", "Goku", etc. — who last modified it
```

Add index for sorting:
```ts
.index("by_epic_updated", ["epicId", "updatedAt"])
```

## Sync logic changes

In the webhook sync (`convex/github.ts` or equivalent):
- When a ticket is created or updated, set `updatedAt: Date.now()`
- Parse `agentName` from the git commit author or from a metadata comment in the .md file (TBD)

## Agent name injection

Two options (decide during implementation):
- **Option A:** Parse from git commit — `git log -1 --format='%an' -- <file>` → map author to agent name
- **Option B:** Add an optional YAML frontmatter field `agent: Charizard` to .md files (simpler but manual)

Recommend **Option A** — git is already the source of truth, and each agent commits with a known email.

## UI changes

### Ticket sidebar (`TicketSidebar.tsx`)
- Default sort: `updatedAt` descending (most recently modified first)
- Show small "Updated 2h ago" or date badge on each ticket card
- Optional: show agent avatar/emoji next to the badge

### Future (not this ticket)
- Dashboard analytics: tickets completed per agent per week
- Activity timeline: who did what and when

## Checklist

- [ ] Add `updatedAt` and `agentName` to tickets schema
- [ ] Add `by_epic_updated` index
- [ ] Update webhook sync to set `updatedAt` on every upsert
- [ ] Map git commit email → agent name in sync logic
- [ ] Update ticket sidebar to sort by `updatedAt` desc
- [ ] Show "updated X ago" on ticket cards
- [ ] Show agent name/emoji on ticket cards

## Files

- `convex/schema/tickets.ts` — schema changes
- `convex/github.ts` (or sync handler) — set updatedAt + resolve agentName
- `src/components/features/TicketSidebar.tsx` — sort + display
- `src/components/features/TicketCard.tsx` — metadata badges
