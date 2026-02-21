"use client"

import * as React from "react"
import {
  Command,
} from "lucide-react"

import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { User } from "@/lib/auth"
import { navMainItems, navSecondaryItems } from "./config"
import { Role } from "@/lib/auth/permissions"

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & {
  user: User
}) {
  const { main, secondary } = useNavItems(user.role as Role)
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain items={main} />
        <NavSecondary items={secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export function useNavItems(role: Role = "viewer") {
  const main = React.useMemo(() => {
    return navMainItems.filter((item) => {
      return item.items.some((subItem) => {
        return !subItem.roles || subItem.roles.includes(role);
      });
    });
  }, [role]);

  const secondary = React.useMemo(() => {
    return navSecondaryItems.filter((item) => {
      return !item.roles || item.roles.includes(role);
    });
  }, [role]);

  return {
    main,
    secondary,
  }
}
