import Link from "next/link"
import { Building2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import OrganizationsDataTable from "@/components/organization/lists/organization-data-table"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Organizations | Dashboard",
  description: "Manage your organizations and workspaces",
}
)
/**
 * Organizations Page (Server Component)
 *
 * Features:
 * - Server-side data fetching (Better Auth API)
 * - Reusable DataTable component
 * - Client-side interactivity (sorting, filtering)
 * - Suspense boundaries (progressive rendering)
 * - Create organization action
 *
 * Architecture:
 * - Server component for data fetching
 * - Reuses existing data-table component
 * - Type-safe with Better Auth types
 * - Consistent with dashboard-foundation patterns
 *
 * @route /dashboard/organizations
 */
export default async function OrganizationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your organizations and workspaces
          </p>
        </div>

        {/* Create Organization Button */}
        <Button asChild>
          <Link href="/dashboard/organizations/create">
            <Plus />
            Create Organization
          </Link>
        </Button>
      </div>

      {/* Organizations Table */}
      <OrganizationsDataTable />
    </div>
  )
}


