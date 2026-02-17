import RegisterForm from "@/components/auth/register-form"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Register",
  description: "Create a new account",
})

const AuthRegisterPage = RegisterForm

export default AuthRegisterPage
