"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { ForgotPasswordInput, forgotPasswordSchema } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { authNavigationLinks, formFieldConfig } from "./const"

// Variable for title, description, submit button, and navigation links
const config = {
  title: "Forgot your password?",
  description: "Enter your email address and we'll send you a link to reset your password",
  submitButton: {
    label: "Send reset link",
  },
  field: formFieldConfig,
  login: authNavigationLinks.login,
}

export default function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Request password reset with mutation tanstack query
  const requestReset = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const response = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password", // URL pattern for reset link
      })

      if (response.error) {
        throw new Error(response.error.message || "Failed to send reset link")
      }

      return response
    },
  })

  const onSubmit = (data: ForgotPasswordInput) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Forgot password data:", data)
    }

    toast.promise(requestReset.mutateAsync(data), {
      loading: "Sending reset link...",
      success: () => {
        form.reset() // Clear form after success
        return "Reset link sent! Please check your email inbox."
      },
      error: (err) => err.message || "Failed to send reset link. Please try again.",
    })
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

        {/* Email Field */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {config.field.email.label}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={config.field.email.placeholder}
                autoComplete="email"
                type="email"
                disabled={requestReset.isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Submit Button */}
        <Field>
          <Button type="submit" disabled={requestReset.isPending}>
            {requestReset.isPending ? "Sending..." : config.submitButton.label}
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
