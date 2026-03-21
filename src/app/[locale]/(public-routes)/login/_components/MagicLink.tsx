"use client"

import React from "react"
import { Loader2, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { Label } from "@/src/lib/components/ui/label"

type MagicLinkProps = {
  email: string
  isSending: boolean
  error: string | null
  onEmailChange: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function MagicLink({
  email,
  isSending,
  error,
  onEmailChange,
  onSubmit,
}: MagicLinkProps) {
  const t = useTranslations("login.magicLink")

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          {t("emailLabel")}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-11 pl-10"
            required
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        disabled={isSending || !email.trim()}
        className="h-11 w-full cursor-pointer bg-cta text-cta-foreground transition-colors hover:bg-cta/90"
      >
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("sending")}
          </>
        ) : (
          t("submitButton")
        )}
      </Button>
    </form>
  )
}
