import { Suspense } from "react"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { requireOrganizationPermission } from "@/lib/auth/rbac-utils"
import { Users, UserPlus } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MemberList } from "@/components/organization/member-list"
import { InviteMemberDialog } from "@/components/organization/invite-member-dialog"
import { PendingInvitations } from "@/components/organization/pending-invitations"

interface MembersPageProps {
  params: Promise<{
    slug: string
  }>
}

export const metadata: Metadata = {
  title: "Members | Organization",
  description: "Manage organization members and invitations",
}

/**
 * Members Management Page
 *
 * Server component for member and invitation management.
 * Requires 'member:read' permission (all members can view).
 *
 * Features:
 * - List all organization members
 * - Invite new members (admin/owner)
 * - Manage pending invitations
 * - Update member roles (admin/owner)
 * - Remove members (admin/owner)
 *
 * Architecture:
 * - Server component with RBAC checks
 * - Tabs for members vs. invitations
 * - Client components for interactive actions
 * - Suspense boundaries for progressive rendering
 *
 * @route /dashboard/organizations/[slug]/members
 */
export default async function MembersPage({ params }: MembersPageProps) {
  // ✅ Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  // ✅ Check organization permission (read members)
  await requireOrganizationPermission("member", ["read"])

  // Fetch organization data
  const organization = await fetchOrganizationBySlug((await params).slug, session.user.id)

  if (!organization) {
    notFound()
  }

  // Check if user can invite members
  const canInviteMembers = await checkPermission("member", ["create"])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage {organization.name} team members and invitations
          </p>
        </div>

        {canInviteMembers && (
          <InviteMemberDialog
            organizationId={organization.id}
            trigger={
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </button>
            }
          />
        )}
      </div>

      {/* Members & Invitations Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            Members
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {organization.memberCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="invitations" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Pending Invitations
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {organization.pendingInvitations}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Members List */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                All members currently in {organization.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<MemberListSkeleton />}>
                <MemberList organizationId={organization.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Invitations */}
        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Invitations waiting to be accepted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<InvitationsSkeleton />}>
                <PendingInvitations organizationId={organization.id} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Member Roles</CardTitle>
          <CardDescription>
            Understanding organization roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Owner</h4>
              <p className="text-sm text-muted-foreground">
                Full control including billing, settings, and deletion
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Admin</h4>
              <p className="text-sm text-muted-foreground">
                Manage members, settings, and organization resources
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Member</h4>
              <p className="text-sm text-muted-foreground">
                Access organization resources and collaborate
              </p>
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
    memberCount: 5,
    pendingInvitations: 2,
  }
}

/**
 * Check permission (client-side would use useOrganizationPermission)
 */
async function checkPermission(resource: string, actions: string[]) {
  // In production: Use Better Auth permission check
  return true
}

/**
 * Loading Skeletons
 */
function MemberListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-9 w-32.5" />
        </div>
      ))}
    </div>
  )
}

function InvitationsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Generate metadata
 */
export async function generateMetadata({
  params,
}: MembersPageProps): Promise<Metadata> {
  return {
    title: `Members - ${(await params).slug} | Organizations`,
    description: "Manage organization members and invitations",
  }
}
