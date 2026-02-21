"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import {
  Mail,
  X,
  RotateCw,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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

interface PendingInvitationsProps {
  organizationId?: string
}

/**
 * Pending Invitations Component
 *
 * Features:
 * - List pending invitations
 * - Cancel invitation
 * - Resend invitation
 * - Expiration tracking
 * - Status badges
 *
 * @example
 * ```tsx
 * <PendingInvitations organizationId="org-id" />
 * ```
 */
export function PendingInvitations({ organizationId }: PendingInvitationsProps) {
  const router = useRouter()
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [invitationToCancel, setInvitationToCancel] = useState<any>(null)

  // Fetch invitations
  const { data: invitations, isPending: invitationsLoading } =
    authClient.organization.useListInvitations({
      query: organizationId ? { organizationId } : undefined,
    })

  /**
   * Cancel invitation
   */
  const handleCancelInvitation = async () => {
    if (!invitationToCancel) return

    setCancelingId(invitationToCancel.id)

    try {
      await authClient.organization.cancelInvitation({
        invitationId: invitationToCancel.id,
      })

      toast.success("Invitation canceled")
      setInvitationToCancel(null)
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to cancel invitation", {
        description: error.message,
      })
    } finally {
      setCancelingId(null)
    }
  }

  /**
   * Resend invitation
   */
  const handleResendInvitation = async (invitation: any) => {
    setResendingId(invitation.id)

    try {
      await authClient.organization.inviteMember({
        email: invitation.email,
        role: invitation.role,
        resend: true,
      })

      toast.success("Invitation resent", {
        description: `A new invitation email has been sent to ${invitation.email}`,
      })

      router.refresh()
    } catch (error: any) {
      toast.error("Failed to resend invitation", {
        description: error.message,
      })
    } finally {
      setResendingId(null)
    }
  }

  /**
   * Check if invitation is expired
   */
  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) < new Date()
  }

  /**
   * Get status badge
   */
  const getStatusBadge = (invitation: any) => {
    if (isExpired(invitation.expiresAt)) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Expired
        </Badge>
      )
    }

    switch (invitation.status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Mail className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="secondary" className="gap-1">
            <X className="h-3 w-3" />
            Canceled
          </Badge>
        )
      default:
        return <Badge variant="outline">{invitation.status}</Badge>
    }
  }

  if (invitationsLoading) {
    return <PendingInvitationsSkeleton />
  }

  if (!invitations?.data?.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No pending invitations</h3>
        <p className="text-sm text-muted-foreground">
          Invite team members to get started
        </p>
      </div>
    )
  }

  // Filter only pending and not expired
  const pendingInvitations = invitations.data.filter(
    (inv: any) => inv.status === "pending" && !isExpired(inv.expiresAt)
  )

  if (pendingInvitations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No pending invitations</h3>
        <p className="text-sm text-muted-foreground">
          All invitations have been accepted, rejected, or expired
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {pendingInvitations.map((invitation: any) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{invitation.email}</p>
                {getStatusBadge(invitation)}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="capitalize">
                  Role: <strong>{invitation.role}</strong>
                </span>
                <span>
                  Invited by: <strong>{invitation.inviter.user.name}</strong>
                </span>
                <span>
                  Expires{" "}
                  {formatDistanceToNow(new Date(invitation.expiresAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Resend Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResendInvitation(invitation)}
                disabled={resendingId === invitation.id}
              >
                {resendingId === invitation.id ? (
                  <RotateCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Resend
                  </>
                )}
              </Button>

              {/* Cancel Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInvitationToCancel(invitation)}
                disabled={cancelingId === invitation.id}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={!!invitationToCancel}
        onOpenChange={(open) => !open && setInvitationToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the invitation for{" "}
              <strong>{invitationToCancel?.email}</strong>? They will no longer
              be able to use this invitation link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelInvitation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function PendingInvitationsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
