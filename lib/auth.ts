import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/lib/prisma'
import { admin, organization } from 'better-auth/plugins'
import { ac, defaultRole, roles } from './auth/permissions'
import { defaultOrganizationRole, orgAc, organizationRoles } from './auth/organization/permissions'

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
    }),
    organization({
      ac: orgAc,
      roles: organizationRoles,

      // Organization creation
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      creatorRole: defaultOrganizationRole,

      // Membership
      membershipLimit: 100,

      // Invitations
      // async sendInvitationEmail(data) {
      //   const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`
      //   await sendOrganizationInvitation({
      //     email: data.email,
      //     inviteLink,
      //     invitedByUsername: data.inviter.user.name,
      //     invitedByEmail: data.inviter.user.email,
      //     teamName: data.organization.name,
      //   })
      // },

      invitationExpiresIn: 60 * 60 * 48, // 48 hours
      cancelPendingInvitationsOnReInvite: true,
    })
  ]
})

type Auth = typeof auth.$Infer.Session

export type User = Auth['user']
export type Session = Auth['session']
