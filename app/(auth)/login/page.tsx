import LoginForm from "@/components/auth/login-form"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Login",
  description: "Sign in to your account",
  path: "/login",
  noIndex: true,
})

const AuthLoginPage = LoginForm

export default AuthLoginPage
