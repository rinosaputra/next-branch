"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/table/data-table"
import { columns } from "@/components/organization/lists/columns"
import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useOrganizationList } from "../../../hooks/organization"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

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
 * Organizations Data Table
 *
 * Displays a list of organizations the user belongs to, with role-based filtering and search
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
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>No organizations</EmptyTitle>
          <EmptyDescription>You don't belong to any organizations yet.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/dashboard/organizations/create">
            <Plus />
            Create Organization
          </Link>
        </EmptyContent>
      </Empty>
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
