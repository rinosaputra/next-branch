"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/table/data-table"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { generateMockUsers, User } from "@/data/tanstack-table-mock-data"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const dept = row.getValue("department") as string
      return <span className="capitalize">{dept}</span>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
]

export default function PaginationExample() {
  const data = generateMockUsers(100)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pagination</h1>
        <p className="text-muted-foreground">
          Navigate through {data.length} rows with configurable page sizes
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <DataTable columns={columns} data={data} />
      </div>

      <div className="mt-6 rounded-lg border border-dashed p-4">
        <h3 className="mb-2 font-semibold">Features:</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Page size selector (10, 20, 30, 40, 50 rows per page)</li>
          <li>First/Previous/Next/Last navigation buttons</li>
          <li>Current page and total page count display</li>
          <li>Disabled state for navigation at boundaries</li>
          <li>Client-side pagination (suitable for up to ~10,000 rows)</li>
          <li>For larger datasets, use server-side pagination with TanStack Query</li>
        </ul>
      </div>
    </div>
  )
}
