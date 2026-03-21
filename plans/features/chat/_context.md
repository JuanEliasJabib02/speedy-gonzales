# OpenClaw Chat

**Status:** todo
**Priority:** medium

## Overview

The right panel in the Feature View. A chat where you talk to your OpenClaw agent about the current feature. The agent can read plans, create tickets, modify plans, and push changes — all from the conversation.

This is NOT a generic AI chat. The backend is OpenClaw — your agent with full context, memory, and execution access. It doesn't generate text — it executes.

**Speedy Gonzales replaces Slack as your agent interface.**

## Chat scope

- One chat per feature (epic)
- The agent knows which feature you're in and all its tickets
- History is persistent — you can come back later and continue

## Depends on

- Feature 6 (Feature View) — chat lives in the right panel
- Feature 4 (GitHub Sync) — context data comes from synced plans
