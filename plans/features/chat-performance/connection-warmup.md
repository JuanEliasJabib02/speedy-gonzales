# Connection Warmup / Keep-Alive

**Status:** todo
**Priority:** low

## What it does

Pre-warm the TLS connection to the OpenClaw endpoint so the first chat message doesn't pay the TLS handshake cost (~200-500ms). Keep the connection alive between messages.

## Checklist

- [ ] Send a lightweight preflight request (HEAD or OPTIONS) to OpenClaw on page load
- [ ] Use HTTP keep-alive headers so subsequent requests reuse the connection
- [ ] Consider a periodic ping (every 30s) to keep the connection warm if the user is on the chat page
- [ ] Measure before/after to confirm the improvement
