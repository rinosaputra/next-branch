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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { usePermission } from "@/hooks/use-permission"
import { User } from "./columns"
import { authClient } from "@/lib/auth-client"

interface UserRowActionsProps {
  row: Row<User>
}

/**
 * RBAC-aware row actions for user table
 *
 * Features:
 * - Permission-based action visibility
 * - Confirmation dialogs for destructive actions
 * - Toast notifications
 * - Optimistic updates
 * - Error handling
 *
 * Actions:
 * - View user (always visible if read permission)
 * - Edit user (requires user.update)
 * - Change role (requires user.set-role)
 * - Ban/Unban user (requires user.ban)
 * - Reset password (requires user.update)
 * - Send email (requires user.update)
 * - Delete user (requires user.delete)
 *
 * @example
 * ```tsx
 * <UserRowActions row={row} />
 * ```
 */
export function UserRowActions({ row }: UserRowActionsProps) {
  const router = useRouter()
  const user = row.original

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // ✅ Client-side permission checks
  const { hasPermission: canUpdate } = usePermission("user", ["update"])
  const { hasPermission: canDelete } = usePermission("user", ["delete"])
  const { hasPermission: canBan } = usePermission("user", ["ban"])
  const { hasPermission: canSetRole } = usePermission("user", ["set-role"])

  /**
   * Handle view user
   */
  const handleView = () => {
    toast.info(`Viewing user: ${user.name}`)
    // In production: router.push(`/dashboard/users/${user.id}`)
  }

  /**
   * Handle edit user
   */
  const handleEdit = () => {
    if (!canUpdate) {
      toast.error("You don't have permission to edit users")
      return
    }

    toast.info(`Editing user: ${user.name}`)
    // In production: router.push(`/dashboard/users/${user.id}/edit`)
  }

  /**
   * Handle change role
   */
  const handleChangeRole = () => {
    if (!canSetRole) {
      toast.error("You don't have permission to change user roles")
      return
    }

    toast.info(`Change role for: ${user.name}`)
    // In production: Open role change dialog/modal
  }

  /**
   * Handle ban/unban user
   */
  const handleBanToggle = async () => {
    if (!canBan) {
      toast.error("You don't have permission to ban users")
      return
    }

    setLoading(true)

    try {
      if (user.banned) {
        // Unban user
        await authClient.admin.unbanUser({
          userId: user.id,
        })
        toast.success(`User ${user.name} has been unbanned`)
      } else {
        // Ban user
        await authClient.admin.banUser({
          userId: user.id,
          banReason: "Banned by admin",
          // banExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        })
        toast.success(`User ${user.name} has been banned`)
      }

      router.refresh()
    } catch (error: any) {
      toast.error(`Failed to ${user.banned ? "unban" : "ban"} user: ${error.message}`)
    } finally {
      setLoading(false)
      setBanDialogOpen(false)
    }
  }

  /**
   * Handle reset password
   */
  const handleResetPassword = () => {
    if (!canUpdate) {
      toast.error("You don't have permission to reset passwords")
      return
    }

    toast.info(`Reset password for: ${user.name}`)
    // In production: Send password reset email or generate temporary password
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
    // In production: Open email compose dialog
  }

  /**
   * Handle delete user
   */
  const handleDelete = async () => {
    if (!canDelete) {
      toast.error("You don't have permission to delete users")
      return
    }

    setLoading(true)

    try {
      await authClient.admin.removeUser({
        userId: user.id,
      })

      toast.success(`User ${user.name} has been deleted`)
      router.refresh()
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`)
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            disabled={loading}
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
            <DropdownMenuItem onClick={handleChangeRole}>
              <Shield className="mr-2 h-4 w-4" />
              Change Role
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
              <DropdownMenuItem onClick={handleResetPassword}>
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user <strong>{user.name}</strong> ({user.email}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban/Unban Confirmation Dialog */}
      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.banned ? "Unban User" : "Ban User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.banned ? (
                <>
                  This will restore access for <strong>{user.name}</strong> ({user.email}).
                  They will be able to log in again.
                </>
              ) : (
                <>
                  This will prevent <strong>{user.name}</strong> ({user.email}) from
                  logging in. You can unban them later if needed.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanToggle}
              disabled={loading}
            >
              {loading ? "Processing..." : user.banned ? "Unban User" : "Ban User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
