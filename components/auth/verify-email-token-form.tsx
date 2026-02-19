"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { authNavigationLinks } from "./const"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface VerifyEmailTokenFormProps {
  token: string
}

type VerificationState = "validating" | "success" | "error" | "invalid-token"

export default function VerifyEmailTokenForm({ token }: VerifyEmailTokenFormProps) {
  const router = useRouter()
  const [state, setState] = useState<VerificationState>("validating")
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Verify email mutation
  const verifyEmail = useMutation({
    mutationFn: async () => {
      const response = await authClient.verifyEmail({
        query: {
          token: token,
        },
      })

      if (response.error) {
        throw new Error(response.error.message || "Email verification failed")
      }

      return response
    },
    onSuccess: () => {
      setState("success")
      toast.success("Email verified successfully!", {
        description: "You can now sign in to your account.",
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(authNavigationLinks.login.href)
      }, 3000)
    },
    onError: (error: Error) => {
      setState("error")

      // Better Auth specific error handling
      if (error.message.includes("expired")) {
        setErrorMessage("Verification link has expired. Please request a new one.")
      } else if (error.message.includes("invalid")) {
        setErrorMessage("Invalid verification link. Please check your email.")
      } else if (error.message.includes("already verified")) {
        setErrorMessage("This email has already been verified.")
        // Allow redirect to login
        setTimeout(() => {
          router.push(authNavigationLinks.login.href)
        }, 3000)
      } else {
        setErrorMessage(error.message || "Email verification failed.")
      }

      toast.error("Verification failed", {
        description: error.message,
      })
    },
  })

  // Auto-verify on mount
  useEffect(() => {
    if (!token) {
      setState("invalid-token")
      setErrorMessage("No verification token provided. Please check your email link.")
      return
    }

    // Token format validation (optional)
    if (token.length < 10) {
      setState("invalid-token")
      setErrorMessage("Invalid verification token format. Please check your email link.")
      return
    }

    // Trigger verification
    verifyEmail.mutate()
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  // Validating state
  if (state === "validating") {
    return (
      <div className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Please wait while we verify your email address.
            </p>
          </div>
        </FieldGroup>
      </div>
    )
  }

  // Success state
  if (state === "success") {
    return (
      <div className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
          </div>
          <Field>
            <Button asChild>
              <Link href={authNavigationLinks.login.href}>Go to Login</Link>
            </Button>
          </Field>
        </FieldGroup>
      </div>
    )
  }

  // Error or invalid token state
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-4 text-center">
          <XCircle className="h-12 w-12 text-red-600" />
          <h1 className="text-2xl font-bold">Verification Failed</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {errorMessage}
          </p>
        </div>

        {state === "error" && !errorMessage.includes("already verified") && (
          <Field>
            <Button asChild variant="outline">
              <Link href="/resend-verification">Request new verification email</Link>
            </Button>
          </Field>
        )}

        <Field>
          <FieldDescription className="text-center">
            {authNavigationLinks.login.backLabel}{" "}
            <Link href={authNavigationLinks.login.href} className="underline underline-offset-4">
              {authNavigationLinks.login.linkLabel}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}
