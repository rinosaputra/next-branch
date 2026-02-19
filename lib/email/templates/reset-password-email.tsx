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
      <Section style={{ padding: '0 0 20px 0' }}>
        <Heading style={headingStyle}>Password Reset Request</Heading>

        <Text style={textStyle}>Hi {userName},</Text>

        <Text style={textStyle}>
          You requested to reset your password. Click the button below to create a new password.
        </Text>

        <Button href={resetUrl} style={buttonStyle}>
          Reset Password
        </Button>

        <Text style={footerTextStyle}>
          This link will expire in 1 hour.
        </Text>

        <Text style={footerTextStyle}>
          If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
        </Text>
      </Section>
    </EmailLayout>
  )
}

// Email-safe inline styles
const headingStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000000',
  margin: '0 0 20px 0',
}

const textStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#333333',
  lineHeight: '24px',
  margin: '0 0 16px 0',
}

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 24px',
  backgroundColor: '#000000',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: '600',
  fontSize: '16px',
  margin: '20px 0',
}

const footerTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '20px',
  margin: '8px 0 0 0',
}
