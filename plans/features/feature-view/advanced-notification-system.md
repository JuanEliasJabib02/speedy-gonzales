# Advanced Notification System (Webchat)

**Status:** completed
**Priority:** low

## Goal

When a sub-agent (Perro salchicha) finishes work, the notification should arrive in the webchat chat panel — not just Slack. Full cross-channel notification routing.

## What's missing

- Sub-agent completion events only route to Slack (OpenClaw default delivery)
- Webchat doesn't receive push events when Charizard isn't actively in a turn
- No in-app notification UI (toast, badge, sidebar alert)

## Ideas

- [ ] OpenClaw delivery config: add webchat as a delivery target for sub-agent completions
- [ ] Convex-side notification table: Charizard writes a notification → frontend polls/subscribes
- [ ] Toast component in the UI for agent events (ticket done, push detected, etc.)
- [ ] Notification badge on chat panel when there's a new agent event
- [ ] Possibly a dedicated "Agent Activity" feed in the sidebar

## Notes

- Low priority for now — Slack covers it
- When we build this, tie it to the structured actions system (already in place)
