import * as React from 'react'
import { EmailLayout } from '@/lib/email/components/email-layout'
import { Heading, Text, Button, Section, Hr, Link } from '@react-email/components'

export interface OrganizationInvitationEmailProps {
  invitedByUsername: string
  invitedByEmail: string
  teamName: string
  inviteLink: string
  organizationLogo?: string
  organizationRole?: string
}

/**
 * Organization Invitation Email Template
 *
 * Sent when a user is invited to join an organization/workspace.
 *
 * Features:
 * - Clear invitation context with inviter details
 * - Prominent CTA button
 * - Role information
 * - Expiration notice (48 hours)
 * - Decline option
 * - Consistent with existing email templates
 *
 * @example
 * ```tsx
 * import { OrganizationInvitationEmail } from '@/lib/email/templates/organization-invitation'
 * import { sendEmail } from '@/lib/email/send'
 *
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'You've been invited to join Acme Inc',
 *   react: (
 *     <OrganizationInvitationEmail
 *       invitedByUsername="John Doe"
 *       invitedByEmail="john@acme.com"
 *       teamName="Acme Inc"
 *       inviteLink="https://app.example.com/accept-invitation/abc123"
 *       organizationRole="Member"
 *     />
 *   ),
 * })
 * ```
 */
export function OrganizationInvitationEmail({
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
  organizationLogo,
  organizationRole = 'Member',
}: OrganizationInvitationEmailProps) {
  const previewText = `${invitedByUsername} invited you to join ${teamName}`

  return (
    <EmailLayout preview={previewText}>
      <Section className="space-y-4">
        {/* Organization Logo (if provided) */}
        {organizationLogo && (
          <Section className="text-center mb-6">
            <img
              src={organizationLogo}
              alt={teamName}
              className="h-12 w-auto mx-auto rounded"
            />
          </Section>
        )}

        {/* Hero Section */}
        <Section className="text-center mb-6">
          <Text className="text-4xl mb-2">🎉</Text>
          <Heading className="text-2xl font-bold text-gray-900 mb-2">
            You've been invited to join {teamName}
          </Heading>
          <Text className="text-base text-gray-600">
            {invitedByUsername} wants you to collaborate
          </Text>
        </Section>

        {/* Inviter Information Card */}
        <Section className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
          <Section className="flex items-center mb-3">
            {/* Avatar Circle with Initial */}
            <Section className="inline-flex items-center justify-center h-12 w-12 bg-black text-white rounded-full font-bold text-lg mr-4 shrink-0">
              {invitedByUsername.charAt(0).toUpperCase()}
            </Section>

            <Section>
              <Text className="text-base font-semibold text-gray-900 m-0 mb-1">
                {invitedByUsername}
              </Text>
              <Text className="text-sm text-gray-600 m-0">
                {invitedByEmail}
              </Text>
            </Section>
          </Section>

          <Text className="text-sm text-gray-700 m-0">
            invited you to join as <strong>{organizationRole}</strong>
          </Text>
        </Section>

        {/* Main Message */}
        <Text className="text-base text-gray-700 leading-6">
          <strong>{invitedByUsername}</strong> has invited you to join{' '}
          <strong>{teamName}</strong> as a team member.
        </Text>

        <Text className="text-base text-gray-700 leading-6">
          Accept this invitation to collaborate with your team and access shared resources.
        </Text>

        {/* CTA Button */}
        <Section className="text-center my-8">
          <Button
            href={inviteLink}
            className="bg-black text-white px-8 py-4 rounded-md font-semibold text-base inline-block no-underline"
          >
            Accept Invitation
          </Button>
        </Section>

        {/* Alternative Link */}
        <Section className="bg-gray-50 p-4 rounded border border-gray-200">
          <Text className="text-xs text-gray-600 mb-2 m-0">
            Or copy and paste this URL into your browser:
          </Text>
          <Link
            href={inviteLink}
            className="text-xs text-blue-600 break-all no-underline"
          >
            {inviteLink}
          </Link>
        </Section>

        <Hr className="border-gray-300 my-6" />

        {/* Important Information */}
        <Section className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <Text className="text-sm text-yellow-900 font-semibold mb-1">
            ⏰ Time-Sensitive
          </Text>
          <Text className="text-sm text-yellow-800 m-0">
            This invitation will expire in <strong>48 hours</strong>.
          </Text>
        </Section>

        {/* Additional Options */}
        <Text className="text-sm text-gray-600 text-center mt-6">
          Don't want to join? You can safely ignore this email or{' '}
          <Link
            href={inviteLink}
            className="text-blue-600 underline"
          >
            decline the invitation
          </Link>.
        </Text>

        {/* Help Section */}
        <Hr className="border-gray-300 my-6" />

        <Section className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-sm font-semibold text-gray-900 mb-2 m-0">
            Need Help?
          </Text>
          <Text className="text-sm text-gray-600 m-0">
            If you have questions about this invitation, contact{' '}
            <Link
              href={`mailto:${invitedByEmail}`}
              className="text-blue-600 underline"
            >
              {invitedByEmail}
            </Link>{' '}
            or visit our support page.
          </Text>
        </Section>

        {/* Security Notice */}
        <Section className="mt-6">
          <Text className="text-xs text-gray-500 text-center m-0">
            🔒 This is an official invitation from {process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Starter'}.
            We will never ask for your password via email.
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  )
}
