"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/src/i18n/routing"
import { useAuthActions } from "@convex-dev/auth/react"
import type { OtpStep } from "../_types/types"

export function useOtpDialog(
  email: string,
  onOpenChange: (open: boolean) => void,
) {
  const t = useTranslations("login.errors")
  const router = useRouter()
  const { signIn } = useAuthActions()
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<OtpStep>("input")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleComplete = useCallback(
    async (value: string) => {
      setOtp(value)
      setStep("verifying")
      setErrorMessage(null)

      try {
        await signIn("email", { email, code: value })
        onOpenChange(false)
        router.push("/dashboard")
      } catch {
        setStep("error")
        setErrorMessage(t("invalidCode"))
        setOtp("")
      }
    },
    [email, signIn, router, onOpenChange],
  )

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        setOtp("")
        setStep("input")
        setErrorMessage(null)
      }
      onOpenChange(next)
    },
    [onOpenChange],
  )

  const handleResend = useCallback(async () => {
    setOtp("")
    setStep("input")
    setErrorMessage(null)
    try {
      await signIn("email", { email })
    } catch {
      setErrorMessage(t("resendFailed"))
    }
  }, [email, signIn])

  return {
    otp,
    setOtp,
    step,
    errorMessage,
    handleComplete,
    handleOpenChange,
    handleResend,
  }
}
