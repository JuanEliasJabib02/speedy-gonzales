# Dead Code Cleanup

**Status:** in-progress
**Priority:** critical

## Overview

Remove legacy and dead code that poses security risks or causes confusion. The `plans/[epicId]/route.ts` API route is pre-Convex legacy code with no auth and a path traversal vulnerability. The `authHelper.ts` file is dead code with wrong auth logic that could mislead future developers.

Addresses audit findings #3, #9, #22.

## Still needs

- [ ] Delete `plans/[epicId]/route.ts` (legacy filesystem route with path traversal risk)
- [ ] Delete `authHelper.ts` (dead code with wrong cookie name)
