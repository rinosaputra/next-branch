import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { PasswordInput } from '@/components/input/password'
import { Spinner } from '@/components/ui/spinner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ChangePasswordInput, changePasswordSchema } from '@/lib/validations/user'
import { User } from '../columns'
import { useSetUserPassword } from '../../../../hooks/rbac/users'

const SetPasswordDialog: React.FC<{ isOpen: boolean; onClose: () => void, user: User }> = ({ isOpen, onClose, user }) => {
  // Password form
  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const { isPending: loading, mutateAsync } = useSetUserPassword()

  return (
    <Dialog open={isOpen} onOpenChange={loading ? undefined : onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Password</DialogTitle>
          <DialogDescription>
            Set a new password for <strong>{user.name}</strong>. The user will need to use this password to log in.
          </DialogDescription>
        </DialogHeader>

        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(data => {
            toast.promise(mutateAsync({ userId: user.id, newPassword: data.newPassword }), {
              loading: "Setting password...",
              success: () => {
                onClose()
                return "Password set successfully"
              },
              error: (err) => {
                return err.message || "Failed to set password"
              },
              finally: () => {
                passwordForm.reset()
              }
            })
          })} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter new password"
                      {...field}
                      {...field}
                      showStrength
                      showStrengthFeedback
                    />
                  </FormControl>
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
                    <PasswordInput
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
                  onClose()
                  passwordForm.reset()
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Spinner />}
                Set Password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}

export default SetPasswordDialog
