"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Users, MoreHorizontal, Trash2, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Team List Component
 *
 * Features:
 * - List all teams
 * - Team member count
 * - Quick actions (edit, delete)
 *
 * @example
 * ```tsx
 * <TeamList organizationId="org-id" />
 * ```
 */
export function TeamList({ organizationId }: { organizationId?: string }) {
  const router = useRouter()

  const { data: teams, isPending: teamsLoading } =
    authClient.organization.useListTeams({
      query: organizationId ? { organizationId } : undefined,
    })

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return

    try {
      await authClient.organization.removeTeam({
        teamId,
      })

      toast.success("Team deleted successfully")
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to delete team", {
        description: error.message,
      })
    }
  }

  if (teamsLoading) {
    return <TeamListSkeleton />
  }

  if (!teams?.data?.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <Users className="mx-auto h-8 w-8 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No teams yet</h3>
        <p className="text-sm text-muted-foreground">
          Create teams to organize your members
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teams.data.map((team: any) => (
        <div
          key={team.id}
          className="flex flex-col rounded-lg border p-4 hover:border-primary/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">{team.name}</h3>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    router.push(
                      `/dashboard/organizations/${organizationId}/teams/${team.id}`
                    )
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Team
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteTeam(team.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4">
            <Badge variant="secondary">
              {team.members?.length || 0} members
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

function TeamListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="mt-4 h-5 w-24" />
        </div>
      ))}
    </div>
  )
}
