# Hide Chat Panel

**Status:** completed
**Priority:** high

## What it does

Hide the chat panel from the feature-view layout. Don't delete the code — just remove it from the UI so it can be re-enabled later. The right panel becomes the commit timeline instead.

## Checklist

- [x] Remove ChatPanel from FeatureLayout (comment out, don't delete)
- [x] Remove the Plan/Code toggle in the header (no longer needed)
- [x] Keep all chat components, hooks, API routes, and Convex schema intact — just unused
- [x] Update the three-panel layout to two panels: ticket sidebar (left) + plan viewer (center/right)
- [x] Keep ResizeHandle if the commit timeline replaces the right panel
