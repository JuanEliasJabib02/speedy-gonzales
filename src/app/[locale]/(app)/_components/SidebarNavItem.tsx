"use client"

import { Link } from "@/src/i18n/routing"
import { cn } from "@/src/lib/helpers/cn"
import type { LucideIcon } from "lucide-react"

type SidebarNavItemProps = {
  icon: LucideIcon
  label: string
  href: string
  isActive: boolean
}

export function SidebarNavItem({
  icon: Icon,
  label,
  href,
  isActive,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  )
}
