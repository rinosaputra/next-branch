import { ResetPasswordEmail } from '@/lib/email/templates/reset-password-email'
import { render } from '@react-email/render'

/**
 * Email Preview: Password Reset Email
 *
 * Development-only route to preview password reset email template in browser.
 * Renders actual React Email component with sample data.
 *
 * Usage: http://localhost:3000/preview/email/reset-password
 *
 * @returns HTML rendered email template
 */
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return new Response('Preview routes only available in development', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // Sample data for preview
  const sampleData = {
    userName: 'John Doe',
    resetUrl: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/xyz789token123abc456`,
  }

  // Render React Email component to HTML
  const emailHtml = await render(
    ResetPasswordEmail({
      userName: sampleData.userName,
      resetUrl: sampleData.resetUrl,
    })
  )

  // Return HTML with proper content type
  return new Response(emailHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
