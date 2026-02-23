import { createAccessControl } from "better-auth/plugins/access"
import {
  defaultStatements,
  ownerAc,
  adminAc as defaultAdminAc,
  memberAc as defaultMemberAc,
} from "better-auth/plugins/organization/access"

/**
 * Organization Permission Statements
 *
 * These permissions are scoped per organization.
 * A user can have different roles in different organizations.
 *
 * Resources:
 * - organization: Organization settings
 * - member: Member management within org
 * - invitation: Invite system
 * - project: App-specific resource (example)
 * - analytics: App-specific resource (example)
 * - billing: App-specific resource (example)
 *
 * @scope Organization (Per-workspace)
 */
const organizationStatements = {
  // Default organization resources
  ...defaultStatements, // organization, member, invitation, team

  // Custom application resources (add your own)
  project: ["create", "read", "update", "delete", "share"],
  analytics: ["read", "export"],
  billing: ["read", "update"],
} as const

/**
 * Create Organization Access Control
 */
export const orgAc = createAccessControl(organizationStatements)

/**
 * Organization Roles
 *
 * These roles are organization-scoped.
 * User can be "owner" in Org A and "member" in Org B.
 */

// Organization Owner (Creator, Full Control)
export const orgOwner = orgAc.newRole({
  // Default organization permissions (full control)
  ...ownerAc.statements,

  // Custom resource permissions
  project: ["create", "read", "update", "delete", "share"],
  // analytics: ["read", "export"],
  // billing: ["read", "update"],
})

// Organization Admin (Manage Members & Settings)
export const orgAdmin = orgAc.newRole({
  // Default admin permissions (manage members)
  ...defaultAdminAc.statements,

  // Custom resource permissions
  project: ["create", "read", "update", "delete"],
  // analytics: ["read", "export"],
  // billing: ["read"],
})

// Organization Editor (Create & Edit Content)
export const orgEditor = orgAc.newRole({
  // Default member permissions (basic access)
  ...defaultMemberAc.statements,

  // Custom resource permissions
  project: ["create", "read", "update"],
  // analytics: ["read"],
})

// Organization Viewer (Read-only)
export const orgViewer = orgAc.newRole({
  // Default member permissions (basic access)
  ...defaultMemberAc.statements,

  // Custom resource permissions
  project: ["read"],
  // analytics: ["read"],
})

/**
 * Export Organization Roles
 */
export const organizationRoles = {
  orgOwner,
  orgAdmin,
  orgEditor,
  orgViewer,
}

/**
 * Type exports for TypeScript
 */
export type OrganizationRole = keyof typeof organizationRoles

export const defaultCreatoreOrganizationRole: OrganizationRole = "orgOwner"

export type OrganizationStatements = typeof organizationStatements
