import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { SiteHeader } from '@/components/dashboard/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect(process.env.NEXT_PUBLIC_LOGIN_URL || '/login')
  }

  return (
    <div className="[--header-height:calc(--spacing(14))] font-sans">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar user={session.user} />
          <SidebarInset>
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardLayout
