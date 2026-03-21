"use client"

import { useEffect } from "react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-2xl text-foreground">Algo salió mal</h1>
      <p className="max-w-md text-center text-muted-foreground">
        Ocurrió un error inesperado. Intenta de nuevo o recarga la página.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
      >
        Reintentar
      </button>
    </div>
  )
}
