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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
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

export default function SortingExample() {
  const data = generateMockUsers(30)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sorting</h1>
        <p className="text-muted-foreground">
          Click column headers to sort. Click again to reverse. Click third time to clear.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <DataTable columns={columns} data={data} />
      </div>

      <div className="mt-6 rounded-lg border border-dashed p-4">
        <h3 className="mb-2 font-semibold">Features:</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Click column header to sort ascending (A→Z, 0→9)</li>
          <li>Click again to sort descending (Z→A, 9→0)</li>
          <li>Click third time to clear sort</li>
          <li>Visual indicators show current sort state (↑ ↓)</li>
          <li>Dropdown menu for sort options and column visibility</li>
        </ul>
      </div>
    </div>
  )
}
