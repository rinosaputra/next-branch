"use client"

import { useState } from "react"
import { Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  Ban,
  CheckCircle,
  Key,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

import { usePermission } from "@/hooks/use-permission"
import { User } from "../columns"
import { useRevalidateUsers } from "../../../../hooks/rbac/users"
import SetPasswordDialog from "./set-password-dialog"
import SetRoleDialog from "./set-role-dialog"
import DeleteConfirmationDialog from "./delete-confirmation-dialog"
import ToggleBanConfirmationDialog from "./toggle-ban-confirmation-dialog"

interface UserRowActionsProps {
  row: Row<User>
}

/**
 * RBAC-aware row actions for user table
 *
 * Features:
 * - Permission-based action visibility
 * - Confirmation dialogs for destructive actions
 * - Set password dialog with validation
 * - Set role dialog with select
 * - Toast notifications
 * - Optimistic updates
 * - Error handling
 *
 * Actions:
 * - View user (always visible if read permission)
 * - Edit user (requires user.update)
 * - Change role (requires user.set-role) → Dialog
 * - Set password (requires user.set-password) → Dialog
 * - Ban/Unban user (requires user.ban)
 * - Send email (requires user.update)
 * - Delete user (requires user.delete)
 */
export function UserRowActions({ row }: UserRowActionsProps) {
  const router = useRouter()
  const revalidate = useRevalidateUsers()
  const user = row.original

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)

  // Client-side permission checks
  const { hasPermission: canUpdate } = usePermission("user", ["update"])
  const { hasPermission: canDelete } = usePermission("user", ["delete"])
  const { hasPermission: canBan } = usePermission("user", ["ban"])
  const { hasPermission: canSetRole } = usePermission("user", ["set-role"])
  const { hasPermission: canSetPassword } = usePermission("user", ["set-password"])

  /**
   * Handle view user
   */
  const handleView = () => {
    router.push(`/dashboard/users/${user.id}`)
  }

  /**
   * Handle edit user
   */
  const handleEdit = () => {
    if (!canUpdate) {
      toast.error("You don't have permission to edit users")
      return
    }
    router.push(`/dashboard/users/${user.id}/edit`)
  }

  /**
   * Handle send email
   */
  const handleSendEmail = () => {
    if (!canUpdate) {
      toast.error("You don't have permission to send emails")
      return
    }

    toast.info(`Composing email to: ${user.email}`)
    // In production: Open email compose dialog or trigger email
  }

  return (
    <>
      {/* Dropdown Menu */}
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
        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* View - Always visible */}
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          {/* Edit - Requires update permission */}
          {canUpdate && (
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Change Role - Requires set-role permission */}
          {canSetRole && (
            <DropdownMenuItem onClick={() => setRoleDialogOpen(true)}>
              <Shield className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
          )}

          {/* Set Password - Requires set-password permission */}
          {canSetPassword && (
            <DropdownMenuItem onClick={() => setPasswordDialogOpen(true)}>
              <Key className="mr-2 h-4 w-4" />
              Set Password
            </DropdownMenuItem>
          )}

          {/* Ban/Unban - Requires ban permission */}
          {canBan && (
            <DropdownMenuItem onClick={() => setBanDialogOpen(true)}>
              {user.banned ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Unban User
                </>
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Ban User
                </>
              )}
            </DropdownMenuItem>
          )}

          {/* Additional actions - Requires update permission */}
          {canUpdate && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSendEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
            </>
          )}

          {/* Delete - Requires delete permission */}
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Set Password Dialog */}
      {canSetPassword && <SetPasswordDialog
        isOpen={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        user={user}
      />}

      {/* Set Role Dialog */}
      {canSetRole && <SetRoleDialog
        isOpen={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        user={user}
      />}

      {/* Delete Confirmation Dialog */}
      {canDelete && <DeleteConfirmationDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        user={user}
      />}

      {/* Ban/Unban Confirmation Dialog */}
      {canBan && <ToggleBanConfirmationDialog
        open={banDialogOpen}
        onClose={() => setBanDialogOpen(false)}
        user={user}
      />}
    </>
  )
}
