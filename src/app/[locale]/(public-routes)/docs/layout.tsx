import { Zap } from "lucide-react"
import Link from "next/link"

type DocsLayoutProps = {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary">
              <Zap className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Speedy Gonzales</span>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Docs
            </span>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Open App
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-6 py-12">{children}</div>
    </div>
  )
}
