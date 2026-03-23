import type { QueryCtx, MutationCtx } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { getAuthUserId } from "@convex-dev/auth/server"
import { throwError, ErrorCodes } from "./errors"
import { v } from "convex/values"

// ── Shared union validators ──────────────────────────────────────────
export const statusValidator = v.union(
  v.literal("backlog"),
  v.literal("todo"),
  v.literal("in-progress"),
  v.literal("review"),
  v.literal("completed"),
  v.literal("blocked"),
)

export const priorityValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("critical"),
)

export const syncStatusValidator = v.union(
  v.literal("idle"),
  v.literal("syncing"),
  v.literal("error"),
)

export const gitProviderValidator = v.union(
  v.literal("github"),
  v.literal("bitbucket"),
  v.literal("gitlab"),
)

export const agentStatusValidator = v.union(
  v.literal("idle"),
  v.literal("working"),
)

export const loopStatusValidator = v.union(
  v.literal("idle"),
  v.literal("running"),
  v.literal("error"),
)

// Arrays for runtime validation (used by parsePlan, etc.)
export const VALID_STATUSES = ["backlog", "todo", "in-progress", "review", "completed", "blocked"] as const
export const VALID_PRIORITIES = ["low", "medium", "high", "critical"] as const

// TypeScript types derived from the arrays
export type TicketStatus = (typeof VALID_STATUSES)[number]
export type TicketPriority = (typeof VALID_PRIORITIES)[number]
export type ValidStatus = TicketStatus
export type ValidPriority = TicketPriority

// Returns the authenticated userId or throws UNAUTHORIZED
export async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx)
  if (!userId) return throwError(ErrorCodes.UNAUTHORIZED) as never
  return userId
}

export function assertValidStatus(status: string): asserts status is ValidStatus {
  if (!(VALID_STATUSES as readonly string[]).includes(status)) {
    throwError(ErrorCodes.INVALID_STATUS)
  }
}
