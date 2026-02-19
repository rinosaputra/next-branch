import * as React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from '@react-email/components'

interface EmailLayoutProps {
  children: React.ReactNode
  preview?: string
}

/**
 * Base email layout for consistent styling
 *
 * Provides:
 * - Responsive container
 * - Consistent typography
 * - Footer with branding
 *
 * @example
 * ```tsx
 * <EmailLayout preview="Verify your email">
 *   <Text>Email content here</Text>
 * </EmailLayout>
 * ```
 */
export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <Text style={{ display: 'none', overflow: 'hidden', lineHeight: 0 }}>{preview}</Text>}
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={contentStyle}>{children}</Section>

          <Hr style={dividerStyle} />

          <Text style={footerStyle}>
            {process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Starter'}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Email-safe inline styles
const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
}

const contentStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '5px',
  padding: '40px',
}

const dividerStyle: React.CSSProperties = {
  borderColor: '#e6e6e6',
  margin: '20px 0',
}

const footerStyle: React.CSSProperties = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center',
  marginTop: '20px',
}
