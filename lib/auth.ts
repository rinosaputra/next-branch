import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/lib/prisma'
import { admin } from 'better-auth/plugins'
import { ac, defaultRole, roles } from './auth/permissions'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac,
      roles,
      defaultRole,
      adminUserIds: process.env.BETTER_AUTH_ADMIN_IDS?.split(",") || []
    })
  ]
})

type Auth = typeof auth.$Infer.Session

export type User = Auth['user']
export type Session = Auth['session']
