// lib/auth/permissions.ts
import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"


/**
 * Global Admin Permission Statements
 *
 * These permissions apply system-wide, not organization-scoped.
 * Only system administrators should have these permissions.
 *
 * Resources:
 * - user: Manage all users in the system
 * - session: Manage all sessions
 * - system: System-level operations
 *
 * @scope Global (Platform-wide)
 */
export const statement = {
  ...defaultStatements,

  // user, session management from Better Auth// User management (all users in system)
  user: ["create", "read", "update", "delete", "ban", "set-role", "set-password"],

  // Session management (all sessions in system)
  session: ["list", "revoke", "delete"],

  // System-level operations
  system: ["settings", "audit", "logs", "maintenance"],
} as const

/**
 * Create Admin Access Control
 */
export const ac = createAccessControl(statement)

// Viewer Admin (Read-only System Access)
export const viewer = ac.newRole({
  user: ["read"],
  session: ["list"],
  system: ["audit", "logs"],
})

// Support Admin (Customer Support)
export const support = ac.newRole({
  user: ["read", "ban", "set-password"],
  session: ["list", "revoke"],
  system: ["audit", "logs"],
})

/**
 * Global Admin Roles
 *
 * These roles have system-wide permissions.
 * Completely separate from organization roles.
 */

// Super Admin (Platform Owner)
export const admin = ac.newRole({
  ...adminAc.statements, // Inherit all user/session management
  user: ["create", "read", "update", "delete", "ban", "set-role", "set-password"],
  session: ["list", "revoke", "delete"],
  system: ["settings", "audit", "logs", "maintenance"],
})

/**
 * Export Admin Roles
 */
export const roles = {
  viewer,
  support,
  admin,
} as const

/**
 * Type exports for TypeScript
 */
export type Role = keyof typeof roles

export const defaultRole: Role = "viewer"

export type Statement = typeof statement
