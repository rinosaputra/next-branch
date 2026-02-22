import { Role } from "@/lib/auth/permissions";
import z from "zod";

export const roleOptions = {
  viewer: "viewer",
  admin: "admin",
  support: "support",
} as const;

export const roles: {
  value: Role
  label: string
  description: string
}[] = [
    { value: "viewer", label: "Viewer", description: "Read-only access to content" },
    { value: "support", label: "Support", description: "Can assist with user issues and support tickets" },
    { value: "admin", label: "Administrator", description: "Full system access and user management" },
  ]

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(roleOptions, {
    error: "Please select a role",
  }),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>

export const editUserSchema = createUserSchema.omit({ password: true })

export type EditUserFormValues = z.infer<typeof editUserSchema>
