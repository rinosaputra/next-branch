"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/table/data-table"
import { columns } from "@/components/organization/lists/columns"
import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useOrganizationList } from "./organization-hook"

// Role filter options for toolbar
const roleFilterOptions = [
  {
    label: "Owner",
    value: "owner",
    icon: Building2,
  },
  {
    label: "Admin",
    value: "admin",
    icon: Building2,
  },
  {
    label: "Editor",
    value: "editor",
    icon: Building2,
  },
  {
    label: "Viewer",
    value: "viewer",
    icon: Building2,
  },
]

/**
 * Organizations Table (Async Component)
 *
 * Fetches organizations data and renders DataTable.
 * Separated for Suspense boundary optimization.
 */
export default function OrganizationsDataTable() {

  // Fetch user's organizations
  const { query: { data: organizations = [], isLoading } } = useOrganizationList()

  // Loading state
  if (isLoading) {
    return <DataTableSkeleton />
  }

  // Empty state
  if (organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <Building2 className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No organizations yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mt-2">
          Create your first organization to collaborate with your team
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/organizations/create">
            <Plus />
            Create Organization
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={organizations}
      searchKey="name"
      searchPlaceholder="Search organizations..."
      filterableColumns={[
        {
          id: "role",
          title: "Role",
          options: roleFilterOptions,
        },
      ]}
    />
  )
}

/**
 * Loading Skeleton
 *
 * Matches DataTable structure for smooth loading experience
 */
function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-10 w-62.5" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-25" />
          <Skeleton className="h-10 w-17.5" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>

          {/* Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b last:border-0">
              <Skeleton className="h-4 w-4" />
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-50" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-25" />
          <Skeleton className="h-8 w-17.5" />
        </div>
      </div>
    </div>
  )
}
