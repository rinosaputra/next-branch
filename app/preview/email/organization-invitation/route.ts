// app/preview/email/organization-invitation/route.ts
import { OrganizationInvitationEmail } from '@/lib/email/emplates/organization-invitation'
import { render } from '@react-email/render'

/**
 * Email Preview: Organization Invitation Email
 *
 * Development-only route to preview organization invitation email template in browser.
 * Renders actual React Email component with sample data.
 *
 * Usage: http://localhost:3000/preview/email/organization-invitation
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

  // Render React Email component to HTML
  const emailHtml = await render(
    OrganizationInvitationEmail({
      invitedByUsername: "John Doe",
      invitedByEmail: "john@example.com",
      teamName: "Acme Inc",
      inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/abc123`,
      organizationRole: "Member",
      organizationLogo: "https://via.placeholder.com/150?text=Acme+Logo",
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
