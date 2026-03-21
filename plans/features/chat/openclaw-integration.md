# OpenClaw API Integration

**Status:** todo

## What it does

Connect the chat to the OpenClaw agent API. Research and implement the communication protocol.

## Checklist

- [ ] Research OpenClaw API protocol (HTTP REST? WebSocket? gRPC?)
- [ ] Implement API client in Convex action
- [ ] Handle authentication with OpenClaw
- [ ] Handle streaming responses (if supported)
- [ ] Handle agent actions (created ticket, pushed code, modified plan)
- [ ] Parse commit data from agent responses

## Open questions

- Where does OpenClaw run? VPS? Cloud? Local with tunnel?
- How does the agent authenticate?
- Does the response stream token-by-token or arrive all at once?
