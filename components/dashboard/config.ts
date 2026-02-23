import { Users } from "lucide-react";
import { NavMainItem, NavSecondaryItem } from "./types";

export const navMainItems: NavMainItem[] = [
  {
    title: "RBAC",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
        roles: ["admin"] // Only show this item to users with the "admin" role
      }
    ]
  },
  {
    title: "Organizations",
    items: [
      {
        title: "All Organizations",
        url: "/dashboard/organizations",
        icon: Users,
        roles: ["admin"] // Show to both admin and regular users
      }
    ]
  }
]

export const navSecondaryItems: NavSecondaryItem[] = []
