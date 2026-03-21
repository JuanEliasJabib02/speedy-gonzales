import { defineTable } from "convex/server"
import { v } from "convex/values"

export const users = defineTable({
  // Convex Auth fields (required for email OTP)
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),

  // Profile
  name: v.optional(v.string()),
  authProvider: v.optional(v.string()),
  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
}).index("by_email", ["email"])
