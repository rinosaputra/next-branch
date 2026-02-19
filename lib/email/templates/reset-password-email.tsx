import * as React from 'react'
import { EmailLayout } from '@/lib/email/components/email-layout'
import { Heading, Text, Button, Section } from '@react-email/components'

interface ResetPasswordEmailProps {
  userName: string
  resetUrl: string
}

export function ResetPasswordEmail({ userName, resetUrl }: ResetPasswordEmailProps) {
  return (
    <EmailLayout preview="Reset your password">
      <Section className="space-y-4 text-center">
        <Heading className="text-2xl font-bold text-gray-900 mb-5">
          Password Reset Request
        </Heading>

        <Text className="text-base text-gray-700 leading-6">
          Hi {userName},
        </Text>

        <Text className="text-base text-gray-700 leading-6">
          You requested to reset your password. Click the button below to create a new password.
        </Text>

        <Button
          href={resetUrl}
          className="bg-black text-white px-6 py-3 rounded-md font-semibold text-base inline-block no-underline"
        >
          Reset Password
        </Button>

        <Text className="text-sm text-gray-500 mt-5">
          This link will expire in 1 hour.
        </Text>

        <Text className="text-sm text-gray-500">
          If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
        </Text>
      </Section>
    </EmailLayout>
  )
}
