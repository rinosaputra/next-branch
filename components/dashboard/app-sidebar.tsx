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

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & {
  user: User
}) {
  const { main, secondary } = useNavItems()
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

export function useNavItems() {
  const main = React.useMemo(() => navMainItems, []);

  const secondary = React.useMemo(() => navSecondaryItems, []);

  return {
    main,
    secondary,
  }
}
