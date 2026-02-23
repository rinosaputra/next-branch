"use server"

import { auth } from "@/lib/auth"
import { Organization } from "./columns"
import { headers } from "next/headers"

/**
 * Production: Fetch organizations using Better Auth API
 *
 * This function is used in the OrganizationsDataTable component to fetch the list of organizations
 * that the current user belongs to. It uses the Better Auth API to ensure secure and efficient data fetching.
 */
export async function fetchUserOrganizations(userId: string): Promise<Organization[]> {
  try {
    // Get current session to ensure user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!(session?.user.id === userId)) {
      throw new Error("Unauthorized: User ID does not match session")
    }

    // Use Better Auth Organization API
    const response = await auth.api.listOrganizations({
      headers: await headers(),
    })

    if (!response) {
      console.error("Failed to fetch organizations: No response from API")
      return []
    }

    // Transform Better Auth response to our Organization type
    return (response || []).map((org: any) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      logo: org.logo,
      role: org.role,
      memberCount: org.members?.length || 0,
      createdAt: new Date(org.createdAt),
      isActive: org.id === session?.session.activeOrganizationId,
    }))
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return []
  }
}
