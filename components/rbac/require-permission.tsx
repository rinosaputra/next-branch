// components/rbac/require-permission.tsx
"use client"

import { usePermission } from "@/hooks/use-permission"

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
  const { hasPermission, loading } = usePermission(resource, actions)
  if (loading) return null
  if (!hasPermission) return <>{fallback}</>
  return <>{children}</>
}
