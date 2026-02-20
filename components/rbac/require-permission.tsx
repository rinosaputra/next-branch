// components/rbac/require-permission.tsx
"use client"

import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"

interface RequirePermissionProps {
  resource: string
  actions: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RequirePermission({
  resource,
  actions,
  children,
  fallback = null
}: RequirePermissionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["has-permission", resource, actions],
    queryFn: async () => {
      const result = await authClient.admin.hasPermission({
        permissions: {
          [resource]: actions
        }
      })

      return result.data
    }
  })

  if (isLoading) return null
  if (!data) return <>{fallback}</>

  return <>{children}</>
}
