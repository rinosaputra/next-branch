import { z } from "zod"
import { roles as permissionRoles, type Role } from "@/lib/auth/permissions"
import { passwordSchema } from "./password"

/**
 * User Validation Schemas
 *
 * Production-grade validation for user management.
 *
 * Features:
 * - Type-safe role validation (synced with permissions)
 * - Password strength requirements
 * - Email format validation
 * - Reusable schemas (create, edit, password change)
 * - Clear error messages
 *
 * Architecture:
 * - Single source of truth (permissions.ts)
 * - Extensible for future validations
 * - Consistent with Better Auth schemas
 *
 * @module lib/validations/user
 */

// ============================================================================
// Role Configuration
// ============================================================================

/**
 * Role Options (derived from permissions.ts)
 *
 * Single source of truth: lib/auth/permissions.ts
 * Automatically synced with permission system.
 */
export const roleOptions = Object.keys(permissionRoles) as [Role, ...Role[]]

/**
 * Role Metadata for UI
 *
 * Used in select dropdowns, tooltips, documentation.
 * Separated from validation logic for clean separation of concerns.
 */
export const roleMetadata: Record<
  Role,
  {
    label: string
    description: string
    badge?: "default" | "secondary" | "destructive" | "outline"
  }
> = {
  viewer: {
    label: "Viewer",
    description: "Read-only access to content",
    badge: "outline",
  },
  support: {
    label: "Support",
    description: "Can assist with user issues and support tickets",
    badge: "secondary",
  },
  admin: {
    label: "Administrator",
    description: "Full system access and user management",
    badge: "default",
  },
}

/**
 * Role Options for UI Components
 *
 * Pre-formatted for shadcn Select, RadioGroup, etc.
 */
export const roleSelectOptions = roleOptions.map((role) => ({
  value: role,
  label: roleMetadata[role].label,
  description: roleMetadata[role].description,
}))

export const emailSchema = z
  .email("Invalid email address")
  .min(1, "Email is required")
  .toLowerCase()
  .trim()

/**
 * Name validation schema
 *
 * Requirements:
 * - Minimum 2 characters
 * - Maximum 100 characters
 * - Trimmed whitespace
 */
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must not exceed 100 characters")
  .trim()

/**
 * Role validation schema
 *
 * Automatically synced with permission system roles.
 */
export const roleSchema = z.enum(roleOptions, {
  error: () => ({ message: "Please select a valid role" }),
})

// ============================================================================
// User Form Schemas
// ============================================================================

/**
 * Create User Schema
 *
 * Used for user creation forms.
 * Requires name, email, password, and role.
 */
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
})

export type CreateUserInput = z.infer<typeof createUserSchema>

/**
 * Edit User Schema
 *
 * Used for user editing forms.
 * Excludes password (use separate password change form).
 */
export const editUserSchema = createUserSchema.omit({ password: true })

export type EditUserInput = z.infer<typeof editUserSchema>

/**
 * Change Password Schema
 *
 * Used for password change forms (admin or self-service).
 */
export const changePasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

/**
 * Change Own Password Schema
 *
 * Used for self-service password change (requires current password).
 */
export const changeOwnPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })

export type ChangeOwnPasswordInput = z.infer<typeof changeOwnPasswordSchema>

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get role label from role value
 *
 * @param role - Role value (e.g., "admin")
 * @returns Human-readable label (e.g., "Administrator")
 */
export function getRoleLabel(role: Role): string {
  return roleMetadata[role]?.label || role
}

/**
 * Get role description from role value
 *
 * @param role - Role value (e.g., "admin")
 * @returns Role description for tooltips/help text
 */
export function getRoleDescription(role: Role): string {
  return roleMetadata[role]?.description || ""
}

/**
 * Check if role exists
 *
 * @param role - Role value to check
 * @returns True if role exists in permission system
 */
export function isValidRole(role: string): role is Role {
  return roleOptions.includes(role as Role)
}
