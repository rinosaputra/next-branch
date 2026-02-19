import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { ac, roles } from "./auth/permissions"
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
  plugins: [
    adminClient({
      ac,
      roles
    })
  ]
})
