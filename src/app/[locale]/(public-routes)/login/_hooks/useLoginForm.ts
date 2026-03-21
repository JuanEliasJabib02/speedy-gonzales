"use client"

import React, { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { useAuthActions } from "@convex-dev/auth/react"

export function useLoginForm() {
  const t = useTranslations("login.errors")
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [otpOpen, setOtpOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value)
    setError(null)
  }, [])

  const handleOtpOpenChange = useCallback((open: boolean) => {
    setOtpOpen(open)
    if (!open) setEmail("")
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!email.trim()) return

      setIsSending(true)
      setError(null)

      try {
        await signIn("email", { email })
        setOtpOpen(true)
      } catch (err) {
        console.error("[auth] signIn failed:", err)
        setError(t("sendFailed"))
      } finally {
        setIsSending(false)
      }
    },
    [email, signIn, t],
  )

  return {
    email,
    isSending,
    otpOpen,
    error,
    handleEmailChange,
    handleOtpOpenChange,
    handleSubmit,
  }
}
