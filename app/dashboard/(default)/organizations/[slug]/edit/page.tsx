import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireOrganizationPermission } from "@/lib/auth/rbac-utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditOrganizationForm } from "@/components/organization/form/edit-organization-form"
import { fetchOrganizationBySlug } from "@/services/organization"

interface EditOrganizationPageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Generate metadata
 */
async function generateMetadata({
  params,
}: EditOrganizationPageProps): Promise<Metadata> {
  const resolvedParams = await params
  return {
    title: `Edit - ${resolvedParams.slug} | Organizations`,
    description: "Update organization settings and information",
  }
}

/**
 * Edit Organization Page
 *
 * Server component for organization editing.
 * Requires organization 'update' permission (admin/owner only).
 *
 * Features:
 * - Pre-populated form with existing data
 * - Update name, slug, logo, description
 * - Client-side validation
 * - Auto-redirect after update
 * - Back navigation
 *
 * Architecture:
 * - Server component (authentication + RBAC check)
 * - Client form component (interactivity)
 * - Better Auth integration
 *
 * @route /dashboard/organizations/[slug]/edit
 */
export default async function EditOrganizationPage({
  params,
}: EditOrganizationPageProps) {
  const resolvedParams = await params

  // ✅ Check organization permission (update)
  await requireOrganizationPermission("organization", ["update"])

  // Fetch organization data
  const organization = await fetchOrganizationBySlug(resolvedParams.slug)

  if (!organization) {
    notFound()
  }

  // Check if user has permission to edit (admin/owner)
  if (organization.user?.role !== "orgOwner" && organization.user?.role !== "orgAdmin") {
    redirect(`/dashboard/organizations/${resolvedParams.slug}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/organizations/${resolvedParams.slug}`}>
            <ArrowLeft />
            Back to {organization.name}
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Organization</h1>
        <p className="text-muted-foreground">
          Update {organization.name} settings and information
        </p>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Update your organization's public information and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditOrganizationForm organization={organization} />
        </CardContent>
      </Card>

      {/* Warning Section */}
      <div className="max-w-2xl">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-200">
            ⚠️ Important Note
          </h4>
          <p className="mt-2 text-sm text-yellow-800 dark:text-yellow-300">
            Changing the organization slug will update all URLs associated with this
            organization. Make sure to update any bookmarks or shared links.
          </p>
        </div>
      </div>
    </div>
  )
}
