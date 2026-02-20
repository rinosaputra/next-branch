"use client"

import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { DataTable } from "@/components/table/data-table"
import { userColumns } from "./columns"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

/**
 * Users data table with TanStack Query integration
 *
 * Features:
 * - Real-time data fetching with Better Auth
 * - Loading skeleton
 * - Error handling
 * - Automatic cache management
 * - Search by name
 * - Filter by role and status
 * - Sorting, pagination, row selection
 *
 * @example
 * ```tsx
 * import { UsersDataTable } from "@/components/rbac/users-data-table"
 *
 * export default function UsersPage() {
 *   return <UsersDataTable />
 * }
 * ```
 */
export function UsersDataTable() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {
          limit: 100,
          offset: 0,
        },
      })
      return result.data
    },
    // Refetch on window focus for real-time updates
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return <UsersTableSkeleton />
  }

  if (error) {
    return <UsersTableError error={error} onRetry={refetch} />
  }

  const users = data?.users || []

  return (
    <DataTable
      columns={userColumns}
      data={users}
      searchKey="name"
      searchPlaceholder="Search users by name..."
      filterableColumns={[
        {
          id: "role",
          title: "Role",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
            { label: "Viewer", value: "viewer" },
          ],
        },
        {
          id: "status",
          title: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Banned", value: "banned" },
          ],
        },
      ]}
    />
  )
}

/**
 * Loading skeleton for users table
 */
function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-62.5" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-25" />
          <Skeleton className="h-8 w-25" />
          <Skeleton className="h-8 w-25" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-2">
        <Skeleton className="h-8 w-50" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-25" />
          <Skeleton className="h-8 w-37.5" />
          <Skeleton className="h-8 w-50" />
        </div>
      </div>
    </div>
  )
}

/**
 * Error state for users table
 */
function UsersTableError({
  error,
  onRetry
}: {
  error: any
  onRetry: () => void
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Failed to Load Users</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-2">
        <p>{error.message || "An error occurred while fetching users."}</p>
        <button
          onClick={onRetry}
          className="mt-2 inline-flex w-fit items-center rounded-md border border-transparent bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive hover:bg-destructive/20"
        >
          Try Again
        </button>
      </AlertDescription>
    </Alert>
  )
}
