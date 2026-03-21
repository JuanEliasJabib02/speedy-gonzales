# Streaming UX — ChatGPT-style Incremental Rendering

**Status:** todo
**Priority:** high

## What it does

Currently chat messages render as plain text during streaming, with potential markdown glitches as partial content arrives. Upgrade to ChatGPT-style streaming: tokens appear progressively AND markdown renders correctly in real time.

## Approach: Option B — Streaming markdown incremental

Use `react-markdown` with `remarkGfm` to parse and render markdown incrementally as tokens stream in. This handles partial markdown gracefully (e.g. unclosed code fences, partial bold) and gives the fluid "typing" feeling of ChatGPT.

## Checklist

- [ ] Install `react-markdown` and `remark-gfm` if not present
- [ ] Replace plain text rendering in `ChatMessage.tsx` with `<ReactMarkdown remarkPlugins={[remarkGfm]}>`
- [ ] Apply to both streaming (in-progress) messages and completed messages
- [ ] Ensure the blinking cursor indicator still shows during streaming
- [ ] Test: code blocks, bold, italic, lists, links — all render correctly mid-stream
- [ ] Remove any existing regex-based text parsing that conflicts with react-markdown
- [ ] Coordinate with `syntax-highlighting` ticket — use react-markdown's `components.code` for code block rendering

## Files

- `src/app/[locale]/(app)/projects/[projectId]/features/[epicId]/_components/ChatMessage.tsx`
