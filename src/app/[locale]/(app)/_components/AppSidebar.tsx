"use client"

import { BookOpen, FolderKanban, Settings, Zap } from "lucide-react"
import { usePathname } from "@/src/i18n/routing"
import { SidebarNavItem } from "./SidebarNavItem"
import { UserMenu } from "./UserMenu"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-[240px] flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 p-4">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary">
          <Zap className="size-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold">Speedy Gonzales</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <SidebarNavItem
          icon={FolderKanban}
          label="Projects"
          href="/dashboard"
          isActive={pathname.includes("/dashboard")}
        />
        <SidebarNavItem
          icon={BookOpen}
          label="Docs"
          href="/docs"
          isActive={pathname.includes("/docs")}
        />
        <SidebarNavItem
          icon={Settings}
          label="Settings"
          href="#"
          isActive={false}
        />
      </nav>

      {/* User menu */}
      <div className="border-t border-border p-3">
        <UserMenu />
      </div>
    </aside>
  )
}
