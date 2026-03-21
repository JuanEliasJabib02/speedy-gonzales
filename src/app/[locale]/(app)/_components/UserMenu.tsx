"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { LogOut } from "lucide-react"
import { useCurrentUser } from "@/src/lib/hooks/useCurrentUser"
import { ThemeToggle } from "@/src/lib/components/common/ThemeToggle"
import { Button } from "@/src/lib/components/ui/button"

export function UserMenu() {
  const { initial, email, isLoading } = useCurrentUser()
  const { signOut } = useAuthActions()

  if (isLoading) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          {initial}
        </div>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </div>
      <div className="flex items-center justify-between">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="h-8 gap-2 text-xs text-muted-foreground"
        >
          <LogOut className="size-3.5" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
