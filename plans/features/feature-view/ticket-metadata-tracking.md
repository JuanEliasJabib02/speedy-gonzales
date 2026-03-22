# Ticket Metadata Tracking (updatedAt + agentName)

**Status:** todo
**Priority:** high

## What it does

Adds `updatedAt` and `agentName` fields to the tickets table in Convex. This enables:

1. **Sort tickets by last modified** — sidebar always shows most recently touched first
2. **Agent attribution** — track which agent owns/worked on each ticket
3. **Future analytics** — completion rate per agent, velocity dashboards, activity timelines

## Decisions (refined)

- **Sort is always `updatedAt` desc** — no toggle needed. Existing status filters (todo, completed, etc.) stay, but within each filter the order is always last-modified-first.
- **Agent is set on creation** — whoever creates the ticket owns it. The creator is always the agent that will work on it.
- **No manual reassignment from UI** — if a ticket needs to move between agents, it's done by editing the .md file and pushing (rare edge case, not worth UI effort now).
- **Agent name resolved from git email** — the webhook sync maps commit author email → agent name. This is the source of truth.

## Agent email → name map

Stored in Convex (a `settings` or `agents` table, or hardcoded initially):

| Git email | Agent | Emoji |
|-----------|-------|-------|
| `juaneliasjabib02@gmail.com` | Charizard | 🔥 |
| `juan@iot4a.com` | Goku | 💪 |

Future agents get a new row when they're set up.

## Schema changes

Add to `convex/schema/tickets.ts`:
```ts
updatedAt: v.optional(v.number()),    // timestamp (ms) of last status/content change
agentName: v.optional(v.string()),    // "Charizard", "Goku", etc. — resolved from git email
```

Add index for sorting:
```ts
.index("by_epic_updated", ["epicId", "updatedAt"])
```

## Sync logic changes

In the webhook sync (`convex/github.ts` or equivalent):
- On every ticket create/update → set `updatedAt: Date.now()`
- On ticket creation → resolve `agentName` from the git commit author email using the map above
- `agentName` persists — it doesn't change on subsequent updates unless a different agent modifies the file (then it updates to the new agent)

## UI changes

### Ticket sidebar (`TicketSidebar.tsx`)
- Default and only sort: `updatedAt` descending
- Show small "Updated 2h ago" relative time on each ticket card
- Show agent emoji + name badge on each card (e.g. "🔥 Charizard")

### Future (not this ticket)
- Dashboard analytics: tickets completed per agent per week
- Activity timeline: who did what and when

## Checklist

- [ ] Add `updatedAt` and `agentName` to tickets schema
- [ ] Add `by_epic_updated` index
- [ ] Update webhook sync to set `updatedAt` on every upsert
- [ ] Map git commit email → agent name in sync logic
- [ ] Update ticket sidebar query to sort by `updatedAt` desc
- [ ] Show "updated X ago" on ticket cards
- [ ] Show agent emoji + name on ticket cards

## Files

- `convex/schema/tickets.ts` — schema changes
- `convex/github.ts` (or sync handler) — set updatedAt + resolve agentName
- `src/components/features/TicketSidebar.tsx` — sort + display
- `src/components/features/TicketCard.tsx` — metadata badges
