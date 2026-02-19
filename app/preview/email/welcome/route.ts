import { WelcomeEmail } from '@/lib/email/templates/welcome-email'
import { render } from '@react-email/render'

/**
 * Email Preview: Welcome Email
 *
 * Development-only route to preview welcome email template in browser.
 * Renders actual React Email component with sample data.
 *
 * Usage: http://localhost:3000/preview/email/welcome
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
    dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  }

  // Render React Email component to HTML
  const emailHtml = await render(
    WelcomeEmail({
      userName: sampleData.userName,
      dashboardUrl: sampleData.dashboardUrl,
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
