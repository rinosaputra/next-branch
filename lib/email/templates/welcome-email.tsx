import * as React from 'react'
import { EmailLayout } from '@/lib/email/components/email-layout'
import { Heading, Text, Button, Section, Hr, Link } from '@react-email/components'

interface WelcomeEmailProps {
  userName: string
  dashboardUrl: string
}

const features = [
  'Manage your account settings and preferences',
  'Access all features with your verified email',
  'Collaborate with team members in real-time',
  'Track activity and monitor progress',
]

const helpResources = [
  {
    name: '📚 Documentation',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/docs`,
    description: 'Learn how to use all features',
  },
  {
    name: '🎓 Tutorials',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/tutorials`,
    description: 'Step-by-step guides for common tasks',
  },
  {
    name: '💬 Support',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
    description: 'Get help from our team',
  },
]

export function WelcomeEmail({ userName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}! 🎉`}>
      <Section className="space-y-4">
        {/* Hero Section */}
        <Section className="text-center mb-6">
          <Text className="text-4xl mb-2">🎉</Text>
          <Heading className="text-2xl font-bold text-gray-900 mb-2">
            Welcome aboard, {userName}!
          </Heading>
          <Text className="text-base text-gray-600">
            Your email is verified. Let's get you started!
          </Text>
        </Section>

        {/* Success Confirmation */}
        <Section className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
          <Text className="text-sm text-green-900 font-semibold mb-1">
            ✓ Email Verified Successfully
          </Text>
          <Text className="text-sm text-green-800 leading-5 m-0">
            Your account is now fully activated and ready to use.
          </Text>
        </Section>

        {/* Quick Start Guide */}
        <Section className="bg-gray-50 p-6 rounded-lg border border-gray-200 my-6">
          <Heading className="text-lg font-semibold text-gray-900 mb-4">
            🚀 Quick Start Guide
          </Heading>

          <Section className="space-y-4">
            {/* Step 1 */}
            <Section className="flex items-start">
              <Text className="inline-block min-w-7 h-7 bg-black text-white rounded-full text-center font-bold mr-3 shrink-0 leading-7 m-0">
                1
              </Text>
              <Section>
                <Text className="text-sm font-semibold text-gray-900 m-0 mb-1">
                  Complete your profile
                </Text>
                <Text className="text-sm text-gray-600 m-0">
                  Add your details to personalize your experience
                </Text>
              </Section>
            </Section>

            {/* Step 2 */}
            <Section className="flex items-start">
              <Text className="inline-block min-w-7 h-7 bg-black text-white rounded-full text-center font-bold mr-3 shrink-0 leading-7 m-0">
                2
              </Text>
              <Section>
                <Text className="text-sm font-semibold text-gray-900 m-0 mb-1">
                  Explore the dashboard
                </Text>
                <Text className="text-sm text-gray-600 m-0">
                  Discover features and customize your workspace
                </Text>
              </Section>
            </Section>

            {/* Step 3 */}
            <Section className="flex items-start">
              <Text className="inline-block min-w-7 h-7 bg-black text-white rounded-full text-center font-bold mr-3 shrink-0 leading-7 m-0">
                3
              </Text>
              <Section>
                <Text className="text-sm font-semibold text-gray-900 m-0 mb-1">
                  Invite your team
                </Text>
                <Text className="text-sm text-gray-600 m-0">
                  Collaborate with colleagues and start working together
                </Text>
              </Section>
            </Section>
          </Section>
        </Section>

        {/* Primary CTA */}
        <Section className="text-center my-8">
          <Button
            href={dashboardUrl}
            className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-base no-underline inline-block w-full text-center"
          >
            Go to Dashboard →
          </Button>
        </Section>

        <Hr className="border-gray-300 my-6" />

        {/* Key Features */}
        <Section className="my-6">
          <Heading className="text-base font-semibold text-gray-900 mb-4">
            What you can do with {process.env.NEXT_PUBLIC_APP_NAME}
          </Heading>

          <Section className="space-y-3">
            {features.map((feature, index) => (
              <Text key={index} className="text-sm text-gray-700 m-0">
                <strong className="text-gray-900">✓</strong> {feature}
              </Text>
            ))}
          </Section>
        </Section>

        <Hr className="border-gray-300 my-6" />

        {/* Help & Resources */}
        <Section className="my-6">
          <Heading className="text-base font-semibold text-gray-900 mb-3">
            Need help getting started?
          </Heading>

          <Text className="text-sm text-gray-600 leading-6">
            We're here to help you succeed. Check out these resources:
          </Text>

          <Section className="mt-3 space-y-2">
            {helpResources.map((resource, index) => (
              <Text key={index} className="text-sm m-0">
                <Link href={resource.url} className="text-blue-600 no-underline hover:underline">
                  {resource.name}
                </Link>
                {' - '}
                {resource.description}
              </Text>
            ))}
          </Section>
        </Section>

        <Hr className="border-gray-300 my-6" />

        {/* Footer Message */}
        <Section className="mt-8 pt-6 border-t border-gray-200">
          <Text className="text-sm text-gray-600 text-center leading-6">
            Thanks for choosing {process.env.NEXT_PUBLIC_APP_NAME}!
            <br />
            We're excited to have you on board.
          </Text>

          <Text className="text-xs text-gray-500 text-center mt-4">
            Questions? Reply to this email or contact us at{' '}
            <Link href="mailto:support@example.com" className="text-blue-600 no-underline">
              support@example.com
            </Link>
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  )
}
