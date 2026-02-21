"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import {
  MoreHorizontal,
  Shield,
  Trash2,
  Mail,
  Crown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface MemberListProps {
  organizationId?: string
}

/**
 * Member List Component
 *
 * Features:
 * - List all organization members
 * - Update member roles
 * - Remove members
 * - Role badges
 * - Loading states
 *
 * @example
 * ```tsx
 * <MemberList organizationId="org-id" />
 * ```
 */
export function MemberList({ organizationId }: MemberListProps) {
  const router = useRouter()
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null)
  const [memberToRemove, setMemberToRemove] = useState<any>(null)

  // Fetch members
  const { data: membersData, isPending: membersLoading } =
    authClient.organization.useListMembers({
      query: organizationId ? { organizationId } : undefined,
    })

  const members = membersData?.data || []

  /**
   * Update member role
   */
  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      await authClient.organization.updateMemberRole({
        memberId,
        role: newRole,
      })

      toast.success("Role updated successfully")
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to update role", {
        description: error.message,
      })
    }
  }

  /**
   * Remove member
   */
  const handleRemoveMember = async () => {
    if (!memberToRemove) return

    setRemovingMemberId(memberToRemove.id)

    try {
      await authClient.organization.removeMember({
        memberIdOrEmail: memberToRemove.user.email,
      })

      toast.success(`${memberToRemove.user.name} removed from organization`)
      setMemberToRemove(null)
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to remove member", {
        description: error.message,
      })
    } finally {
      setRemovingMemberId(null)
    }
  }

  if (membersLoading) {
    return <MemberListSkeleton />
  }

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Shield className="mx-auto h-8 w-8 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No members yet</h3>
        <p className="text-sm text-muted-foreground">
          Invite team members to collaborate
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {members.map((member) => {
          const isOwner = member.role === "owner"

          return (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.user.image || undefined} />
                  <AvatarFallback>
                    {member.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.user.name}</p>
                    {isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Role Select */}
                <Select
                  defaultValue={member.role}
                  onValueChange={(value) => handleUpdateRole(member.id, value)}
                  disabled={isOwner}
                >
                  <SelectTrigger className="w-32.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Owner
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>

                {/* Actions Dropdown */}
                {!isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={removingMemberId === member.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          // Send email action
                          toast.info(`Composing email to ${member.user.email}`)
                        }}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setMemberToRemove(member)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Remove Member Confirmation */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{memberToRemove?.user.name}</strong> from this organization?
              They will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function MemberListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-9 w-32.5" />
        </div>
      ))}
    </div>
  )
}
