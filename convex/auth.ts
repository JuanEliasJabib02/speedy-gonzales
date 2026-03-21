import { convexAuth } from "@convex-dev/auth/server"
import { Email } from "@convex-dev/auth/providers/Email"
import Google from "@auth/core/providers/google"
import type { MutationCtx } from "./_generated/server"

// Generate a 6-digit numeric OTP to match the existing UI
const generateOtpCode = async () =>
  Math.floor(100000 + Math.random() * 900000).toString()

const emailProvider = {
  ...Email({
    sendVerificationRequest: async ({ identifier: email, token }) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
        },
        body: JSON.stringify({
          from: "My App <onboarding@resend.dev>",
          to: [email],
          subject: "Your access code",
          text: `Your access code is: ${token}\n\nThis code expires in 1 hour.`,
        }),
      })
      if (!res.ok) {
        const error = await res.text()
        throw new Error(`Failed to send verification email: ${error}`)
      }
    },
  }),
  generateVerificationToken: generateOtpCode,
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [emailProvider, Google],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Existing user: verify the record still exists before returning
      if (args.existingUserId) {
        const exists = await ctx.db.get(args.existingUserId)
        if (exists) return args.existingUserId
      }

      // Account linking: if a user with this email already exists, reuse the same record
      if (args.profile.email) {
        const existing = await (ctx as unknown as MutationCtx).db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", args.profile.email!))
          .first()
        if (existing) return existing._id
      }

      // New user: create with defaults
      const authProvider = args.provider.id === "google" ? "google" : "magic_link"
      return await ctx.db.insert("users", {
        email: args.profile.email,
        name: args.profile.name as string | undefined,
        authProvider,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    },
  },
})
