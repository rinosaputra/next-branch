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
import { LoginInput, loginSchema } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { Controller, useForm } from "react-hook-form"
import { authNavigationLinks, defaultRedirectURL, formFieldConfig, oauthProviders } from "./const"
import Link from "next/link"
import { toast } from "sonner"

// variable for title, description, submit button, oauth providers, and navigation links
const config = {
  title: "Login to your account",
  description: "Enter your email below to login to your account",
  submitButton: {
    label: "Login",
  },
  oauth: oauthProviders,
  field: formFieldConfig,
  signup: authNavigationLinks.register,
  forgotPassword: authNavigationLinks.forgotPassword,
}

export default function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema), // You can replace this with your own validation schema
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Sign In with mutation tanstack query
  const signIn = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        callbackURL: defaultRedirectURL,
      })
      if(response.error) {
        throw new Error(response.error?.message || "Login failed")
      }
      return response
    }
  })

  const onSubmit = (data: LoginInput) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Login data:", data)
    }
    toast.promise(signIn.mutateAsync(data), {
      loading: "Logging in...",
      success: "Logged in successfully!",
      error: (err) => err.message || "Login failed",
    })
  }

  return <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">{config.title}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {config.description}
        </p>
      </div>
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
              autoComplete="off"
              type="email"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">{config.field.password.label}</FieldLabel>
              <Link
                href={config.forgotPassword.href}
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                {config.forgotPassword.label}
              </Link>
            </div>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={config.field.password.placeholder}
              autoComplete="off"
              type="password"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Field>
        <Button type="submit">{config.submitButton.label}</Button>
      </Field>
      <FieldSeparator>{config.oauth.label}</FieldSeparator>
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
          {config.signup.label}{" "}
          <Link href={config.signup.href} className="underline underline-offset-4">
            {config.signup.linkLabel}
          </Link>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
}
