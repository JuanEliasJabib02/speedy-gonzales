# Start/Stop Feature Buttons

**Status:** in-progress
**Priority:** high
**Agent:** Charizard 🔥

## What it does

Add "Start" and "Stop" buttons to feature cards in the kanban, replacing drag-and-drop for status transitions.

- **Start button** — visible on `todo` and `blocked` features. Clicking it moves the feature to `in-progress`, which signals the agent to begin picking up tickets.
- **Stop button** — visible on `in-progress` features. Clicking it moves the feature back to `todo`, signaling the agent to finish the current ticket (or revert) and stop.

The user should NOT be able to move features to `review` or `completed` manually — those transitions happen automatically (agent → review, Juan → completed).

## User flow

1. Juan sees a feature in Todo → clicks "Start" → feature moves to In Progress
2. The agent (Charizard) picks it up on the next loop cycle
3. If Juan wants to stop → clicks "Stop" → feature moves back to Todo
4. Agent finishes current ticket, then stops working on the feature

## Checklist

- [ ] Add "Start" button to FeatureCard when status is `todo` or `blocked`
- [ ] Add "Stop" button to FeatureCard when status is `in-progress`
- [ ] Wire buttons to Convex mutation to update epic status
- [ ] Prevent click-through to feature view when clicking Start/Stop (stopPropagation)
- [ ] Add loading state while mutation runs
- [ ] Hide both buttons for `review` and `completed` features

## Files

- `src/app/[locale]/(app)/projects/[projectId]/_components/FeatureCard.tsx`
- `convex/epics.ts` — add `updateStatus` mutation if not exists
