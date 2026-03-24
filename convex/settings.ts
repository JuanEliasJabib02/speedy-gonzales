import { query } from "./_generated/server"
import { requireAuth } from "./helpers"

export const getEnvVarStatus = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx)

    const envVars = [
      "LOOP_API_KEY",
      "GITHUB_ACCESS_TOKEN",
      "BITBUCKET_ACCESS_TOKEN",
      "BITBUCKET_USERNAME",
      "AUTH_RESEND_KEY"
    ]

    return envVars.map((key) => ({
      key,
      configured: !!process.env[key]
    }))
  }
})