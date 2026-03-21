import { z } from "zod/v4"

const clientSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.url(),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
})

const parsed = clientSchema.safeParse({
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})

if (!parsed.success) {
  console.error("Invalid client environment variables:", parsed.error.format())
  throw new Error("Invalid client environment variables. Check .env.local")
}

export const env = parsed.data
