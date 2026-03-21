# Code Viewer

**Status:** todo
**Priority:** medium

## Overview

A GitHub codebase browser embedded in the Feature View. Switch between "Chat" and "Code" in the right panel to explore the project's repository directly inside Speedy Gonzales — without leaving the app.

The viewer uses the same GitHub PAT already configured for auto-sync. No extra credentials needed.

## Architecture

- Switch toggle in the ChatPanel header: **Chat** | **Code**
- File tree fetched via GitHub Trees API (same as `syncRepoInternal`)
- File content fetched via GitHub Blob API on demand
- Syntax highlighting via `react-syntax-highlighter` (already installed)
- Context bridge: when viewing a file, the filename is included in the chat system message — so the agent knows what you're looking at

## Tickets

- `file-tree.md` — collapsible file tree from GitHub API
- `file-viewer.md` — file content with syntax highlighting
- `chat-code-switch.md` — toggle between Chat and Code view
- `context-bridge.md` — inject viewed file into chat context
