// app/api/test-email/_test.tsx
import { EmailLayout } from '@/lib/email/components/email-layout'
import { Text, Heading } from '@react-email/components'

export const TestEmailPage = (<EmailLayout preview="Test email" >
  <Heading className="text-2xl font-bold"> Test Email</Heading >
  <Text className="text-base" >
    This is a test email sent from Next.js API route.
  </Text>
</EmailLayout>)
