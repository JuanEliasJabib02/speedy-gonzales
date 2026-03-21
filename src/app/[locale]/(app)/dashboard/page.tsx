"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useCurrentUser } from "@/src/lib/hooks/useCurrentUser"
import { Button } from "@/src/lib/components/ui/button"

export default function DashboardPage() {
  const { signOut } = useAuthActions()
  const { email, displayName, isLoading } = useCurrentUser()

  if (isLoading) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Welcome{displayName ? `, ${displayName}` : ""}</h1>
      <p className="text-muted-foreground">{email}</p>
      <Button variant="outline" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  )
}
