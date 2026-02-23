import { z } from "zod"

/**
 * Organization Validation Schemas
 *
 * Production-grade validation for organization management.
 *
 * Features:
 * - Slug validation (URL-safe)
 * - Logo URL validation
 * - Description length limits
 * - Reusable schemas (create, edit)
 *
 * @module lib/validations/organization
 */

// ============================================================================
// Field Schemas
// ============================================================================

/**
 * Organization name schema
 */
export const organizationNameSchema = z
  .string()
  .min(2, "Organization name must be at least 2 characters")
  .max(100, "Organization name must not exceed 100 characters")
  .trim()

/**
 * Organization slug schema
 *
 * Requirements:
 * - Lowercase letters, numbers, hyphens only
 * - Must start with letter
 * - Must end with letter or number
 * - 2-50 characters
 */
export const organizationSlugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(50, "Slug must not exceed 50 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens"
  )
  .regex(/^[a-z]/, "Slug must start with a letter")
  .regex(/[a-z0-9]$/, "Slug must end with a letter or number")
  .trim()
  .toLowerCase()

/**
 * Organization logo schema
 */
export const organizationLogoSchema = z
  .string()
  .url("Logo must be a valid URL")
  .optional()
  .or(z.literal(""))

/**
 * Organization description schema
 */
export const organizationDescriptionSchema = z
  .string()
  .max(500, "Description must not exceed 500 characters")
  .optional()
  .or(z.literal(""))

// ============================================================================
// Organization Form Schemas
// ============================================================================

/**
 * Create Organization Schema
 */
export const createOrganizationSchema = z.object({
  name: organizationNameSchema,
  slug: organizationSlugSchema,
  logo: organizationLogoSchema,
  description: organizationDescriptionSchema,
})

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>

/**
 * Update Organization Schema
 *
 * All fields optional (partial updates).
 */
export const editOrganizationSchema = createOrganizationSchema.partial().extend({
  id: z.string("Organization ID is required for editing").min(1, "Organization ID cannot be empty"),
})

export type EditOrganizationInput = z.infer<typeof editOrganizationSchema>

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate slug from organization name
 *
 * @param name - Organization name
 * @returns URL-safe slug
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Validate slug format (without API check)
 *
 * @param slug - Slug to validate
 * @returns True if slug format is valid
 */
export function isValidSlugFormat(slug: string): boolean {
  try {
    organizationSlugSchema.parse(slug)
    return true
  } catch {
    return false
  }
}
