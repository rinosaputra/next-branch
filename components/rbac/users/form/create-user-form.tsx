"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { UserFormFields } from "./user-form-fields"
import { Loader2 } from "lucide-react"
import { useRevalidateUsers } from "../../../../hooks/rbac/users"
import { CreateUserInput, createUserSchema } from "@/lib/validations/user"
/**
 * Create User Form Component
 *
 * Features:
 * - Zod validation
 * - React Hook Form integration
 * - TanStack Query mutation
 * - Loading states
 * - Error handling
 * - Success toast & redirect
 * - Cache invalidation
 *
 * @example
 * ```tsx
 * <CreateUserForm />
 * ```
 */
export function CreateUserForm() {
  const router = useRouter()
  const revalidate = useRevalidateUsers()

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "viewer",
    },
  })

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const response = await authClient.admin.createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      return response
    },
    onSuccess: (response) => {
      // Invalidate users query to refetch
      revalidate()

      const userName = response.data?.user?.name || "User"

      toast.success("User created successfully", {
        description: `${userName} can now log in to the system.`,
      })

      // Redirect to users list
      router.push("/dashboard/users")
      router.refresh()
    },
    onError: (error: any) => {
      console.error("Create user error:", error)

      // Handle specific error cases
      let errorMessage = "An unexpected error occurred"

      if (error.message?.includes("email")) {
        errorMessage = "This email address is already registered"
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error("Failed to create user", {
        description: errorMessage,
      })
    },
  })

  const onSubmit = (data: CreateUserInput) => {
    createUserMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Shared form fields */}
        <UserFormFields form={form} isEditMode={false} />

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={createUserMutation.isPending}
            className="flex-1"
          >
            {createUserMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {createUserMutation.isPending ? "Creating..." : "Create User"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={createUserMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
