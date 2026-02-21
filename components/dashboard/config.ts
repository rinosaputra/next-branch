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
  }
]

export const navSecondaryItems: NavSecondaryItem[] = []
