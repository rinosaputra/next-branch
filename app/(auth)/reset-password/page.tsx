import { createMetadata } from "@/lib/metadata"
import ResetPasswordTokenForm from "@/components/auth/reset-password-token-form"
import { Suspense } from "react"

export const metadata = createMetadata({
  title: "Reset Password",
  description: "Set a new password for your account",
  path: "/reset-password",
  noIndex: true, // Don't index auth pages
})

const ResetPasswordPage = ResetPasswordTokenForm

export default ResetPasswordPage
