import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { requireAuth } from "./helpers"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx)
    return ctx.storage.generateUploadUrl()
  },
})

export const getUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    await requireAuth(ctx)
    return ctx.storage.getUrl(storageId)
  },
})
