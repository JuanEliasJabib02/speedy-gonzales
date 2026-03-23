# Require LOOP_API_KEY on Autonomous Loop Endpoints

**Status:** review
**Priority:** high
**Agent:** Perro salchicha 🌭

## What it does

`/autonomous-loop/status` and `/update-ticket-status` skip auth when `LOOP_API_KEY` env var is not set. Fix: always require the key — return 401 if the env var is missing.

## Checklist

- [x] In both endpoint handlers: if `LOOP_API_KEY` is not set in env, return 500 with "LOOP_API_KEY not configured"
- [x] If set but request doesn't match: return 401 "Unauthorized"
- [x] Add a clear error message so devs know they need to set the env var
- [x] Verify the autonomous-loop skill sends the Bearer token in requests

## Files

- `convex/http.ts`
