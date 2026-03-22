# Progressive Markdown Rendering

**Status:** todo
**Priority:** medium

## What it does

Render markdown formatting (bold, headers, lists, code blocks) progressively as tokens stream in, not only after the full response is complete. Makes the streaming feel polished and readable.

## Checklist

- [ ] Ensure react-markdown (or whichever renderer) re-renders on each chunk update
- [ ] Handle incomplete markdown gracefully (e.g. `**bold` without closing `**`)
- [ ] Code blocks should show syntax highlighting as they stream
- [ ] Lists should format correctly even mid-stream
- [ ] Test with long responses that include mixed markdown elements
