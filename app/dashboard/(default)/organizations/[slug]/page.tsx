import { Suspense } from "react"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Building2, Users, Settings, UserPlus, Calendar } from "lucide-react"

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

/**
 * Generate metadata
 */
export async function generateMetadata({
  params,
}: OrganizationPageProps): Promise<Metadata> {
  // In production: Fetch org name
  return {
    title: `${(await params).slug} | Organizations`,
    description: "Organization overview and management",
  }
}

interface OrganizationPageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Organization Overview Page
 *
 * Displays organization details, stats, and quick actions.
 * Checks user membership before rendering.
 *
 * Features:
 * - Organization information
 * - Member stats
 * - Recent activity
 * - Quick action links
 *
 * @route /dashboard/organizations/[slug]
 */
export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  // ✅ Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <Suspense fallback={<OrganizationOverviewSkeleton />}>
        <OrganizationOverview slug={(await params).slug} userId={session.user.id} />
      </Suspense>
    </div>
  )
}

/**
 * Organization Overview Component
 */
async function OrganizationOverview({
  slug,
  userId,
}: {
  slug: string
  userId: string
}) {
  // Fetch organization data
  const organization = await fetchOrganizationBySlug(slug, userId)

  if (!organization) {
    notFound()
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {organization.logo ? (
            <img
              src={organization.logo}
              alt={organization.name}
              className="h-16 w-16 rounded-lg"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {organization.name}
            </h1>
            <p className="text-muted-foreground">@{organization.slug}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/organizations/${slug}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>

          <Button asChild>
            <Link href={`/dashboard/organizations/${slug}/members`}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Members
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization.memberCount}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <Badge variant="outline">{organization.role}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {organization.role}
            </div>
            <p className="text-xs text-muted-foreground">
              Member since {new Date(organization.joinedAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(organization.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.floor((Date.now() - new Date(organization.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href={`/dashboard/organizations/${slug}/members`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Members
              </CardTitle>
              <CardDescription>
                Manage team members and invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {organization.memberCount} members • {organization.pendingInvitations} pending
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href={`/dashboard/organizations/${slug}/settings`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
              <CardDescription>
                Configure organization preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Name, logo, and general settings
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </>
  )
}

/**
 * Fetch organization by slug
 */
async function fetchOrganizationBySlug(slug: string, userId: string) {
  // Mock data
  // In production: Use Better Auth API
  return {
    id: "org-1",
    name: "Acme Inc",
    slug: slug,
    logo: null,
    role: "owner",
    memberCount: 5,
    pendingInvitations: 2,
    createdAt: new Date("2024-01-15"),
    joinedAt: new Date("2024-01-15"),
  }
}

/**
 * Loading Skeleton
 */
function OrganizationOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
