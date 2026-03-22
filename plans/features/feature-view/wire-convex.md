# Wire Feature View to Convex

**Status:** todo
**Priority:** medium

## What it does

Replace mock data with real Convex queries. Tickets come from DB, plan content comes from DB (synced from GitHub).

## Checklist

- [ ] Create `useFeatureView` composer hook
- [ ] Use `useQuery(api.tickets.getByEpic, { epicId })` for ticket list
- [ ] Use `useQuery(api.epics.getEpic, { epicId })` for epic data
- [ ] Load plan content per ticket when selected
- [ ] Handle loading states for each panel
- [ ] Remove mock data and filesystem API fallback
