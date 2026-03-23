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

export const VALID_STATUSES = ["todo", "in-progress", "review", "completed", "blocked"] as const
export type ValidStatus = (typeof VALID_STATUSES)[number]

export const VALID_PRIORITIES = ["low", "medium", "high", "critical"] as const
export type ValidPriority = (typeof VALID_PRIORITIES)[number]

export function assertValidStatus(status: string): asserts status is ValidStatus {
  if (!VALID_STATUSES.includes(status as ValidStatus)) {
    throwError(ErrorCodes.INVALID_STATUS)
  }
}
