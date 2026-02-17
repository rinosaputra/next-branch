import ForgotPasswordForm from "@/components/auth/forgot-password-form"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Forgot Password",
  description: "Reset your password",
  path: "/forgot-password",
  noIndex: true,
})

const AuthForgotPasswordPage = ForgotPasswordForm

export default AuthForgotPasswordPage
