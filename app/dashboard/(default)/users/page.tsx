import { requirePermission } from "@/lib/auth/rbac-utils"
import { UsersDataTable } from "@/components/rbac/users/users-data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PlusCircle, Users } from "lucide-react"
import { RequirePermission } from "@/components/rbac/require-permission"

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
        <RequirePermission resource="user" actions={['create']} fallback={<Button disabled>Loading...</Button>}>
          <CreateUserButton />
        </RequirePermission>
      </div>

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
  return (
    <Button asChild>
      <Link href="/dashboard/users/create">
        <PlusCircle />
        Create User
      </Link>
    </Button>
  )
}
