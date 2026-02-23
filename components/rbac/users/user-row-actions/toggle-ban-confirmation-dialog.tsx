import React from 'react'
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
import { User } from '../columns';
import { useToggleUserBan } from '../../../../hooks/rbac/users';
import { toast } from 'sonner';

const ToggleBanConfirmationDialog: React.FC<{ open: boolean; onClose: () => void, user: User }> = ({ open, onClose, user }) => {
  const { isPending: loading, mutateAsync } = useToggleUserBan() // Implement useToggleUserBan hook
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
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
            onClick={() => {
              toast.promise(mutateAsync({
                userId: user.id,
                ban: !user.banned
              }), {
                loading: user.banned ? "Unbanning user..." : "Banning user...",
                success: () => {
                  onClose()
                  return user.banned ? "User unbanned successfully" : "User banned successfully"
                },
                error: (err) => {
                  return err.message || (user.banned ? "Failed to unban user" : "Failed to ban user")
                }
              })
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : user.banned ? "Unban User" : "Ban User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ToggleBanConfirmationDialog
