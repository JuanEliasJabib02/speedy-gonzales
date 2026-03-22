# Code View Layout With Chat

**Status:** in-progress
**Priority:** high

## Overview

Restructure the FeatureLayout so the ChatPanel is always visible on the right side.
The toggle switches the LEFT area between Plan mode and Code mode.

## Layout

**Plan mode (default):**
```
[TicketSidebar 280px] | [PlanViewer flex] | [ChatPanel 380px]
```

**Code mode:**
```
[FileTree 280px] | [FileViewer flex] | [ChatPanel 380px]
```

## Requirements

- [ ] ChatPanel is always visible — never hidden by mode toggle
- [ ] Toggle button switches left+center area between Plan and Code
- [ ] Plan mode: TicketSidebar + PlanViewer (current behavior)
- [ ] Code mode: FileTree + FileViewer (replaces TicketSidebar + PlanViewer)
- [ ] ChatPanel stays mounted and preserves state across mode switches
- [ ] ResizeHandle between FileViewer and ChatPanel (same as PlanViewer↔Chat)
- [ ] Remove the back "← Chat" floating button from FileViewer (no longer needed)
- [ ] Toggle button lives in ChatPanel header or top bar (always visible)

## Files to modify

- `src/components/features/FeatureLayout.tsx` — main layout logic
- `src/components/features/CodeView/FileViewer.tsx` — remove floating back button
- `src/components/chat/ChatPanel.tsx` — ensure toggle is accessible from chat header

## Notes

- ChatPanel should NOT unmount on toggle — preserve conversation state
- The resize handle between center and chat should work in both modes
