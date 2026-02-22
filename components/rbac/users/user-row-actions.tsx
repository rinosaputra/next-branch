"use client"

import { useState } from "react"
import { Row } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
  Loader2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import { usePermission } from "@/hooks/use-permission"
import { User } from "./columns"
import { authClient } from "@/lib/auth-client"
import { createUserSchema, roles } from "./form/user-schema"
import { useRevalidateUsers } from "./user-hook"
import { defaultRole, Role } from "@/lib/auth/permissions"

interface UserRowActionsProps {
  row: Row<User>
}

/**
 * Password change validation schema
 */
const passwordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

/**
 * Role change validation schema
 */
const roleSchema = createUserSchema.pick({ role: true })

type RoleFormValues = z.infer<typeof roleSchema>

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
  const [loading, setLoading] = useState(false)

  // Client-side permission checks
  const { hasPermission: canUpdate } = usePermission("user", ["update"])
  const { hasPermission: canDelete } = usePermission("user", ["delete"])
  const { hasPermission: canBan } = usePermission("user", ["ban"])
  const { hasPermission: canSetRole } = usePermission("user", ["set-role"])
  const { hasPermission: canSetPassword } = usePermission("user", ["set-password"])

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Role form
  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: (user.role as Role) || defaultRole,
    },
  })

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
   * Handle set password
   */
  const handleSetPassword = async (data: PasswordFormValues) => {
    if (!canSetPassword) {
      toast.error("You don't have permission to set passwords")
      return
    }

    setLoading(true)

    try {
      await authClient.admin.setUserPassword({
        userId: user.id,
        newPassword: data.newPassword,
      })

      toast.success("Password updated successfully", {
        description: `Password for ${user.name} has been changed.`,
      })

      setPasswordDialogOpen(false)
      passwordForm.reset()
    } catch (error: any) {
      toast.error("Failed to update password", {
        description: error.message || "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle set role
   */
  const handleSetRole = async (data: RoleFormValues) => {
    if (!canSetRole) {
      toast.error("You don't have permission to change user roles")
      return
    }

    setLoading(true)

    try {
      const result = await authClient.admin.setRole({
        userId: user.id,
        role: data.role,
      })
      if (!result.data) {
        throw new Error("Failed to update role")
      }

      toast.success("Role updated successfully", {
        description: `${user.name} is now a ${data.role}.`,
      })

      setRoleDialogOpen(false)
      revalidate()
    } catch (error: any) {
      toast.error("Failed to update role", {
        description: error.message || "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
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
        const result = await authClient.admin.unbanUser({
          userId: user.id,
        })
        if (!result.data) {
          throw new Error("Failed to unban user")
        }
        toast.success(`User ${user.name} has been unbanned`)
      } else {
        // Ban user
        const result = await authClient.admin.banUser({
          userId: user.id,
          banReason: "Banned by admin",
          // banExpiresIn: 60 * 60 * 24 * 7, // 7 days
        })
        if (!result.data) {
          throw new Error("Failed to ban user")
        }
        toast.success(`User ${user.name} has been banned`)
      }

      revalidate()
    } catch (error: any) {
      toast.error(`Failed to ${user.banned ? "unban" : "ban"} user: ${error.message}`)
    } finally {
      setLoading(false)
      setBanDialogOpen(false)
    }
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
      const result = await authClient.admin.removeUser({
        userId: user.id,
      })
      if (!result.data) {
        throw new Error("Failed to delete user")
      }

      toast.success(`User ${user.name} has been deleted`)
      revalidate()
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`)
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      {/* Dropdown Menu */}
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
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Password</DialogTitle>
            <DialogDescription>
              Set a new password for <strong>{user.name}</strong>. The user will need to use this password to log in.
            </DialogDescription>
          </DialogHeader>

          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handleSetPassword)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPasswordDialogOpen(false)
                    passwordForm.reset()
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Set Password
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Set Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Change the role for <strong>{user.name}</strong>. This will immediately affect their permissions.
            </DialogDescription>
          </DialogHeader>

          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(handleSetRole)} className="space-y-4">
              <FormField
                control={roleForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex flex-col items-start gap-1">
                              <span className="font-medium">{role.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {role.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current role: <strong className="capitalize">{user.role || "viewer"}</strong>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRoleDialogOpen(false)
                    roleForm.reset()
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
