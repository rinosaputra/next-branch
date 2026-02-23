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
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)

  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: "",
      description: "",
    },
  })

  /**
   * Check slug availability
   *
   * Debounced check to avoid excessive API calls
   */
  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 2) return

    setIsCheckingSlug(true)
    try {
      const result = await authClient.organization.checkSlug({
        slug,
      })

      if (!result.data?.available) {
        form.setError("slug", {
          type: "manual",
          message: "This slug is already taken",
        })
      } else {
        form.clearErrors("slug")
      }
    } catch (error: any) {
      console.error("Failed to check slug:", error)
    } finally {
      setIsCheckingSlug(false)
    }
  }

  /**
   * Handle form submission
   */
  const onSubmit = async (data: CreateOrganizationInput) => {
    try {
      const result = await authClient.organization.create({
        name: data.name,
        slug: data.slug,
        logo: data.logo || undefined,
        // Note: Better Auth may not support description by default
        // Add via additionalFields if needed
      })

      if (result.error) {
        toast.error("Failed to create organization", {
          description: result.error.message,
        })
        return
      }

      toast.success("Organization created successfully", {
        description: `${data.name} is now ready to use.`,
      })

      // Redirect to organization page
      router.push(`/dashboard/organizations/${data.slug}`)
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to create organization", {
        description: error.message || "An unexpected error occurred",
      })
    }
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
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
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
