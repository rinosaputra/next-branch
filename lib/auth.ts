import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/lib/prisma'
import { sendEmail } from './email/send'
import { VerificationEmail } from './email/templates/verification-email'
import { ResetPasswordEmail } from './email/templates/reset-password-email'
import { admin } from 'better-auth/plugins'
import { ac, roles } from './auth/permissions'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,

    // Password security settings
    minPasswordLength: 8,
    maxPasswordLength: 128,

    // Email verification (optional, recommended for production)
    requireEmailVerification: process.env.NODE_ENV === 'production',

    // Password reset (CRITICAL for forgot-password flow)
    sendResetPassword: async ({ user, url }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 Sending password reset email \nto: ${user.email}\nwith URL: ${url}`) // Debug log
      }
      try {
        await sendEmail({
          to: user.email,
          subject: `Reset your password - ${process.env.NEXT_PUBLIC_APP_NAME}`,
          react: ResetPasswordEmail({
            userName: user.name || 'there',
            resetUrl: url,
          }),
        })
      } catch (error) {
        console.error('Failed to send password reset email:', error)
        throw new Error('Failed to send password reset email') // Throw to trigger retry logic in Better Auth
        // Don't throw - Better Auth will handle gracefully
      }
    },

    // Token expiration (1 hour for security)
    resetPasswordTokenExpiresIn: 3600,

    // Optional: Callback after successful password reset
    onPasswordReset: async ({ user }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Password reset successful for: ${user.email}`)
      }

      // Optional: Send confirmation email, log audit, etc.
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendEmail({
          to: user.email,
          subject: `Verify your email - ${process.env.NEXT_PUBLIC_APP_NAME}`,
          react: VerificationEmail({
            userName: user.name || 'there',
            verificationUrl: url,
          }),
        })
      } catch (error) {
        console.error('Failed to send verification email:', error)
        throw new Error('Failed to send verification email') // Throw to trigger retry logic in Better Auth
        // Don't throw - Better Auth will handle gracefully
      }
    },
  },
  plugins: [
    admin({
      ac,
      roles,
      defaultRole: "viewer",
      adminUserIds: []
    })
  ]
})

type Auth = typeof auth.$Infer.Session

export type User = Auth['user']
export type Session = Auth['session']
