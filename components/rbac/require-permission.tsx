// components/rbac/require-permission.tsx
"use client"

import { authClient } from "@/lib/auth-client"
import { useEffect, useState } from "react"

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
  const [hasPermission, setHasPermission] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authClient.admin.hasPermission({
      permissions: {
        [resource]: actions
      }
    }).then(result => {
      setHasPermission(!!result.data)
      setLoading(false)
    })
  }, [resource, actions])

  if (loading) return null
  if (!hasPermission) return <>{fallback}</>

  return <>{children}</>
}
