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
import { auth } from "@/lib/auth"
import { LoginInput, loginSchema } from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { Controller, useForm } from "react-hook-form"

// This is a mock login form component. You can replace it with your own implementation.
const config = {
  title: "Login to your account",
  description: "Enter your email below to login to your account",
  field: {
    email: {
      label: "Email",
      placeholder: "m@example.com",
    },
    password: {
      label: "Password",
      placeholder: "Enter your password",
    },
  },
  submitButton: {
    label: "Login",
  },
  oauth: {
    label: "Or continue with",
    google: {
      label: "Login with Google",
      image: "/images/google.svg",
    },
  },
  signup: {
    label: "Don't have an account?",
    linkLabel: "Sign up",
  },
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
      const response = auth.api.signInEmail({
        body: {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe
        }
      })
    }
  })

  const onSubmit = (data: LoginInput) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Login data:", data)
    }
    // TODO: Implement your login logic here
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
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
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
        <Button variant="outline" type="button">
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
          <a href="#" className="underline underline-offset-4">
            {config.signup.linkLabel}
          </a>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
}
