# Feature View

**Status:** in-progress
**Priority:** high

## Overview

The core screen of the app. A three-panel layout where you:
- Browse tickets in a sidebar (like a wiki)
- Read the selected plan rendered as HTML
- Chat with your OpenClaw agent about the feature

You enter here by clicking a feature card from the kanban.

## Layout

- Left: Ticket sidebar (280px) — list of tickets with status dots
- Center: Plan viewer (flex-1) — rendered markdown content
- Right: Chat panel (resizable 320-700px) — conversation with agent

## Depends on

- Feature 4 (GitHub Sync) — needs tickets in DB
- Feature 5 (Kanban) — navigation from kanban card

## Blocks

- Feature 8 (Chat) — chat panel is wired here
