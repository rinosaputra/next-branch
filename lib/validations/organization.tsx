import { z } from "zod"

/**
 * Organization validation schemas
 *
 * Used for both create and update forms.
 * Enforces consistent validation rules.
 */

/**
 * Create organization schema
 */
export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must not exceed 100 characters")
    .trim(),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must not exceed 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .regex(/^[a-z]/, "Slug must start with a letter")
    .regex(/[a-z0-9]$/, "Slug must end with a letter or number")
    .trim(),

  logo: z
    .string()
    .url("Logo must be a valid URL")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
})

/**
 * Update organization schema
 *
 * Same as create, but all fields are optional
 * (allows partial updates)
 */
export const updateOrganizationSchema = createOrganizationSchema.partial()

/**
 * Type inference
 */
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>
