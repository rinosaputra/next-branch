// lib/auth/rbac-utils.ts
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Require permission or redirect to unauthorized
 */
export async function requirePermission(
  resource: string,
  actions: string[]
) {
  const hasPermission = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        [resource]: actions
      }
    }
  })

  if (!hasPermission) {
    redirect("/unauthorized")
  }
}

/**
 * Check if current user has permission
 */
export async function checkPermission(
  resource: string,
  actions: string[]
): Promise<boolean> {
  const hasPermission = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        [resource]: actions
      }
    }
  })

  return !!hasPermission
}

const unauthorizedUrl = (process.env.NEXT_PUBLIC_DASHBOARD_URL || "/dashboard")
  + (process.env.NEXT_PUBLIC_UNAUTHORIZED_URL || "/unauthorized")

/**
 * Require role or redirect
 */
export async function requireRole(roleName: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user.role?.includes(roleName)) {
    redirect(unauthorizedUrl)
  }
}
