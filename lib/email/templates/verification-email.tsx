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
      <Section style={{ padding: '0 0 20px 0' }}>
        <Heading style={headingStyle}>
          Welcome to {process.env.NEXT_PUBLIC_APP_NAME}!
        </Heading>

        <Text style={textStyle}>Hi {userName},</Text>

        <Text style={textStyle}>
          Thank you for signing up. Please verify your email address to complete your registration.
        </Text>

        <Button href={verificationUrl} style={buttonStyle}>
          Verify Email Address
        </Button>

        <Text style={footerTextStyle}>
          This link will expire in 24 hours.
        </Text>

        <Text style={footerTextStyle}>
          If you didn't create an account, you can safely ignore this email.
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
