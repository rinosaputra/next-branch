import { OrganizationRole } from "@/lib/auth/organization/permissions"
import { Role } from "@/lib/auth/permissions"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  roles?: (Role | OrganizationRole)[]
}

export interface NavMainItem {
  title: string
  items: NavItem[]
}

export type NavSecondaryItem = NavItem
