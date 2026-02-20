// hooks/use-permission.ts
'use client'

import { authClient } from '@/lib/auth-client'
import { useQuery } from '@tanstack/react-query'

export function usePermission(resource: string, actions: string[]) {
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

  return { hasPermission: data?.success ?? false, loading: isLoading }
}
