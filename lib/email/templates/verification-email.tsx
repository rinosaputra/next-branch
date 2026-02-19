// lib/email/templates/verification-email.tsx
import * as React from 'react'
import { EmailLayout } from '@/lib/email/components/email-layout'
import { Heading, Text, Button, Section } from '@react-email/components'

interface VerificationEmailProps {
  userName: string
  verificationUrl: string
}

export function VerificationEmail({ userName, verificationUrl }: VerificationEmailProps) {
  return (
    <EmailLayout preview="Verify your email address">
      <Section className="space-y-4 text-center">
        <Heading className="text-2xl font-bold text-gray-900 mb-5">
          Welcome to {process.env.NEXT_PUBLIC_APP_NAME}!
        </Heading>

        <Text className="text-base text-gray-700 leading-6">
          Hi {userName},
        </Text>

        <Text className="text-base text-gray-700 leading-6">
          Thank you for signing up. Please verify your email address to complete your registration.
        </Text>

        <Button
          href={verificationUrl}
          className="bg-black text-white px-6 py-3 rounded-md font-semibold text-base inline-block no-underline"
        >
          Verify Email Address
        </Button>

        <Text className="text-sm text-gray-500 mt-5">
          This link will expire in 24 hours.
        </Text>

        <Text className="text-sm text-gray-500">
          If you didn't create an account, you can safely ignore this email.
        </Text>
      </Section>
    </EmailLayout>
  )
}
