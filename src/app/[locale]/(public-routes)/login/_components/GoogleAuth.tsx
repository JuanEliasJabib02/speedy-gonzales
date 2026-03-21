"use client"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/src/lib/components/ui/button"
import { GoogleIcon } from "./GoogleIcon"

type GoogleAuthProps = {
  isLoading: boolean
  onAuth: () => void
}

export function GoogleAuth({ isLoading, onAuth }: GoogleAuthProps) {
  const t = useTranslations("login.googleAuth")

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onAuth}
      disabled={isLoading}
      className="h-11 w-full cursor-pointer gap-3 border-border font-medium transition-colors hover:bg-secondary"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("connecting")}
        </>
      ) : (
        <>
          <GoogleIcon className="h-5 w-5" />
          {t("button")}
        </>
      )}
    </Button>
  )
}
