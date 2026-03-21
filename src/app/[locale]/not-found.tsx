import { Link } from "@/src/i18n/routing"

export default function NotFoundPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-6xl text-foreground">404</h1>
      <p className="text-muted-foreground">Página no encontrada</p>
      <Link
        href="/"
        className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
