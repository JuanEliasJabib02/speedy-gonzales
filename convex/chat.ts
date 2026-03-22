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

export const getRecentMessages = query({
  args: { epicId: v.id("epics") },
  handler: async (ctx, { epicId }) => {
    await requireAuth(ctx)
    const all = await ctx.db
      .query("chatMessages")
      .withIndex("by_epic", (q) => q.eq("epicId", epicId))
      .collect()
    return all.slice(-30)
  },
})

export const getMessageCount = query({
  args: { epicId: v.id("epics") },
  handler: async (ctx, { epicId }) => {
    await requireAuth(ctx)
    const all = await ctx.db
      .query("chatMessages")
      .withIndex("by_epic", (q) => q.eq("epicId", epicId))
      .collect()
    return all.length
  },
})

export const sendMessage = mutation({
  args: {
    epicId: v.id("epics"),
    content: v.string(),
    tokenCount: v.optional(v.number()),
  },
  handler: async (ctx, { epicId, content, tokenCount }) => {
    await requireAuth(ctx)
    return ctx.db.insert("chatMessages", {
      epicId,
      role: "user",
      content,
      tokenCount,
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

// Called from Next.js API route (server-side, authenticated via user token)
export const saveAssistantMessage = mutation({
  args: {
    epicId: v.id("epics"),
    content: v.string(),
    metadata: v.optional(v.any()),
    tokenCount: v.optional(v.number()),
  },
  handler: async (ctx, { epicId, content, metadata, tokenCount }) => {
    await requireAuth(ctx)
    return ctx.db.insert("chatMessages", {
      epicId,
      role: "assistant",
      content,
      metadata,
      tokenCount,
      createdAt: Date.now(),
    })
  },
})

// Creates an empty assistant message with isStreaming: true at stream start
export const createStreamingMessage = mutation({
  args: { epicId: v.id("epics") },
  handler: async (ctx, { epicId }) => {
    await requireAuth(ctx)
    return ctx.db.insert("chatMessages", {
      epicId,
      role: "assistant",
      content: "",
      isStreaming: true,
      isInterrupted: false,
      createdAt: Date.now(),
    })
  },
})

// Patches the streaming message with final content when the stream ends
export const finalizeStreamingMessage = mutation({
  args: {
    messageId: v.id("chatMessages"),
    content: v.string(),
    isInterrupted: v.optional(v.boolean()),
    metadata: v.optional(v.any()),
    tokenCount: v.optional(v.number()),
  },
  handler: async (ctx, { messageId, content, isInterrupted, metadata, tokenCount }) => {
    await requireAuth(ctx)
    await ctx.db.patch(messageId, {
      content,
      isStreaming: false,
      isInterrupted: isInterrupted ?? false,
      metadata,
      tokenCount,
    })
  },
})

// Marks an orphaned streaming message as interrupted (called from client on mount or stop)
export const markMessageInterrupted = mutation({
  args: { messageId: v.id("chatMessages") },
  handler: async (ctx, { messageId }) => {
    await requireAuth(ctx)
    await ctx.db.patch(messageId, { isStreaming: false, isInterrupted: true })
  },
})
