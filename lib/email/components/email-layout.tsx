import * as React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Tailwind,
} from '@react-email/components'

interface EmailLayoutProps {
  children: React.ReactNode
  preview?: string
}

/**
 * Base email layout with Tailwind CSS support
 *
 * Automatically converts Tailwind classes to inline styles
 * for email client compatibility.
 *
 * @example
 * ```tsx
 * <EmailLayout preview="Verify your email">
 *   <div className="bg-white p-10 rounded-lg">
 *     <h1 className="text-2xl font-bold text-gray-900">Hello</h1>
 *   </div>
 * </EmailLayout>
 * ```
 */
export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#000000',
                'brand-secondary': '#666666',
              },
            },
          },
        }}
      >
        {preview && (
          <Text className="hidden overflow-hidden leading-0">
            {preview}
          </Text>
        )}

        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-150 mx-auto p-5">
            <Section className="bg-white rounded-lg p-10">
              {children}
            </Section>

            <Hr className="border-gray-300 my-5" />

            <Text className="text-gray-500 text-xs text-center mt-5">
              {process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Starter'}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
