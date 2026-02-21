import { Users } from "lucide-react";
import { NavMainItem, NavSecondaryItem } from "./types";

export const navMainItems: NavMainItem[] = [
  {
    title: "RBAC",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users
      }
    ]
  }
]

export const navSecondaryItems: NavSecondaryItem[] = []
