"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

/**
 * Create organization validation schema
 */
const createOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
})

type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>

/**
 * Create Organization Form Component
 *
 * Features:
 * - Name and slug input
 * - Auto-generate slug from name
 * - Slug uniqueness check
 * - Form validation
 * - Loading states
 * - Error handling
 *
 * @example
 * ```tsx
 * <CreateOrganizationForm />
 * ```
 */
export function CreateOrganizationForm() {
  const router = useRouter()
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)

  const form = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  /**
   * Auto-generate slug from name
   */
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  /**
   * Check if slug is available
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
  const onSubmit = async (data: CreateOrganizationFormValues) => {
    try {
      const result = await authClient.organization.create({
        name: data.name,
        slug: data.slug,
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
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Inc"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    // Auto-generate slug
                    const slug = generateSlug(e.target.value)
                    form.setValue("slug", slug)
                  }}
                />
              </FormControl>
              <FormDescription>
                The display name for your organization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug Field */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Slug</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="acme-inc"
                    {...field}
                    onChange={(e) => {
                      const value = generateSlug(e.target.value)
                      field.onChange(value)
                    }}
                    onBlur={() => checkSlugAvailability(field.value)}
                  />
                  {isCheckingSlug && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Used in URLs: /organizations/<strong>{field.value || "slug"}</strong>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
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
