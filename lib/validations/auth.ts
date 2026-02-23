import { z } from 'zod'
import { passwordConfirmationSchema, passwordSchema } from './password'

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Register form schema
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

/**
 * Forgot password form schema
 */
export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

/**
 * Reset password form schema
 */
export const resetPasswordSchema = passwordConfirmationSchema

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
