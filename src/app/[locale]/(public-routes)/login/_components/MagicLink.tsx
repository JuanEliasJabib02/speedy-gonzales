"use client"

import React from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"

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
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Input
        id="email"
        type="email"
        placeholder={t("emailPlaceholder")}
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="h-10"
        required
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        disabled={isSending || !email.trim()}
        className="h-10 w-full cursor-pointer"
      >
        {isSending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("sending")}
          </>
        ) : (
          t("submitButton")
        )}
      </Button>
    </form>
  )
}
