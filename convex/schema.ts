import { defineSchema } from "convex/server"
import { authTables } from "@convex-dev/auth/server"
import { users } from "./schema/users"

export default defineSchema({
  ...authTables,
  users,
})
