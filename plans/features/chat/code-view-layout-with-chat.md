# Code View Layout With Chat

**Status:** todo
**Priority:** high

## Overview

Redesign the Chat/Code toggle so the ChatPanel is always visible. The toggle swaps the LEFT panel only.

## Layout

### Chat mode (current left panel)
```
[TicketSidebar + PlanViewer  |  ChatPanel]
```

### Code mode (new)
```
[FileTree + FileViewer       |  ChatPanel]
```

The ChatPanel never unmounts — it stays on the right at all times.

## Implementation

- [ ] Remove the logic that hides ChatPanel in Code mode
- [ ] Keep `FeatureLayout.tsx` toggle but only swap the left panel content
- [ ] In Code mode: render `<CodeView>` (FileTree + FileViewer) in the left region
- [ ] In Chat mode: render `<TicketSidebar>` + `<PlanViewer>` in the left region
- [ ] Remove the floating "← Chat" button from FileViewer (no longer needed)
- [ ] Ensure resize handles work in both modes
- [ ] ChatPanel width stays consistent between mode switches (no layout jump)
