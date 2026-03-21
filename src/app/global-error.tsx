"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            height: "100vh",
            width: "100vw",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Algo salió muy mal
          </h1>
          <p style={{ color: "#666" }}>
            Ocurrió un error crítico. Intenta recargar.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: "0.375rem",
              background: "#111",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
