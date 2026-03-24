"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

type EnvVarStatus = {
  key: string
  configured: boolean
}

export default function SettingsPage() {
  // @ts-ignore - settings module will be available after codegen
  const envVarStatuses = useQuery(api.settings?.getEnvVarStatus) as EnvVarStatus[] | undefined

  if (envVarStatuses === undefined) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="mt-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-medium mb-4">Environment Variables</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="mt-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-medium mb-4">Environment Variables</h2>
          <div className="space-y-3">
            {envVarStatuses.map((env: EnvVarStatus) => (
              <div key={env.key} className="flex items-center justify-between">
                <code className="text-sm font-mono text-foreground">
                  {env.key}
                </code>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      env.configured ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {env.configured ? "Configured" : "Missing"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}