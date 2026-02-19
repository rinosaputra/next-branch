// / lib/email/send.ts
import { resend } from './client'
import * as React from 'react'
import { render } from '@react-email/render'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html?: string
  react?: React.ReactElement
}

interface SendEmailResult {
  success: boolean
  id?: string
}

/**
 * Send email via Resend
 *
 * Supports both HTML strings and React Email components
 *
 * @param options - Email options
 * @returns Result with success status and email ID
 *
 * @example HTML
 * ```ts
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome',
 *   html: '<h1>Hello</h1>',
 * })
 * ```
 *
 * @example React Email Component
 * ```ts
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome',
 *   react: <VerificationEmail name="John" url="..." />,
 * })
 * ```
 */
export async function sendEmail({
  to,
  subject,
  html,
  react,
}: SendEmailOptions): Promise<SendEmailResult> {
  // Convert React component to HTML if provided
  let emailHtml = html
  if (react && !html) {
    emailHtml = await render(react)
  }

  // Skip email sending in development (log to console instead)
  if (process.env.SKIP_EMAIL_SENDING === 'true') {
    console.log('📧 Email (skipped in dev)')
    console.log('To:', Array.isArray(to) ? to.join(', ') : to)
    console.log('Subject:', subject)
    if (emailHtml) console.log('HTML Content:', emailHtml.substring(0, 100) + '...')
    if (react) {
      // @ts-ignore
      const componentName = react.type?.name || react.type?.displayName || 'React component'
      console.log('React Email Template:', componentName)
    }
    return { success: true, id: 'dev-mode-skipped' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      html: emailHtml,
    })

    if (error) {
      console.error('❌ Email send error:', error)
      throw new Error(error.message)
    }

    console.log('✅ Email sent successfully:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    throw error
  }
}
