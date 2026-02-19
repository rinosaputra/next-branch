"use client"

import { SidebarIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ThemeToggle } from "./theme-toggle"

function CreateBreadcrumbs() {
  const pathname = usePathname()
  const isMobile = useIsMobile()


  // Generate breadcrumb items from pathname
  const breadcrumbItems = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean)
    const items = segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/")
      return { label: segment, href }
    })
    if (!items.length) {
      return [{ label: "Dashboard", href: process.env.NEXT_PUBLIC_DASHBOARD_URL || "/dashboard" }]
    }
    if (isMobile && items.length > 0) {
      return [items[items.length - 1]]
    }
    return items
  }, [pathname, isMobile])

  return (<Breadcrumb>
    <BreadcrumbList>
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {index > 0 && <BreadcrumbSeparator />}

          <BreadcrumbItem>
            {index === breadcrumbItems.length - 1 ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={item.href}>
                {item.label}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </div>
      ))}
    </BreadcrumbList>
  </Breadcrumb>)
}

function ToggleSidebarButton() {
  const { toggleSidebar } = useSidebar()
  return (<Button
    className="size-8"
    variant="ghost"
    size="icon"
    onClick={toggleSidebar}
  >
    <SidebarIcon />
  </Button>)
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="size-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* Breadcrumb Navigation */}
        <CreateBreadcrumbs />

        {/* Theme Toggle */}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
