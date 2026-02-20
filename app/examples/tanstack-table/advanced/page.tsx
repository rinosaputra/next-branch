"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/table/data-table"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { DataTableRowActions } from "@/components/table/data-table-row-actions"
import { generateMockUsers, User } from "@/data/tanstack-table-mock-data"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
  {
    accessorKey: "lastActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Active" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastActive"))
      const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
      return (
        <span className="text-muted-foreground">
          {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onView={(user) => {
          toast.info(`Viewing user: ${user.name}`)
        }}
        onEdit={(user) => {
          toast.success(`Editing user: ${user.name}`)
        }}
        onDelete={(user) => {
          toast.error(`Deleting user: ${user.name}`)
        }}
        customActions={[
          {
            label: "Reset Password",
            onClick: (user) => {
              toast.info(`Reset password for: ${user.name}`)
            },
          },
          {
            label: "Send Email",
            onClick: (user) => {
              toast.info(`Sending email to: ${user.email}`)
            },
          },
        ]}
      />
    ),
  },
]

export default function AdvancedExample() {
  const data = generateMockUsers(100)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Advanced Table</h1>
        <p className="text-muted-foreground">
          All features combined: sorting, filtering, pagination, row selection, and row actions
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search users..."
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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-dashed p-4">
          <h3 className="mb-2 font-semibold">Sorting:</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Click column headers to sort</li>
            <li>Multi-column sorting support</li>
            <li>Visual indicators (↑ ↓)</li>
          </ul>
        </div>

        <div className="rounded-lg border border-dashed p-4">
          <h3 className="mb-2 font-semibold">Filtering:</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Global search by name</li>
            <li>Faceted filters (role, status, dept)</li>
            <li>Multi-select support</li>
          </ul>
        </div>

        <div className="rounded-lg border border-dashed p-4">
          <h3 className="mb-2 font-semibold">Row Selection:</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Select individual rows</li>
            <li>Select all rows on page</li>
            <li>Selected count display</li>
          </ul>
        </div>

        <div className="rounded-lg border border-dashed p-4">
          <h3 className="mb-2 font-semibold">Row Actions:</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>View/Edit/Delete actions</li>
            <li>Custom actions (Reset password, Send email)</li>
            <li>Toast notifications on action</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-primary/50 bg-primary/5 p-4">
        <h3 className="mb-2 font-semibold text-primary">Production Integration:</h3>
        <p className="text-sm text-muted-foreground">
          To use this in production:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Replace mock data with TanStack Query hooks</li>
          <li>Add RBAC permission checks for row actions</li>
          <li>Implement server-side pagination for large datasets</li>
          <li>Add confirmation dialogs for destructive actions</li>
          <li>Connect to real API endpoints</li>
        </ul>
      </div>
    </div>
  )
}
