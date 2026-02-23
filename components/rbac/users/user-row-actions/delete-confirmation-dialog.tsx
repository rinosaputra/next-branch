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
import { User } from '../columns'
import { useDeleteUser } from '../../../../hooks/rbac/users';
import { toast } from 'sonner';

const DeleteConfirmationDialog: React.FC<{ deleteDialogOpen: boolean; setDeleteDialogOpen: (open: boolean) => void; user: User; }> = ({ deleteDialogOpen, setDeleteDialogOpen, user }) => {
  const { isPending: loading, mutateAsync } = useDeleteUser() // Implement delete user hook
  return (
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
            onClick={() => toast.promise(mutateAsync(user.id), {
              loading: "Deleting user...",
              success: () => {
                setDeleteDialogOpen(false)
                return "User deleted successfully"

              },
              error: (err) => {
                return err.message || "Failed to delete user"
              }
            })}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConfirmationDialog
