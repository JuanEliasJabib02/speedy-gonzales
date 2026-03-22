# Command Palette — File Search (Cmd+P)

**Status:** review
**Priority:** high

## Overview

When the user is in Code View, pressing Cmd+P (or Ctrl+P) opens a Command Palette modal for fast file navigation — like VS Code's quick open.

## Behavior

- **Trigger:** Cmd+P / Ctrl+P when in Code View
- **Opens:** Modal overlay with a fuzzy search input
- **Data source:** File tree already loaded via `onFilesLoaded` callback (no extra fetch)
- **Search:** `string.includes` fuzzy match on file path/name, highlights the match with yellow
- **Select:** Enter or click → opens file in FileViewer
- **Dismiss:** Esc or click outside

## Implementation

### Components
- `CommandPalette.tsx` ✅ — modal with input + filtered file list, keyboard nav (↑↓ Enter Esc)
- `CodeView.tsx` ✅ — captures Cmd+P / Ctrl+P, prevents browser print dialog, manages `isPaletteOpen` state
- `FileTree.tsx` ✅ — fires `onFilesLoaded(blobs)` when tree is fetched (used to populate palette)

### Integration
- Mounted directly in `CodeView` — always available in code view
- File list sourced from `FileTree.onFilesLoaded` callback → stored in `files` state in CodeView
- On file select → calls same `handleFileSelect` as FileTree click → opens in FileViewer

## Acceptance Criteria

- [x] Cmd+P opens palette in Code View
- [x] Ctrl+P works as well (Windows/Linux users)
- [x] Input auto-focused when palette opens
- [x] Search filters files in real-time (string.includes, case-insensitive)
- [x] File path shown with match highlighted (yellow bg)
- [x] Enter selects active result and opens file
- [x] ↑↓ navigate results
- [x] Esc closes palette
- [x] Click outside closes palette
- [x] Does not trigger browser print dialog
- [x] Max 8 results shown at once
- [x] Footer hint shows keyboard shortcuts
