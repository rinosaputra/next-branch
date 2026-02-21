import { authClient } from "@/lib/auth-client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export const UserKey = "users"

export const useRevalidateUsers = () => {
  const queryClient = useQueryClient()
  return (keys?: string[]) => {
    queryClient.invalidateQueries({ queryKey: [UserKey, ...(keys ?? [])] })
  }
}

export const useUsers = () => {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(100)
  const query = useQuery({
    queryKey: [UserKey, page, limit],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {
          limit: limit,
          offset: page * limit,
        },
      })
      return result.data
    },
    // Refetch on window focus for real-time updates
    refetchOnWindowFocus: true,
  })

  return {
    query,
    setPage,
    setLimit,
    page,
    limit,
  }
}
