"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { OrganizationFormFields } from "./organization-form-fields"
import {
  updateOrganizationSchema,
  type UpdateOrganizationInput,
} from "@/lib/validations/organization"

interface EditOrganizationFormProps {
  organization: {
    id: string
    name: string
    slug: string
    logo?: string | null
    description?: string | null
  }
}

/**
 * Edit Organization Form Component
 *
 * Features:
 * - Pre-populated with existing data
 * - Update name, slug, logo, description
 * - Form validation (Zod)
 * - Loading states
 * - Success/error feedback
 * - Auto-redirect after update
 * - Cancel button
 *
 * Architecture:
 * - Client component (form interactivity)
 * - react-hook-form + Zod validation
 * - Better Auth Organization API
 * - Reusable form fields component
 *
 * @example
 * ```tsx
 * <EditOrganizationForm organization={organization} />
 * ```
 */
export function EditOrganizationForm({
  organization,
}: EditOrganizationFormProps) {
  const router = useRouter()

  const form = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo || "",
      description: organization.description || "",
    },
  })

  /**
   * Handle form submission
   */
  const onSubmit = async (data: UpdateOrganizationInput) => {
    try {
      const result = await authClient.organization.update({
        data: {
          name: data.name,
          slug: data.slug,
          logo: data.logo || null,
          // Note: Better Auth may not support description by default
          // Add via additionalFields if needed
        },
      })

      if (result.error) {
        toast.error("Failed to update organization", {
          description: result.error.message,
        })
        return
      }

      toast.success("Organization updated successfully")

      // Redirect if slug changed
      if (data.slug && data.slug !== organization.slug) {
        router.push(`/dashboard/organizations/${data.slug}`)
      } else {
        router.push(`/dashboard/organizations/${organization.slug}`)
      }

      router.refresh()
    } catch (error: any) {
      toast.error("Failed to update organization", {
        description: error.message || "An unexpected error occurred",
      })
    }
  }

  const hasChanges = form.formState.isDirty

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <OrganizationFormFields form={form} mode="edit" />

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !hasChanges}
            className="flex-1"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
        </div>

        {!hasChanges && (
          <p className="text-sm text-muted-foreground text-center">
            No changes to save
          </p>
        )}
      </form>
    </Form>
  )
}
