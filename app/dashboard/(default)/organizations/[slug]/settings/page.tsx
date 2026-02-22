import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { requireOrganizationPermission } from "@/lib/auth/rbac-utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OrganizationSettingsForm } from "@/components/organization/organization-settings-form"
import { Separator } from "@/components/ui/separator"

interface OrganizationSettingsPageProps {
  params: {
    slug: string
  }
}

export const metadata: Metadata = {
  title: "Organization Settings | Dashboard",
  description: "Manage organization settings and preferences",
}

/**
 * Organization Settings Page
 *
 * Server component for organization configuration.
 * Requires organization 'update' permission (admin/owner only).
 *
 * Features:
 * - Update organization name, slug, logo
 * - Delete organization (owner only)
 * - Organization metadata
 * - Danger zone actions
 *
 * Architecture:
 * - Server component with permission checks
 * - Form components for update actions
 * - Confirmation dialogs for destructive actions
 *
 * @route /dashboard/organizations/[slug]/settings
 */
export default async function OrganizationSettingsPage({
  params,
}: OrganizationSettingsPageProps) {
  // ✅ Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  // ✅ Check organization permission (update)
  await requireOrganizationPermission("organization", ["update"])

  // Fetch organization data
  const organization = await fetchOrganizationBySlug(params.slug, session.user.id)

  if (!organization) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground">
          Manage {organization.name} settings and preferences
        </p>
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Update your organization's public information and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationSettingsForm organization={organization} />
        </CardContent>
      </Card>

      {/* Additional Settings Sections (Future) */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            View organization metadata and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Organization ID</span>
              <code className="col-span-2 rounded bg-muted px-2 py-1 text-sm">
                {organization.id}
              </code>
            </div>

            <Separator />

            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Created</span>
              <span className="col-span-2 text-sm text-muted-foreground">
                {new Date(organization.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <Separator />

            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium">Members</span>
              <span className="col-span-2 text-sm text-muted-foreground">
                {organization.memberCount} active members
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Section (Future) */}
      {organization.role === 'owner' && (
        <Card>
          <CardHeader>
            <CardTitle>Billing & Subscription</CardTitle>
            <CardDescription>
              Manage your organization's billing and subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Billing management coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * Fetch organization by slug
 *
 * In production: Use Better Auth Organization API
 */
async function fetchOrganizationBySlug(slug: string, userId: string) {
  // Mock data for demonstration
  // In production: await authClient.organization.getFullOrganization({ organizationSlug: slug })
  return {
    id: "org-1",
    name: "Acme Inc",
    slug: slug,
    logo: null,
    role: "owner",
    memberCount: 5,
    createdAt: new Date("2024-01-15"),
  }
}

/**
 * Generate metadata
 */
export async function generateMetadata({
  params,
}: OrganizationSettingsPageProps): Promise<Metadata> {
  return {
    title: `Settings - ${params.slug} | Organizations`,
    description: "Manage organization settings and preferences",
  }
}
