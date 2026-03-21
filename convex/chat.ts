import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { requireAuth } from "./helpers"

export const getMessages = query({
  args: { epicId: v.id("epics") },
  handler: async (ctx, { epicId }) => {
    await requireAuth(ctx)
    return ctx.db
      .query("chatMessages")
      .withIndex("by_epic", (q) => q.eq("epicId", epicId))
      .collect()
  },
})

export const sendMessage = mutation({
  args: {
    epicId: v.id("epics"),
    content: v.string(),
  },
  handler: async (ctx, { epicId, content }) => {
    await requireAuth(ctx)
    return ctx.db.insert("chatMessages", {
      epicId,
      role: "user",
      content,
      createdAt: Date.now(),
    })
  },
})

export const deleteMessage = mutation({
  args: { messageId: v.id("chatMessages") },
  handler: async (ctx, { messageId }) => {
    await requireAuth(ctx)
    await ctx.db.delete(messageId)
  },
})

// Public mutation — called from Next.js API route (server-side only)
export const saveAssistantMessage = mutation({
  args: {
    epicId: v.id("epics"),
    content: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, { epicId, content, metadata }) => {
    return ctx.db.insert("chatMessages", {
      epicId,
      role: "assistant",
      content,
      metadata,
      createdAt: Date.now(),
    })
  },
})
