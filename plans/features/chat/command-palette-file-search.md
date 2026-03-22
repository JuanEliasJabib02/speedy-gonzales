# Command Palette — File Search (Cmd+P)

**Status:** todo
**Priority:** high

## Overview

When the user is in Code View, pressing Cmd+P (or Ctrl+P) opens a Command Palette modal for fast file navigation — like VS Code's quick open.

## Behavior

- **Trigger:** Cmd+P / Ctrl+P when in Code View
- **Opens:** Modal overlay with a fuzzy search input
- **Data source:** File tree already loaded (no extra fetch needed)
- **Search:** Fuzzy match on file path/name, highlights the match
- **Select:** Enter or click → opens file in FileViewer
- **Dismiss:** Esc or click outside

## Implementation

### Components
- `CommandPalette.tsx` — modal with input + filtered file list
- Fuzzy search: use `fuse.js` (already a common dep) or simple `string.includes` if no extra dep desired
- Keyboard listener: capture Cmd+P / Ctrl+P, prevent browser default (print dialog)

### Integration
- Mount in `CodeView` or `FeatureView` when `viewMode === "code"`
- Pass file list from existing FileTree data
- On file select → call same handler as FileTree click

## Acceptance Criteria

- [ ] Cmd+P opens palette in Code View
- [ ] Ctrl+P works as well (Windows/Linux users)
- [ ] Input auto-focused when palette opens
- [ ] Fuzzy search filters files in real-time
- [ ] File path shown with match highlighted
- [ ] Enter selects top result and opens file
- [ ] Esc closes palette
- [ ] Click outside closes palette
- [ ] Does not trigger browser print dialog
- [ ] Works on both Mac and Windows keyboards
