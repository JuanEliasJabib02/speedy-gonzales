# Path Traversal Fix (SEC-03)

**Status:** review
**Priority:** critical

## What it does

`getMemoryPath(projectId)` in route.ts is vulnerable to path traversal. If projectId = "../../../../.ssh/id_rsa", it reads arbitrary server files.

## Fix

Sanitize projectId before using it in the file path:

```ts
function getMemoryPath(projectId: string): string {
  const safe = projectId.replace(/[^a-zA-Z0-9_-]/g, "")
  if (!safe || safe.length < 3) throw new Error("Invalid projectId for memory path")
  return resolve(homedir(), ".openclaw", "workspace", "memory", `speedy-${safe}.md`)
}
```

## Checklist

- [x] Sanitize projectId in getMemoryPath()
- [x] Add length validation (min 3 chars after sanitization)
- [ ] Test with malicious projectId values

## Files

- `src/app/api/chat/route.ts`
