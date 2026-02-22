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

/**
 * Require Organization Permission
 *
 * Use this for organization-scoped operations (projects, analytics).
 * Checks permission within active organization context.
 *
 * @example
 * await requireOrganizationPermission("project", ["delete"])
 */
export async function requireOrganizationPermission(
  resource: string,
  actions: string[],
  organizationId?: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  // Get active organization if not specified
  const orgId = organizationId || session.session.activeOrganizationId

  if (!orgId) {
    redirect("/dashboard/organizations")
  }

  // Check organization permission (organization scope)
  const { hasPermission } = await auth.api.hasPermission({
    headers: await headers(),
    body: {
      permissions: {
        [resource]: actions,
      },
    },
  })

  if (!hasPermission) {
    redirect("/unauthorized")
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
  const adminRoles = ["superAdmin", "supportAdmin", "viewerAdmin"]
  return adminRoles.includes(session.user.role)
}

/**
 * Get User's Organization Role
 *
 * Returns the user's role within the specified organization.
 * Returns null if user is not a member.
 */
export async function getOrganizationRole(
  organizationId?: string
): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) return null

  const orgId = organizationId || session.session.activeOrganizationId
  if (!orgId) return null

  // Get member role in organization
  const { role } = await auth.api.getActiveMemberRole({
    headers: await headers(),
  })

  return role
}
