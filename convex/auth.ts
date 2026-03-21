import { convexAuth } from "@convex-dev/auth/server"
import { Email } from "@convex-dev/auth/providers/Email"
import type { MutationCtx } from "./_generated/server"

const generateOtpCode = async () =>
  Math.floor(100000 + Math.random() * 900000).toString()

const emailProvider = {
  ...Email({
    sendVerificationRequest: async ({ identifier: email, token }) => {
      const apiKey = process.env.AUTH_RESEND_KEY
      console.log("[auth] sendVerificationRequest called for:", email)
      console.log("[auth] AUTH_RESEND_KEY present:", !!apiKey, "length:", apiKey?.length ?? 0)

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "Speedy Gonzales <onboarding@resend.dev>",
          to: [email],
          subject: "Your access code",
          text: `Your access code is: ${token}\n\nThis code expires in 1 hour.`,
        }),
      })

      const responseText = await res.text()
      console.log("[auth] Resend response status:", res.status)
      console.log("[auth] Resend response body:", responseText)

      if (!res.ok) {
        throw new Error(`Failed to send verification email: ${responseText}`)
      }
    },
  }),
  generateVerificationToken: generateOtpCode,
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [emailProvider],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      if (args.existingUserId) {
        const exists = await ctx.db.get(args.existingUserId)
        if (exists) return args.existingUserId
      }

      if (args.profile.email) {
        const existing = await (ctx as unknown as MutationCtx).db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", args.profile.email!))
          .first()
        if (existing) return existing._id
      }

      return await ctx.db.insert("users", {
        email: args.profile.email,
        name: args.profile.name as string | undefined,
        authProvider: "magic_link",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    },
  },
})
