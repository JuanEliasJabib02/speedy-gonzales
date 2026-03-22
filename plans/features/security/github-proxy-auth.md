# GitHub Proxy Endpoints Auth (SEC-01/02/03 v2)

**Status:** completed
**Priority:** critical

## What it does

Three new API endpoints expose GITHUB_PAT as an unauthenticated proxy. Any anonymous request can use them to access private repos or exhaust rate limits.

## Affected endpoints

- `src/app/api/commit-diff/route.ts`
- `src/app/api/repo-tree/route.ts`
- `src/app/api/repo-tree/branches/route.ts`
- `src/app/api/repo-file/route.ts`

## Fix

Add auth check at the top of each GET handler:

```ts
import { auth } from "@/auth"  // use the project's auth helper

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  // rest of handler...
}
```

## Checklist

- [x] Add auth to `commit-diff/route.ts`
- [x] Add auth to `repo-tree/route.ts`
- [x] Add auth to `repo-tree/branches/route.ts`
- [x] Add auth to `repo-file/route.ts`
- [x] Update status to review
