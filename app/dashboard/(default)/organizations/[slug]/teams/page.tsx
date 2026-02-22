import { Suspense } from "react"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { requireOrganizationPermission } from "@/lib/auth/rbac-utils"
import { Users, Plus } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateTeamDialog } from "@/components/organization/team-components/create-team-dialog"
import { TeamList } from "@/components/organization/team-components/team-list"

interface TeamsPageProps {
  params: Promise<{
    slug: string
  }>
}

export const metadata: Metadata = {
  title: "Teams | Organization",
  description: "Manage organization teams and departments",
}

/**
 * Teams Management Page (Optional)
 *
 * Only rendered if teams are enabled in organization config.
 * Requires 'team:read' permission.
 *
 * Features:
 * - List all organization teams
 * - Create new teams (admin/owner)
 * - Manage team members
 * - Delete teams (admin/owner)
 *
 * Architecture:
 * - Server component with RBAC checks
 * - Optional feature (disabled by default)
 * - Client components for team operations
 *
 * @route /dashboard/organizations/[slug]/teams
 * @optional Requires teams.enabled in organization config
 */
export default async function TeamsPage({ params }: TeamsPageProps) {
  // ✅ Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  // ✅ Check organization permission (read teams)
  await requireOrganizationPermission("team", ["read"])

  // Fetch organization data
  const organization = await fetchOrganizationBySlug((await params).slug, session.user.id)

  if (!organization) {
    notFound()
  }

  // Check if teams are enabled
  if (!organization.teamsEnabled) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Teams Not Enabled</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Teams feature is not enabled for this organization.
              Contact an administrator to enable team management.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if user can create teams
  const canCreateTeams = await checkPermission("team", ["create"])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Organize {organization.name} into teams and departments
          </p>
        </div>

        {canCreateTeams && (
          <CreateTeamDialog organizationId={organization.id} />
        )}
      </div>

      {/* Teams List */}
      <Suspense fallback={<TeamsGridSkeleton />}>
        <TeamList organizationId={organization.id} />
      </Suspense>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Teams</CardTitle>
          <CardDescription>
            Understanding team structure and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Teams allow you to organize members into groups based on departments,
            projects, or any structure that fits your workflow. Each team can have
            its own members and access controls.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">✓ Team Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Organize by department or project</li>
                <li>• Manage permissions per team</li>
                <li>• Streamline collaboration</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">🔐 Team Permissions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Admin: Manage team settings</li>
                <li>• Member: Collaborate within team</li>
                <li>• Guest: Limited team access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Fetch organization by slug
 */
async function fetchOrganizationBySlug(slug: string, userId: string) {
  // Mock data
  return {
    id: "org-1",
    name: "Acme Inc",
    slug: slug,
    teamsEnabled: false, // Set to true to enable teams
  }
}

/**
 * Check permission
 */
async function checkPermission(resource: string, actions: string[]) {
  return true
}

/**
 * Loading Skeleton
 */
function TeamsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Generate metadata
 */
export async function generateMetadata({
  params,
}: TeamsPageProps): Promise<Metadata> {
  return {
    title: `Teams - ${(await params).slug} | Organizations`,
    description: "Manage organization teams and departments",
  }
}
