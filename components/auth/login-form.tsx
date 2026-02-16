"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"

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
  return <form className="flex flex-col gap-6">
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">{config.title}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {config.description}
        </p>
      </div>
      <Field>
        <FieldLabel htmlFor="email">{config.field.email.label}</FieldLabel>
        <Input id="email" type="email" placeholder={config.field.email.placeholder} required />
      </Field>
      <Field>
        <div className="flex items-center">
          <FieldLabel htmlFor="password">{config.field.password.label}</FieldLabel>
          <a
            href="#"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input id="password" type="password" placeholder={config.field.password.placeholder} required />
      </Field>
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
