"use client"

import { useState } from "react"
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
  createOrganizationSchema,
  type CreateOrganizationInput,
} from "@/lib/validations/organization"
import { useCheckOrganizationSlug, useCreateOrganization } from "@/hooks/organization"
import { Spinner } from "@/components/ui/spinner"

/**
 * Create Organization Form Component
 *
 * Features:
 * - Name and slug input with auto-generation
 * - Real-time slug availability check
 * - Logo URL (optional)
 * - Description textarea (optional)
 * - Form validation (Zod)
 * - Loading states
 * - Success/error feedback
 * - Auto-redirect after creation
 *
 * Architecture:
 * - Client component (form interactivity)
 * - react-hook-form + Zod validation
 * - Better Auth Organization API
 * - Reusable form fields component
 *
 * @example
 * ```tsx
 * <CreateOrganizationForm />
 * ```
 */
export function CreateOrganizationForm() {
  const router = useRouter()
  const create = useCreateOrganization() // Initialize mutation hook
  const checkSlug = useCheckOrganizationSlug() // Initialize slug check hook

  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: "",
      description: "",
    },
  })
  const slugValue = form.watch("slug")
  const isCheckingSlug = checkSlug.data?.slug === slugValue && checkSlug.data.status

  /**
   * Handle form submission
   */
  const onSubmit = async (data: CreateOrganizationInput) => {
    toast.promise(
      create.mutateAsync(data),
      {
        loading: "Creating organization...",
        success: () => {
          form.reset() // Reset form after successful creation
          router.push(`/dashboard/organizations/${data.slug}`)
          return "Organization created successfully!"
        },
        error: "Failed to create organization",
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <OrganizationFormFields
          form={form}
          isCheckingSlug={isCheckingSlug}
          mode="create"
        />

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isCheckingSlug}
            className="flex-1"
          >
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? "Creating..." : "Create Organization"}
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
      </form>
    </Form>
  )
}
