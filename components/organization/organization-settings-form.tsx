"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

/**
 * Update organization validation schema
 */
const updateOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type UpdateOrganizationFormValues = z.infer<typeof updateOrganizationSchema>

interface OrganizationSettingsFormProps {
  organization: {
    id: string
    name: string
    slug: string
    logo?: string | null
  }
}

/**
 * Organization Settings Form Component
 *
 * Features:
 * - Update name, slug, logo
 * - Delete organization (owner only)
 * - Form validation
 * - Loading states
 * - Confirmation dialogs
 *
 * @example
 * ```tsx
 * <OrganizationSettingsForm organization={organization} />
 * ```
 */
export function OrganizationSettingsForm({ organization }: OrganizationSettingsFormProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<UpdateOrganizationFormValues>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo || "",
    },
  })

  /**
   * Handle form submission
   */
  const onSubmit = async (data: UpdateOrganizationFormValues) => {
    try {
      const result = await authClient.organization.update({
        data: {
          name: data.name,
          slug: data.slug,
          logo: data.logo || null,
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
      if (data.slug !== organization.slug) {
        router.push(`/dashboard/organizations/${data.slug}/settings`)
      }

      router.refresh()
    } catch (error: any) {
      toast.error("Failed to update organization", {
        description: error.message || "An unexpected error occurred",
      })
    }
  }

  /**
   * Handle organization deletion
   */
  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await authClient.organization.delete({
        organizationId: organization.id,
      })

      if (result.error) {
        toast.error("Failed to delete organization", {
          description: result.error.message,
        })
        setIsDeleting(false)
        return
      }

      toast.success("Organization deleted successfully")
      router.push("/dashboard/organizations")
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to delete organization", {
        description: error.message || "An unexpected error occurred",
      })
      setIsDeleting(false)
    }
  }

  const hasChanges = form.formState.isDirty

  return (
    <div className="space-y-6">
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
                  <Input placeholder="Acme Inc" {...field} />
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
                  <Input placeholder="acme-inc" {...field} />
                </FormControl>
                <FormDescription>
                  Used in URLs: /organizations/<strong>{field.value || "slug"}</strong>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo Field */}
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A public URL to your organization's logo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !hasChanges}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>

          {!hasChanges && (
            <p className="text-sm text-muted-foreground">
              No changes to save
            </p>
          )}
        </form>
      </Form>

      <Separator />

      {/* Danger Zone */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Irreversible and destructive actions
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Organization"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{organization.name}</strong> and
                all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Organization
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
