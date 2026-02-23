"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchUserOrganizations } from "./organization-service"
import { authClient } from "@/lib/auth-client"

const OrganizationKey = "organizations"

export const useRevalidateOrganizations = () => {
  const { data } = authClient.useSession()
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: [OrganizationKey, data?.user?.id || "unknown"] })
  }
}

export const useOrganizationList = () => {
  const { data } = authClient.useSession()
  const query = useQuery({
    queryKey: [OrganizationKey, data?.user?.id || "unknown"],
    queryFn: async () => {
      try {
        const response = await fetchUserOrganizations(data?.user?.id || "")
        return response
      } catch (error) {
        console.error("Error fetching organizations:", error)
        return []
      }
    },
    enabled: !!data?.user?.id, // Only run if user ID is available
  })

  return {
    query
  }
}
