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
  editOrganizationSchema,
  type EditOrganizationInput,
} from "@/lib/validations/organization"
import { useEditOrganization } from "@/hooks/organization"

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
  const edit = useEditOrganization()

  const form = useForm<EditOrganizationInput>({
    resolver: zodResolver(editOrganizationSchema),
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
  const onSubmit = async (data: EditOrganizationInput) => {
    toast.promise(
      edit.mutateAsync(data),
      {
        loading: "Updating organization...",
        success: () => {
          // Redirect if slug changed
          if (data.slug && data.slug !== organization.slug) {
            router.push(`/dashboard/organizations/${data.slug}`)
          } else {
            router.push(`/dashboard/organizations/${organization.slug}`)
          }
          return "Organization updated successfully"
        },
        error: (err) => err.message || "Failed to update organization",
      }
    )
  }

  const hasChanges = form.formState.isDirty

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* @ts-ignore */}
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
