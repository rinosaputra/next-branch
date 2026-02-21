"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Plus, Settings } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

/**
 * Organization Switcher Component
 *
 * Features:
 * - Display all user's organizations
 * - Active organization indicator
 * - Quick organization switching
 * - Create organization shortcut
 * - Manage organizations link
 *
 * Used in: Header/Sidebar
 *
 * @example
 * ```tsx
 * <OrganizationSwitcher />
 * ```
 */
export function OrganizationSwitcher() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Get all organizations
  const { data: organizations, isPending: organizationsLoading } =
    authClient.useListOrganizations()

  // Get active organization
  const { data: activeOrganization, isPending: activeLoading } =
    authClient.useActiveOrganization()

  const isLoading = organizationsLoading || activeLoading

  /**
   * Switch active organization
   */
  const handleSelectOrganization = async (organizationId: string) => {
    try {
      await authClient.organization.setActive({
        organizationId,
      })

      toast.success("Switched organization")
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to switch organization", {
        description: error.message,
      })
    }
  }

  // Get initials from organization name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex h-10 w-[200px] items-center justify-between rounded-md border px-3">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select organization"
          className="w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={activeOrganization?.logo || undefined}
                alt={activeOrganization?.name}
              />
              <AvatarFallback className="text-xs">
                {activeOrganization ? getInitials(activeOrganization.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              {activeOrganization?.name || "Select workspace"}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search workspace..." />
          <CommandList>
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              {organizations?.map((organization) => (
                <CommandItem
                  key={organization.id}
                  value={organization.name}
                  onSelect={() => handleSelectOrganization(organization.id)}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={organization.logo || undefined}
                      alt={organization.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(organization.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{organization.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      activeOrganization?.id === organization.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dashboard/organizations/create")
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dashboard/organizations")
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Workspaces
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
