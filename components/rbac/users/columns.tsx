"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { UserRowActions } from "./user-row-actions"
import { UserWithRole } from "better-auth/plugins"
import { formatDistanceToNow } from "date-fns"
import { RoleBadge } from "./role-badge"

// Type definition (should match your Prisma User model)
export type User = UserWithRole



/**
 * User table column definitions
 *
 * Features:
 * - Row selection (checkboxes)
 * - Sortable columns (name, email, created date)
 * - Filterable columns (role, status)
 * - Role badge with colors
 * - Status badge (active/banned)
 * - RBAC-aware row actions
 *
 * @example
 * ```tsx
 * import { userColumns } from "@/components/rbac/columns"
 *
 * <DataTable columns={userColumns} data={users} />
 * ```
 */
export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all users"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select user"
        className="translate-y-0.5"
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
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const image = row.original.image

      return (
        <div className="flex items-center space-x-2">
          {image && (
            <img
              src={image}
              alt={name}
              className="h-8 w-8 rounded-full"
            />
          )}
          <span className="max-w-50 truncate font-medium">
            {name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      const verified = row.original.emailVerified

      return (
        <div className="flex items-center space-x-2">
          <span className="max-w-45 truncate">{email}</span>
          {verified && (
            <Badge variant="outline" className="ml-2 text-xs">
              Verified
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string | null
      return <RoleBadge role={role} />
    },
    filterFn: (row, id, value) => {
      const role = row.getValue(id) as string | null
      const displayRole = role || "viewer"
      return value.includes(displayRole)
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const banned = row.original.banned
      const banExpires = row.original.banExpires

      if (banned) {
        const isPermanent = !banExpires
        const isExpired = banExpires && new Date(banExpires) < new Date()

        if (isExpired) {
          return <Badge variant="secondary">Ban Expired</Badge>
        }

        return (
          <div className="flex items-center space-x-2">
            <Badge variant="destructive">Banned</Badge>
            {!isPermanent && (
              <span className="text-xs text-muted-foreground">
                Expires {formatDistanceToNow(new Date(banExpires), { addSuffix: true })}
              </span>
            )}
          </div>
        )
      }

      return (
        <Badge variant="default" className="bg-green-600">
          Active
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const banned = row.original.banned
      if (value.includes("active")) return !banned
      if (value.includes("banned")) return !!banned
      return true
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return (
        <div className="flex w-35 items-center">
          <span className="text-sm">{date.toLocaleDateString()}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions row={row} />,
  },
]
