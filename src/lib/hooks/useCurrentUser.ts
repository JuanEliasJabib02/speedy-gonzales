"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const getInitial = (name: string | undefined): string => {
  if (!name?.trim()) return "?"
  return name.trim()[0].toUpperCase()
}

export function useCurrentUser() {
  const user = useQuery(api.users.getCurrentUser)

  const displayName = user?.name ?? ""
  const initial = getInitial(displayName)
  const email = user?.email ?? ""

  return { user, displayName, initial, email, isLoading: user === undefined }
}
