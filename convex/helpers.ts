import type { QueryCtx, MutationCtx } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { getAuthUserId } from "@convex-dev/auth/server"
import { throwError, ErrorCodes } from "./errors"

// Returns the authenticated userId or throws UNAUTHORIZED
export async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx)
  if (!userId) return throwError(ErrorCodes.UNAUTHORIZED) as never
  return userId
}
