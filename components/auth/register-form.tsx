"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { RegisterInput, registerSchema } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { authNavigationLinks, defaultRedirectURL, formFieldConfig, oauthProviders } from "./const"

// Variable for title, description, submit button, oauth providers, and navigation links
const config = {
  title: "Create an account",
  description: "Enter your information below to create your account",
  submitButton: {
    label: "Sign up",
  },
  oauth: oauthProviders,
  field: formFieldConfig,
  login: authNavigationLinks.login,
}

export default function RegisterForm() {
  const router = useRouter()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Sign Up with mutation tanstack query
  const signUp = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: defaultRedirectURL,
      })

      if (response.error) {
        throw new Error(response.error.message || "Registration failed")
      }

      return response
    },
  })

  const onSubmit = (data: RegisterInput) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Register data:", data)
    }
    toast.promise(signUp.mutateAsync(data), {
      loading: "Creating account...",
      success: () => {
        router.push(config.login.href)
        return "Account created successfully! Please check your email to verify your account."
      },
      error: (err) => err.message || "Registration failed",
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

        {/* Name Field */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {config.field.name.label}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={config.field.name.placeholder}
                autoComplete="name"
                type="text"
                disabled={signUp.isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

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
                disabled={signUp.isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Password Field */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {config.field.password.label}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={config.field.password.placeholder}
                autoComplete="new-password"
                type="password"
                disabled={signUp.isPending}
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
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={config.field.confirmPassword.placeholder}
                autoComplete="new-password"
                type="password"
                disabled={signUp.isPending}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Submit Button */}
        <Field>
          <Button type="submit" disabled={signUp.isPending}>
            {signUp.isPending ? "Creating account..." : config.submitButton.label}
          </Button>
        </Field>

        {/* OAuth Separator */}
        <FieldSeparator>{config.oauth.label}</FieldSeparator>

        {/* OAuth Provider + Login Link */}
        <Field>
          <Button variant="outline" type="button" disabled>
            <Image
              className="dark:invert"
              src={config.oauth.google.image}
              alt="Google logo"
              width={16}
              height={16}
              priority
            />
            {config.oauth.google.label}
          </Button>
          <FieldDescription className="text-center">
            {config.login.label}{" "}
            <Link href={config.login.href} className="underline underline-offset-4">
              {config.login.linkLabel}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
