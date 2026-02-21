import z from "zod";

export const roleOptions = {
  viewer: "viewer",
  editor: "editor",
  admin: "admin",
  contributor: "contributor",
} as const;

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(roleOptions, {
    error: "Please select a role",
  }),
})

export type UserFormValues = z.infer<typeof userSchema>
