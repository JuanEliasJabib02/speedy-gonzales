import { ConvexError } from "convex/values"

// Standardized error codes for all Convex mutations and queries
export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  BAD_REQUEST: "BAD_REQUEST",
  CONFLICT: "CONFLICT",
  INTERNAL: "INTERNAL",
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

// Throw a typed, controlled Convex error
export const throwError = (code: ErrorCode) => {
  throw new ConvexError({ code })
}
