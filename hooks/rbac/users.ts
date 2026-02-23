// components/rbac/users/user-hook.ts
import { authClient } from "@/lib/auth-client"
import { Role } from "@/lib/auth/permissions"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

export const useSetUserPassword = () => {
  return useMutation({
    mutationFn: async (body: { userId: string; newPassword: string }) => {
      const response = await authClient.admin.setUserPassword({
        userId: body.userId,
        newPassword: body.newPassword,
      })
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    }
  })
}

export const useSetUserRole = () => {
  const revalidateUsers = useRevalidateUsers()

  return useMutation({
    mutationFn: async (body: { userId: string; role: Role }) => {
      const response = await authClient.admin.setRole({
        userId: body.userId,
        role: body.role,
      })
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    },
    onSuccess: () => {
      revalidateUsers()
    }
  })
}

export const useDeleteUser = () => {
  const revalidateUsers = useRevalidateUsers()

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await authClient.admin.removeUser({
        userId: userId,
      })
      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    },
    onSuccess: () => {
      revalidateUsers()
    }
  })
}

export const useToggleUserBan = () => {
  const revalidateUsers = useRevalidateUsers()

  return useMutation({
    mutationFn: async (body: { userId: string; ban: boolean }) => {
      const response = body.ban
        ? await authClient.admin.banUser({
          userId: body.userId,
          banReason: "Banned by admin",
          // banExpiresIn: 60 * 60 * 24 * 7, // 7 days
        })
        : await authClient.admin.unbanUser({
          userId: body.userId,
        })

      if (response.error) {
        throw new Error(response.error.message)
      }
      return response.data
    },
    onSuccess: () => {
      revalidateUsers()
    }
  })
}
