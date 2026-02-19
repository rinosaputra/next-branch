// app/dashboard/users/page.tsx
import { requirePermission } from '@/lib/auth/rbac-utils'
import { UserList } from '@/components/dashboard/user-list'

export default async function UsersPage() {
  // ✅ Server-side permission check
  await requirePermission('user', ['read'])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and their roles
          </p>
        </div>

        <a
          href="/dashboard/users/create"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create User
        </a>
      </div>

      {/* Client component with TanStack Query */}
      <UserList />
    </div>
  )
}
