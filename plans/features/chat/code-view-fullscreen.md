# Code View Fullscreen Layout

**Status:** completed
**Priority:** high

## Overview

When switching to Code mode, the CodeView should expand to fill the full width of the feature layout (replacing PlanViewer + ChatPanel space). Chat mode restores the original 3-panel layout.

## What to build

- [x] In `FeatureLayout.tsx`: when `mode === "code"`, hide `PlanViewer` and `ChatPanel` (and resize handles), let `CodeView` take full width
- [x] Add a floating "Back to Chat" button (MessageSquare icon, top-right of `FileViewer`) so the user can switch back without needing the ChatPanel header toggle
- [x] Code mode layout: `[FileTree 280px] | [FileViewer — full remaining width]`
- [x] Chat mode layout: unchanged — `[TicketSidebar] | [PlanViewer] | [ChatPanel]`
- [x] Transition should be smooth (no layout jump)

## Files likely involved

- `components/features/FeatureLayout.tsx`
- `components/features/CodeView.tsx`
- `components/features/FileViewer.tsx`
- `components/chat/ChatPanel.tsx`

## Acceptance criteria

- Switching to Code mode hides PlanViewer and ChatPanel completely
- FileTree + FileViewer fill all available horizontal space
- A button in FileViewer header (or top-right corner) lets the user return to Chat mode
- Switching back to Chat restores the normal 3-panel layout
