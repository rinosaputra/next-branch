"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMainItem } from "./config"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: NavMainItem[]
}) {

  return (
    <>{items.map((item) => (
      <SidebarGroup key={item.title} className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
        <SidebarMenu>
          {item.items.map((subItem) => (
            <SidebarMenuItem key={subItem.title}>
              <SidebarMenuButton asChild>
                <Link href={subItem.url}>
                  <subItem.icon />
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    ))}</>

  )
}
