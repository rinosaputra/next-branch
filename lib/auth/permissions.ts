// lib/auth/permissions.ts
import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"

// Define your application's resources and actions
export const statement = {
  ...defaultStatements, // user, session management from Better Auth

  // Custom resources
  project: ["create", "read", "update", "delete", "share"],
  // document: ["create", "read", "update", "delete", "publish"],
  // payment: ["create", "read", "refund"],
  // analytics: ["view", "export"],
  // settings: ["read", "update"],
} as const

export const ac = createAccessControl(statement)

// Define roles
export const viewer = ac.newRole({
  project: ["read"],
  // document: ["read"],
  // analytics: ["view"],
})

export const contributor = ac.newRole({
  project: ["create", "read", "update"],
  // document: ["create", "read", "update"],
  // analytics: ["view"],
})

export const editor = ac.newRole({
  project: ["create", "read", "update", "delete", "share"],
  // document: ["create", "read", "update", "delete", "publish"],
  // analytics: ["view", "export"],
})

export const admin = ac.newRole({
  project: ["create", "read", "update", "delete", "share"],
  // document: ["create", "read", "update", "delete", "publish"],
  // payment: ["create", "read", "refund"],
  // analytics: ["view", "export"],
  // settings: ["read", "update"],
  ...adminAc.statements, // Inherit all user/session management
})

export const roles = {
  viewer,
  contributor,
  editor,
  admin,
} as const

export type Role = keyof typeof roles
