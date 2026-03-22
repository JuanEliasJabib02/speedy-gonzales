# Code View Layout With Chat

**Status:** todo
**Priority:** high

## Overview

The chat panel is always visible on the right side. The toggle Plan ↔ Code moves to the top of the TicketSidebar (near the epic title), and controls only the left+center area. The right panel always shows the chat.

## Layout

**Plan mode (default):**
```
[TicketSidebar 260px] | [PlanViewer flex-1] | [ResizeHandle] | [ChatPanel fixed-width]
```

**Code mode:**
```
[FileTree 280px] | [FileViewer flex-1] | [ResizeHandle] | [ChatPanel fixed-width]
```

The ChatPanel is ALWAYS rendered and ALWAYS shows the chat messages — never CodeView.

## Acceptance Criteria

- [ ] ChatPanel is always rendered (no conditional unmount on mode toggle)
- [ ] ChatPanel never renders CodeView — it only shows the chat messages
- [ ] Toggle Plan ↔ Code lives in the TicketSidebar header, near the epic title
- [ ] In Code mode: left=FileTree, center=FileViewer
- [ ] In Plan mode: left=TicketSidebar, center=PlanViewer
- [ ] ResizeHandle and ChatPanel are always present
- [ ] No floating "Switch to Chat" button anywhere
- [ ] Scroll to bottom button works correctly (it's already implemented in ChatPanel — just verify it's not broken)

## Implementation Notes

### FeatureLayout.tsx changes
- Remove `{viewMode === "chat" && <ResizeHandle />}` — always render it
- Remove `{viewMode === "chat" && <ChatPanel />}` — always render ChatPanel
- Remove `viewMode` and `onViewModeChange` props from ChatPanel (or keep them but don't use for CodeView)
- Left panel: conditional on viewMode (TicketSidebar vs FileTree)
- Center panel: conditional on viewMode (PlanViewer vs FileViewer)
- Remove the floating "Switch to Chat" button from FileViewer area
- Pass `viewMode` and `onViewModeChange` to `TicketSidebar` instead

### ChatPanel.tsx changes
- Remove the Plan/Code toggle from the ChatPanel header entirely
- Remove the `viewMode === "code"` branch that renders `<CodeView />`
- Keep only the chat view (messages, scroll, input)
- Keep `showScrollButton` + scroll-to-bottom button (already exists — don't break it)
- Remove `viewMode` and `onViewModeChange` props (no longer needed)

### TicketSidebar.tsx changes
- Add `viewMode: ViewMode` and `onViewModeChange: (mode: ViewMode) => void` props
- Add a small Plan/Code toggle near the epic title in the header (top of sidebar)
- Import `ViewMode` type from FeatureLayout
