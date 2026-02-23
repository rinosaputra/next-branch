"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { CreateOrganizationInput, EditOrganizationInput } from "@/lib/validations/organization"
import { checkOrganizationSlug, createOrganization, deleteOrganization, editOrganization, fetchUserOrganizations } from "@/services/organization"

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

export const useCreateOrganization = () => {
  const revalidate = useRevalidateOrganizations()
  return useMutation({
    mutationFn: async (data: CreateOrganizationInput) => {
      try {
        const response = await createOrganization(data)
        return response
      } catch (error) {
        console.error("Error creating organization:", error)
        throw error
      }
    },
    onSuccess: () => {
      revalidate()
    }
  })
}

export const useCheckOrganizationSlug = () => {
  return useMutation({
    mutationFn: async (slug: string) => {
      try {
        const response = await checkOrganizationSlug(slug)
        return response
      } catch (error) {
        console.error("Error checking organization slug:", error)
        throw error
      }
    }
  })
}

export const useEditOrganization = () => {
  const revalidate = useRevalidateOrganizations()
  return useMutation({
    mutationFn: async (data: EditOrganizationInput) => {
      try {
        const response = await editOrganization(data)
        return response
      } catch (error) {
        console.error("Error editing organization:", error)
        throw error
      }
    },
    onSuccess: () => {
      revalidate()
    }
  })
}

export const useDeleteOrganization = () => {
  const revalidate = useRevalidateOrganizations()
  return useMutation({
    mutationFn: async (organizationId: string) => {
      try {
        const response = await deleteOrganization(organizationId)

        return response
      } catch (error) {
        console.error("Error deleting organization:", error)
        throw error
      }
    },
    onSuccess: () => {
      revalidate()
    }
  })
}
