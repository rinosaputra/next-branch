import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Plus, Building2, Users, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Organizations | Dashboard",
  description: "Manage your organizations and workspaces",
})

/**
 * Organizations List Page
 *
 * Server component that displays all user's organizations.
 * No RBAC protection needed (shows only user's own orgs).
 *
 * Features:
 * - List all user's organizations
 * - Create new organization
 * - Quick navigation to org settings/members
 * - Active organization indicator
 *
 * Architecture:
 * - Server component (data fetching at request time)
 * - Suspense boundaries for progressive rendering
 * - Error boundaries for fault tolerance
 *
 * @route /dashboard/organizations
 */
export default async function OrganizationsPage() {
  // ✅ Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your workspaces and collaborate with teams
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/organizations/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Link>
        </Button>
      </div>

      {/* Organizations Grid */}
      <Suspense fallback={<OrganizationsGridSkeleton />}>
        <OrganizationsGrid userId={session.user.id} />
      </Suspense>
    </div>
  )
}

/**
 * Organizations Grid Component
 *
 * Async component that fetches and displays organizations.
 * Separated for Suspense boundary optimization.
 */
async function OrganizationsGrid({ userId }: { userId: string }) {
  // Fetch user's organizations
  // In production: Use Better Auth Organization API
  const organizations = await fetchUserOrganizations(userId)

  if (organizations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No organizations yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first organization to get started
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/organizations/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {organizations.map((org) => (
        <Card key={org.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Organization Logo/Avatar */}
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="h-10 w-10 rounded"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                )}

                <div>
                  <CardTitle className="text-lg">{org.name}</CardTitle>
                  <CardDescription>@{org.slug}</CardDescription>
                </div>
              </div>

              {/* Active Badge */}
              {org.isActive && (
                <Badge variant="default">Active</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Organization Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{org.memberCount} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline">{org.role}</Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button asChild variant="default" className="flex-1">
                <Link href={`/dashboard/organizations/${org.slug}`}>
                  View Details
                </Link>
              </Button>

              <Button asChild variant="outline" size="icon">
                <Link href={`/dashboard/organizations/${org.slug}/settings`}>
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Fetch user's organizations
 *
 * In production: Replace with Better Auth API call
 */
async function fetchUserOrganizations(userId: string) {
  // Mock data for demonstration
  // In production: Use authClient.organization.list()
  return [
    {
      id: "org-1",
      name: "Acme Inc",
      slug: "acme-inc",
      logo: null,
      role: "owner",
      memberCount: 5,
      isActive: true,
    },
    {
      id: "org-2",
      name: "Beta Corp",
      slug: "beta-corp",
      logo: null,
      role: "admin",
      memberCount: 12,
      isActive: false,
    },
  ]
}

/**
 * Loading Skeleton
 */
function OrganizationsGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-9" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
