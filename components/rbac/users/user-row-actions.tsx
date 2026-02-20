"use client"

import { Row } from "@tanstack/react-table"
import { DataTableRowActions } from "@/components/table/data-table-row-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { User } from "./columns"

interface UserRowActionsProps {
  row: Row<User>
}

export function UserRowActions({ row }: UserRowActionsProps) {
  const router = useRouter()
  const user = row.original

  return (
    <DataTableRowActions
      row={row}
      onView={(user) => {
        toast.info(`Viewing user: ${user.name}`)
        // In production, navigate to user detail page
        // router.push(`/dashboard/users/${user.id}`)
      }}
      onEdit={(user) => {
        toast.info(`Editing user: ${user.name}`)
        // In production, navigate to edit page
        // router.push(`/dashboard/users/${user.id}/edit`)
      }}
      onDelete={async (user) => {
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
          return
        }

        try {
          // Call delete API
          // await authClient.admin.removeUser({ userId: user.id })
          toast.success(`User ${user.name} deleted successfully`)
          router.refresh()
        } catch (error) {
          toast.error(`Failed to delete user: ${(error as Error).message}`)
        }
      }}
      customActions={[
        {
          label: "Change Role",
          onClick: (user) => {
            toast.info(`Change role for: ${user.name}`)
            // In production, open role change dialog
          },
        },
        {
          label: user.banned ? "Unban User" : "Ban User",
          onClick: async (user) => {
            try {
              if (user.banned) {
                // await authClient.admin.unbanUser({ userId: user.id })
                toast.success(`User ${user.name} unbanned`)
              } else {
                // await authClient.admin.banUser({ userId: user.id })
                toast.success(`User ${user.name} banned`)
              }
              router.refresh()
            } catch (error) {
              toast.error(`Action failed: ${(error as Error).message}`)
            }
          },
          variant: user.banned ? undefined : "destructive",
        },
      ]}
    />
  )
}
