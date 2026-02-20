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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const dept = row.getValue("department") as string
      return <span className="capitalize">{dept}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]

export default function FilteringExample() {
  const data = generateMockUsers(50)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Filtering</h1>
        <p className="text-muted-foreground">
          Search globally or filter by specific columns using faceted filters
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search by name..."
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
                { label: "Inactive", value: "inactive" },
                { label: "Pending", value: "pending" },
              ],
            },
            {
              id: "department",
              title: "Department",
              options: [
                { label: "Engineering", value: "engineering" },
                { label: "Design", value: "design" },
                { label: "Marketing", value: "marketing" },
                { label: "Sales", value: "sales" },
                { label: "Support", value: "support" },
              ],
            },
          ]}
        />
      </div>

      <div className="mt-6 rounded-lg border border-dashed p-4">
        <h3 className="mb-2 font-semibold">Features:</h3>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Global search input filters by name</li>
          <li>Faceted filters for role, status, and department</li>
          <li>Multi-select filters (select multiple values)</li>
          <li>Selected filters shown as badges</li>
          <li>Filter count displayed in dropdown</li>
          <li>Reset button clears all active filters</li>
        </ul>
      </div>
    </div>
  )
}
