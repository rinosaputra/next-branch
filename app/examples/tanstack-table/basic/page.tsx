"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/table/data-table"
import { generateMockUsers, User } from "@/data/tanstack-table-mock-data"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === "active" ? "default" : status === "inactive" ? "secondary" : "outline"
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      )
    },
  },
]

export default function BasicTableExample() {
  const data = generateMockUsers(20)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Basic Table</h1>
        <p className="text-muted-foreground">
          Simple table with static data and basic column definitions
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <DataTable columns={columns} data={data} />
      </div>

      <div className="mt-6 rounded-lg border border-dashed p-4">
        <h3 className="mb-2 font-semibold">What's included:</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Static data (no API calls)</li>
          <li>Basic column definitions</li>
          <li>Badge components for role and status</li>
          <li>No sorting, filtering, or pagination</li>
        </ul>
      </div>
    </div>
  )
}
