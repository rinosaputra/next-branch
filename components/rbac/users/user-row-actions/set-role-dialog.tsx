import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from '@/components/ui/spinner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { User } from '../columns'
import { CreateUserInput, createUserSchema, roleSelectOptions } from '@/lib/validations/user'
import { defaultRole, Role } from '@/lib/auth/permissions'
import { useSetUserRole } from '../../../../hooks/rbac/users'

/**
 * Role change validation schema
 */
const roleSchema = createUserSchema.pick({ role: true })

type RoleFormValues = Pick<CreateUserInput, "role">

const SetRoleDialog: React.FC<{ isOpen: boolean; onClose: () => void, user: User }> = ({ isOpen, onClose, user }) => {
  // Role form
  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: (user.role as Role) || defaultRole,
    },
  })

  const { isPending: loading, mutateAsync } = useSetUserRole()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Change the role for <strong>{user.name}</strong>. This will immediately affect their permissions.
          </DialogDescription>
        </DialogHeader>

        <Form {...roleForm}>
          <form onSubmit={roleForm.handleSubmit(() => {
            toast.promise(mutateAsync({ userId: user.id, role: roleForm.getValues().role }), {
              loading: "Changing role...",
              success: () => {
                onClose()
                return "Role changed successfully"
              },
              error: (err) => {
                return err.message || "Failed to change role"
              },
              finally: () => {
                roleForm.reset()
              }
            })
          })} className="space-y-4">
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
                      {roleSelectOptions.map((role) => (
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
                  onClose()
                  roleForm.reset()
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Spinner />}
                Change Role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default SetRoleDialog
