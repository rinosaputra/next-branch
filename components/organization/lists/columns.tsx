"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Users, MoreHorizontal, Settings, Eye, Crown, Shield } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"

/**
 * Organization type definition
 *
 * Matches Better Auth Organization schema + membership info
 */
export type Organization = {
  id: string
  name: string
  slug: string
  logo: string | null
  memberCount: number
  role: "owner" | "admin" | "editor" | "viewer"
  createdAt: Date
  isActive: boolean
}

/**
 * Organization Table Columns
 *
 * Features:
 * - Selectable rows (checkbox)
 * - Sortable columns (name, role, members, created)
 * - Badge indicators (role, active status)
 * - Row actions (view, settings)
 * - Avatar/logo display
 *
 * Architecture:
 * - Type-safe with TypeScript
 * - Accessible (ARIA labels)
 * - Mobile-responsive (hidden columns on mobile)
 * - Consistent with existing data-table patterns
 *
 * @see https://tanstack.com/table/v8/docs/guide/column-defs
 */
export const columns: ColumnDef<Organization>[] = [
  // Selection column
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
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Organization name (with logo)
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Organization" />
    ),
    cell: ({ row }) => {
      const organization = row.original

      return (
        <div className="flex items-center gap-3">
          {/* Logo/Avatar */}
          {organization.logo ? (
            <img
              src={organization.logo}
              alt={organization.name}
              className="h-8 w-8 rounded object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          {/* Name & Slug */}
          <div className="flex flex-col">
            <Link
              href={`/dashboard/organizations/${organization.slug}`}
              className="font-medium hover:underline"
            >
              {organization.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              @{organization.slug}
            </span>
          </div>

          {/* Active indicator */}
          {organization.isActive && (
            <Badge variant="default" className="ml-2 text-xs">
              Active
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },

  // Your role
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string

      const roleConfig = {
        owner: {
          label: "Owner",
          icon: Crown,
          className: "bg-primary text-primary-foreground",
        },
        admin: {
          label: "Admin",
          icon: Shield,
          className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        },
        editor: {
          label: "Editor",
          icon: null,
          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        },
        viewer: {
          label: "Viewer",
          icon: null,
          className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        },
      }

      const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer
      const Icon = config.icon

      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={config.className}>
            {Icon && <Icon className="mr-1 h-3 w-3" />}
            {config.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  // Member count
  {
    accessorKey: "memberCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Members" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("memberCount") as number

      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="font-medium text-foreground">{count}</span>
        </div>
      )
    },
  },

  // Created date
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date

      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      )
    },
  },

  // Row actions
  {
    id: "actions",
    cell: ({ row }) => {
      const organization = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={`/dashboard/organizations/${organization.slug}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>

            {(organization.role === "owner" || organization.role === "admin") && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/organizations/${organization.slug}/members`}>
                    <Users className="mr-2 h-4 w-4" />
                    Members
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/organizations/${organization.slug}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
