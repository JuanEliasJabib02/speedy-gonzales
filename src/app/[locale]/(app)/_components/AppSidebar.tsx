"use client"

import { BarChart3, BookOpen, FolderKanban, Github, Settings, Zap } from "lucide-react"
import { usePathname } from "@/src/i18n/routing"
import { SidebarNavItem } from "./SidebarNavItem"
import { UserMenu } from "./UserMenu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/lib/components/ui/tooltip"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
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
          icon={BarChart3}
          label="Analytics"
          href="/analytics"
          isActive={pathname.includes("/analytics")}
        />
        <SidebarNavItem
          icon={Settings}
          label="Settings"
          href="#"
          isActive={false}
        />
      </nav>

      {/* GitHub link */}
      <div className="px-3 py-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://github.com/JuanEliasJabib02/speedy-gonzales"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Github className="size-4" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Star us on GitHub</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* User menu */}
      <div className="border-t border-border p-3">
        <UserMenu />
      </div>
      </aside>
    </TooltipProvider>
  )
}
