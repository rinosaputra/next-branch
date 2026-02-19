// app/api/test-email/route.ts
import { sendEmail } from '@/lib/email/send'
import { TestEmailPage } from './_test'

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ error: 'Only available in development' }, { status: 403 })
  }
  console.log('📧 Sending test email from API route...')
  try {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email from API Route',
      react: TestEmailPage
    })

    return Response.json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.id,
    })
  } catch (error) {
    console.error('API route email error:', error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send email'
      },
      { status: 500 }
    )
  }
}
