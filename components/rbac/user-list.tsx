// components/dashboard/user-list.tsx
"use client"

import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { RequirePermission } from '@/components/rbac/require-permission'

export function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: { limit: 50, offset: 0 }
      })
      return result.data
    }
  })

  if (isLoading) {
    return <div>Loading users...</div>
  }

  if (error) {
    return <div>Error loading users</div>
  }

  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.users.map((user: any) => (
            <tr key={user.id} className="border-b">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                <span className="rounded bg-blue-100 px-2 py-1 text-xs">
                  {user.role || 'viewer'}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <RequirePermission resource="user" actions={["update"]}>
                    <button className="text-blue-600 hover:underline text-sm">
                      Edit
                    </button>
                  </RequirePermission>

                  <RequirePermission resource="user" actions={["delete"]}>
                    <button className="text-red-600 hover:underline text-sm">
                      Delete
                    </button>
                  </RequirePermission>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 text-sm text-muted-foreground">
        Total: {data?.total} users
      </div>
    </div>
  )
}
