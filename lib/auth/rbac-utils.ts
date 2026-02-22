// lib/auth/rbac-utils.ts
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { roles } from "./permissions"

const unauthorizedUrl = (process.env.NEXT_PUBLIC_DASHBOARD_URL || "/dashboard")
  + (process.env.NEXT_PUBLIC_UNAUTHORIZED_URL || "/unauthorized")

/**
 * Require permission or redirect to unauthorized
 */
export async function requirePermission(
  resource: string,
  actions: string[]
) {
  const { success: hasPermission } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        [resource]: actions
      }
    }
  })

  if (!hasPermission) {
    redirect(unauthorizedUrl)
  }
}

/**
 * Check if current user has permission
 */
export async function checkPermission(
  resource: string,
  actions: string[]
): Promise<boolean> {
  const { success: hasPermission } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        [resource]: actions
      }
    }
  })

  return !!hasPermission
}

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

/**
 * Check if User is System Admin
 *
 * Returns true if user has any global admin role.
 * Does NOT check organization roles.
 */
export async function isSystemAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) return false

  // Check if user has any admin role
  return Object.keys(roles).includes(session.user.role || "")
}
