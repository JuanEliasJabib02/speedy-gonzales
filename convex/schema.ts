import { defineSchema } from "convex/server"
import { authTables } from "@convex-dev/auth/server"
import { users } from "./schema/users"
import { projects } from "./schema/projects"
import { epics } from "./schema/epics"
import { tickets } from "./schema/tickets"
import { chatMessages } from "./schema/chatMessages"

export default defineSchema({
  ...authTables,
  users,
  projects,
  epics,
  tickets,
  chatMessages,
})
