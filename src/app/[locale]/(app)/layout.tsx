"use client"

import { usePathname } from "@/src/i18n/routing"
import { AppSidebar } from "./_components/AppSidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullWidth = pathname.includes("/features/")

  if (isFullWidth) {
    return <div className="h-screen overflow-hidden bg-background">{children}</div>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto bg-background">{children}</div>
    </div>
  )
}
