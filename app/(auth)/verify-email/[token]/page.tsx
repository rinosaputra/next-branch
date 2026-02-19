import { createMetadata } from "@/lib/metadata"
import VerifyEmailTokenForm from "@/components/auth/verify-email-token-form"
import { Suspense } from "react"

export const metadata = createMetadata({
  title: "Verify Email",
  description: "Verify your email address",
  path: "/verify-email",
  noIndex: true, // Don't index auth pages
})

interface VerifyEmailPageProps {
  params: Promise<{ token: string }>
}

// Wrap with Suspense to prevent SSR issues
function VerifyEmailContent({ token }: { token: string }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <VerifyEmailTokenForm token={token} />
      </div>
    </div>
  )
}

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const resolvedParams = await params
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center">Loading...</div>}>
      <VerifyEmailContent token={resolvedParams.token} />
    </Suspense>
  )
}
