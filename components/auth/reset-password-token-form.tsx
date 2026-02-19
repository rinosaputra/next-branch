"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { authClient } from "@/lib/auth-client"
import { ResetPasswordInput, resetPasswordSchema } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { authNavigationLinks, formFieldConfig } from "./const"
import { InputPassword } from "./input-password"

// Variable for title, description, submit button, and navigation links
const config = {
  title: "Reset your password",
  description: "Enter your new password below",
  submitButton: {
    label: "Reset password",
  },
  field: formFieldConfig,
  login: authNavigationLinks.login,
}

export default function ResetPasswordTokenForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get("token") || undefined
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(true)

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenError("No reset token provided. Please check your email link.")
      setIsValidating(false)
      return
    }

    // Token format validation (optional, Better Auth will validate server-side)
    if (token.length < 10) {
      setTokenError("Invalid reset token format. Please request a new reset link.")
      setIsValidating(false)
      return
    }

    setIsValidating(false)
  }, [token])

  // Reset password mutation
  const resetPassword = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const response = await authClient.resetPassword({
        newPassword: data.password,
        token: token,
      })

      if (response.error) {
        throw new Error(response.error.message || "Failed to reset password")
      }

      return response
    },
  })

  const onSubmit = (data: ResetPasswordInput) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Reset password data:", data)
    }

    toast.promise(resetPassword.mutateAsync(data), {
      loading: "Resetting password...",
      success: () => {
        router.push(config.login.href)
        return "Password reset successfully! You can now sign in with your new password."
      },
      error: (err) => {
        // Better Auth specific errors
        if (err.message.toLowerCase().includes("expired")) {
          const message = "Reset link has expired. Please request a new one."
          setTokenError(message)
          return message
        }
        if (err.message.toLowerCase().includes("invalid")) {
          const message = "Invalid reset link. Please request a new one."
          setTokenError(message)
          return message
        }
        const message = err.message || "Failed to reset password. Please try again."
        setTokenError(message)
        return message
      },
    })
  }

  // Loading state while validating token
  if (isValidating) {
    return (
      <div className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Validating...</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Please wait while we validate your reset link.
            </p>
          </div>
        </FieldGroup>
      </div>
    )
  }

  // Error state if token is invalid or missing
  if (tokenError) {
    return (
      <div className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
            <p className="text-muted-foreground text-sm text-balance">
              {tokenError}
            </p>
          </div>
          <Field>
            <Button asChild>
              <Link href="/forgot-password">Request new reset link</Link>
            </Button>
          </Field>
          <Field>
            <FieldDescription className="text-center">
              {config.login.backLabel}{" "}
              <Link href={config.login.href} className="underline underline-offset-4">
                {config.login.linkLabel}
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {config.description}
          </p>
        </div>

        {/* Password Field */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {config.field.password.label}
              </FieldLabel>
              <InputPassword
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={config.field.password.placeholder}
                autoComplete="new-password"
                disabled={resetPassword.isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Confirm Password Field */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {config.field.confirmPassword.label}
              </FieldLabel>
              <InputPassword
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={config.field.confirmPassword.placeholder}
                autoComplete="new-password"
                disabled={resetPassword.isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Submit Button */}
        <Field>
          <Button type="submit" disabled={resetPassword.isPending}>
            {resetPassword.isPending ? "Resetting..." : config.submitButton.label}
          </Button>
        </Field>

        {/* Back to Login Link */}
        <Field>
          <FieldDescription className="text-center">
            {config.login.backLabel}{" "}
            <Link href={config.login.href} className="underline underline-offset-4">
              {config.login.linkLabel}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
