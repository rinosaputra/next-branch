import { Suspense } from "react"
import { requirePermission } from "@/lib/auth/rbac-utils"
import { UsersDataTable } from "@/components/rbac/users/users-data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PlusCircle, Users, Shield, UserCheck, UserX } from "lucide-react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

/**
 * User Management Page
 *
 * Server component with RBAC protection.
 * Requires user.read permission.
 *
 * Features:
 * - Real-time user list with TanStack Table
 * - Search, filter, sort, pagination
 * - RBAC-aware row actions
 * - User statistics cards
 * - Create user button (permission-gated)
 */
export default async function UsersPage() {
  // ✅ Server-side RBAC check
  await requirePermission("user", ["read"])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>

        {/* Create User Button - Permission Gated */}
        <Suspense fallback={<Button disabled>Loading...</Button>}>
          <CreateUserButton />
        </Suspense>
      </div>

      {/* Statistics Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <UserStatsCards />
      </Suspense>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all system users with advanced filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersDataTable />
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Create User Button with Permission Check
 */
async function CreateUserButton() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Check if user has create permission
  const hasCreatePermission = session?.user?.role === "admin"

  if (!hasCreatePermission) {
    return null
  }

  return (
    <Button asChild>
      <Link href="/dashboard/users/create">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create User
      </Link>
    </Button>
  )
}

/**
 * User Statistics Cards
 */
async function UserStatsCards() {
  // In production: Fetch real stats from API
  // const stats = await fetchUserStats()

  // Mock data for demonstration
  const stats = {
    total: 0,
    active: 0,
    banned: 0,
    admins: 0,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            All registered users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active}</div>
          <p className="text-xs text-muted-foreground">
            Can access the system
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.banned}</div>
          <p className="text-xs text-muted-foreground">
            Access restricted
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.admins}</div>
          <p className="text-xs text-muted-foreground">
            Full system access
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Skeleton for stats cards
 */
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-32 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
