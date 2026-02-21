# 🏢 feature/organization-workspace

**Multi-tenancy foundation with organization/workspace management, member invitations, and team support.**

This branch extends `feature/dashboard-foundation` with Better Auth's Organization Plugin to enable **B2B SaaS multi-tenancy patterns**. Users can create organizations, invite team members, assign roles, and manage workspaces—essential for enterprise applications.

---

## 🎯 Branch Purpose

This branch demonstrates:

- ✅ **Organization/Workspace Management** – Create, update, delete organizations
- ✅ **Member Management** – Invite, remove, and manage member roles
- ✅ **Invitation System** – Email-based invitations with accept/reject flows
- ✅ **Active Organization Switching** – User can belong to multiple organizations
- ✅ **Organization-Scoped RBAC** – Permissions per organization
- ✅ **Team Support (Optional)** – Nested team structure within organizations
- ✅ **Dynamic Role Creation** – Create custom roles at runtime

**Use Case:** Multi-tenant SaaS platforms where users collaborate in shared workspaces (e.g., Linear, Vercel, Notion, GitHub).

---

## 🏗️ Architecture Overview

### **Branch Evolution**

```
default (pure Next.js baseline)
  └── feature/shadcn-setup (UI primitives)
       └── feature/better-auth-rbac (authentication + RBAC)
            └── feature/tanstack-query (server state management)
                 └── feature/form-validation (React Hook Form + Zod)
                      └── feature/tanstack-table (data tables)
                           └── feature/dashboard-foundation (complete dashboard)
                                └── feature/organization-workspace ← THIS BRANCH
```

**This branch adds:**
- Better Auth Organization Plugin (server + client)
- Organization database schema (Prisma)
- Organization management UI
- Member & invitation workflows
- Organization switcher component
- Organization-scoped permissions

---

## 📦 Tech Stack

### **Core Dependencies**

- **Better Auth 1.4.18** – Organization Plugin (multi-tenancy)
- **Prisma 7.4.0** – Organization/member/invitation schema
- **TanStack Query 5.90.21** – Organization state management
- **React Hook Form 7.71.2** – Organization forms
- **Zod 4.3.6** – Validation schemas
- **Resend** – Email invitation delivery (recommended)
- **shadcn/ui** – Organization UI components

### **Better Auth Organization Plugin Features**

```typescript
✅ Organization CRUD operations
✅ Member management (invite, remove, update roles)
✅ Email-based invitation system
✅ Active organization tracking (session-based)
✅ Resource-based permissions (RBAC integration)
✅ Team support (optional nested structure)
✅ Dynamic role creation (runtime)
✅ 20+ lifecycle hooks (audit trail ready)
✅ Full TypeScript support
✅ Customizable schema (additional fields)
```

**Why Better Auth Organization Plugin:**
- Production-tested by real companies
- Seamless integration with existing Better Auth
- Saves 2-3 weeks of custom development
- Extensible via hooks and custom permissions
- No vendor lock-in (self-hosted, open-source)

---

## 📁 Directory Structure

```
feature/organization-workspace/
├── app/
│   ├── dashboard/
│   │   ├── organizations/                    # Organization management
│   │   │   ├── page.tsx                      # Organizations list
│   │   │   ├── create/page.tsx               # Create organization
│   │   │   ├── [slug]/                       # Organization detail
│   │   │   │   ├── page.tsx                  # Overview
│   │   │   │   ├── settings/page.tsx         # Organization settings
│   │   │   │   ├── members/page.tsx          # Member management
│   │   │   │   └── teams/page.tsx            # Team management (optional)
│   │   │   └── accept-invitation/[id]/       # Accept invitation page
│   │   │       └── page.tsx
│   │   └── ... (existing dashboard pages)
│   └── ... (existing app structure)
│
├── components/
│   ├── organization/                         # Organization-specific components
│   │   ├── organization-switcher.tsx         # Workspace switcher (header)
│   │   ├── create-organization-form.tsx      # Create form
│   │   ├── organization-settings-form.tsx    # Settings form
│   │   ├── member-list.tsx                   # Members table
│   │   ├── invite-member-dialog.tsx          # Invitation dialog
│   │   ├── pending-invitations.tsx           # Pending invites list
│   │   └── team-components/                  # Team-related components (optional)
│   └── ... (existing components)
│
├── lib/
│   ├── auth.ts                               # ✅ Updated: Organization plugin config
│   ├── auth-client.ts                        # ✅ Updated: Organization client plugin
│   └── email/                                # Email service (Resend)
│       ├── templates/                        # Email templates
│       │   └── organization-invitation.tsx   # Invitation email
│       └── send-invitation.ts                # Email sending logic
│
├── hooks/
│   ├── use-active-organization.ts            # Active organization hook
│   ├── use-organization-permission.ts        # Organization-scoped permissions
│   └── ... (existing hooks)
│
├── prisma/
│   └── schema.prisma                         # ✅ Updated: Organization tables
│
├── .env.example                              # ✅ Updated: Resend API key
└── README.md                                 # This file
```

---

## 🚀 Getting Started

### **Prerequisites**

All prerequisites from `feature/dashboard-foundation` plus:
- Email provider account (Resend recommended)

### **1. Switch to Branch**

```bash
git checkout feature/organization-workspace
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Environment Setup**

Update `.env` file:

```env
# Existing variables from dashboard-foundation
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"

# New: Email Provider (Resend)
RESEND_API_KEY="re_..."        # Get from resend.com
FROM_EMAIL="noreply@yourdomain.com"
```

**Get Resend API Key:**
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use test mode)
3. Generate API key from dashboard

### **4. Database Migration**

```bash
# Generate new organization tables
npx prisma migrate dev --name add-organization-tables

# Or generate schema
npx prisma generate
```

**New Tables Added:**
- `organization` – Organization metadata
- `member` – User-organization relationships
- `invitation` – Pending invitations
- `team` (optional) – Team structure
- `teamMember` (optional) – Team memberships
- `organizationRole` (optional) – Dynamic roles

**Modified Tables:**
- `session` – Added `activeOrganizationId` and `activeTeamId`

### **5. Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### **6. Test Organization Flow**

1. **Create Organization:**
   - Navigate to `/dashboard/organizations`
   - Click "Create Organization"
   - Fill in name and slug
   - You become the owner automatically

2. **Invite Member:**
   - Go to organization settings → Members
   - Click "Invite Member"
   - Enter email and role
   - Member receives invitation email

3. **Accept Invitation:**
   - Member clicks link in email
   - Redirects to `/accept-invitation/[id]`
   - Member joins organization

4. **Switch Organization:**
   - Click organization switcher (header)
   - Select different organization
   - Active organization changes

---

## 🎨 Features Overview

### **1. Organization Management**

**Organizations List (`/dashboard/organizations`)**
- View all user's organizations
- Create new organization
- Quick access to settings
- Active organization indicator

**Organization Detail (`/dashboard/organizations/[slug]`)**
- Organization overview dashboard
- Member count, activity stats
- Quick actions (settings, invite, leave)

**Organization Settings (`/dashboard/organizations/[slug]/settings`)**
- Update name, slug, logo
- Organization metadata
- Delete organization (owner only)

### **2. Member Management**

**Members Page (`/dashboard/organizations/[slug]/members`)**
- List all organization members
- Search and filter members
- Member roles displayed
- Quick actions per member (edit role, remove)

**Invite Member (Dialog)**
- Email input with validation
- Role selection (owner, admin, member, custom roles)
- Optional team assignment
- Resend invitation option

**Member Roles (Default):**
- **Owner** – Full control (creator, cannot leave)
- **Admin** – Manage members, update settings (cannot delete org)
- **Member** – Read-only access

**Custom Roles:**
- Dynamic role creation (if enabled)
- Granular permission assignment
- Role templates

### **3. Invitation System**

**Invitation Flow:**
```
1. Admin invites user (email + role)
2. Invitation email sent (Resend)
3. User clicks invitation link
4. User accepts/rejects invitation
5. User becomes member (if accepted)
```

**Pending Invitations (`/dashboard/organizations/[slug]/members#invitations`)**
- List pending invitations
- Cancel invitation (by inviter)
- Resend invitation email
- Expiration tracking (48 hours default)

**Accept Invitation Page (`/accept-invitation/[id]`)**
- Display invitation details (org name, role, inviter)
- Accept button → User joins organization
- Reject button → Invitation canceled
- Expired invitation handling

### **4. Organization Switcher**

**Header Component:**
```
┌────────────────────────────────┐
│ [Logo]  [Acme Inc ▼]  [👤]    │
└────────────────────────────────┘

Dropdown:
┌─────────────────────────────┐
│ ✓ Acme Inc (Active)         │
│   Personal Workspace        │
│   Beta Corp                 │
├─────────────────────────────┤
│ + Create Organization       │
│ ⚙️ Manage Organizations     │
└─────────────���───────────────┘
```

**Features:**
- Shows all user's organizations
- Active organization indicator
- Quick organization creation
- Smooth switching (no page reload)

### **5. Teams (Optional)**

**Enable in config:**
```typescript
// lib/auth.ts
organization({
  teams: {
    enabled: true,
    maximumTeams: 10,
  }
})
```

**Team Features:**
- Create teams within organizations
- Add/remove team members
- Team-scoped permissions
- Active team switching

**Use Case:** Department structure (Engineering, Design, Marketing)

### **6. Organization-Scoped RBAC**

**Permission Checks:**
```typescript
// Server-side (page protection)
await requireOrganizationPermission("project", ["create"])

// Client-side (conditional rendering)
const { hasPermission } = useOrganizationPermission("project", ["delete"])

if (hasPermission) {
  return <DeleteButton />
}
```

**Resource-Based Permissions:**
- `organization` – update, delete
- `member` – create (invite), update (change role), delete (remove)
- `invitation` – create, cancel
- `team` – create, update, delete (if teams enabled)
- Custom resources (e.g., `project`, `sale`, `analytics`)

**Permission Scoping:**
- User can be **admin** in Organization A
- User can be **member** in Organization B
- Permissions isolated per organization

---

## 🔐 RBAC Integration

### **Extending Permissions**

```typescript
// lib/auth/organization-permissions.ts
import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/organization/access"

// Define custom resources
const statement = {
  ...defaultStatements, // organization, member, invitation
  project: ["create", "update", "delete", "share"],
  analytics: ["read", "export"],
  billing: ["read", "update"],
} as const

export const ac = createAccessControl(statement)

// Define custom roles
export const member = ac.newRole({
  project: ["create"],
  analytics: ["read"],
})

export const admin = ac.newRole({
  project: ["create", "update", "delete"],
  analytics: ["read", "export"],
  ...adminAc.statements, // Include default admin permissions
})

export const owner = ac.newRole({
  project: ["create", "update", "delete", "share"],
  analytics: ["read", "export"],
  billing: ["read", "update"],
  // Owner has all permissions
})
```

**Apply to Plugin:**
```typescript
// lib/auth.ts
import { ac, owner, admin, member } from "./auth/organization-permissions"

export const auth = betterAuth({
  plugins: [
    organization({
      ac,
      roles: { owner, admin, member },
    }),
  ],
})
```

### **Dynamic Roles (Advanced)**

```typescript
// Enable dynamic role creation
organization({
  ac,
  roles: { owner, admin, member },
  dynamicAccessControl: {
    enabled: true,
    maximumRolesPerOrganization: 10,
  }
})
```

**Create role at runtime:**
```typescript
await authClient.organization.createRole({
  role: "project-manager",
  permission: {
    project: ["create", "update"],
    analytics: ["read"],
  }
})
```

**Use Case:** Custom roles per organization (e.g., "Sales Manager", "Support Agent")

---

## 📧 Email Configuration

### **Resend Setup (Recommended)**

```bash
npm install resend
```

```typescript
// lib/email/send-invitation.ts
import { Resend } from 'resend'
import { OrganizationInvitationEmail } from './templates/organization-invitation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrganizationInvitation(data: {
  email: string
  inviteLink: string
  invitedByUsername: string
  invitedByEmail: string
  teamName: string
}) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: data.email,
    subject: `You've been invited to join ${data.teamName}`,
    react: OrganizationInvitationEmail(data),
  })
}
```

**Email Template (React Email):**
```tsx
// lib/email/templates/organization-invitation.tsx
export function OrganizationInvitationEmail({
  invitedByUsername,
  teamName,
  inviteLink,
}: {
  invitedByUsername: string
  teamName: string
  inviteLink: string
}) {
  return (
    <div>
      <h1>{invitedByUsername} invited you to {teamName}</h1>
      <p>Click the button below to accept the invitation:</p>
      <a href={inviteLink}>Accept Invitation</a>
    </div>
  )
}
```

**Configure Plugin:**
```typescript
// lib/auth.ts
import { sendOrganizationInvitation } from './email/send-invitation'

export const auth = betterAuth({
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`
        await sendOrganizationInvitation({
          email: data.email,
          inviteLink,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
        })
      },
    }),
  ],
})
```

---

## 🧪 Testing Checklist

### **Organization Management**
- [ ] Create organization (becomes owner)
- [ ] Update organization (name, slug, logo)
- [ ] Delete organization (owner only, confirms)
- [ ] Cannot delete if not owner
- [ ] Organization slug is unique
- [ ] Organization list shows all user's orgs

### **Member Management**
- [ ] Invite member (email sent)
- [ ] Accept invitation (becomes member)
- [ ] Reject invitation (invitation canceled)
- [ ] Cancel invitation (by inviter)
- [ ] Remove member (permission check)
- [ ] Update member role (admin only)
- [ ] Cannot remove owner
- [ ] Owner cannot leave organization

### **Invitation System**
- [ ] Invitation email delivered
- [ ] Invitation link works
- [ ] Expired invitation shows error
- [ ] Duplicate invitation handling
- [ ] Resend invitation works
- [ ] Email verification required (if enabled)

### **Organization Switching**
- [ ] Switch organization (UI updates)
- [ ] Active organization persists
- [ ] Permissions change per organization
- [ ] Sidebar shows correct organization

### **RBAC**
- [ ] Owner has all permissions
- [ ] Admin can manage members
- [ ] Member has read-only access
- [ ] Custom permissions work
- [ ] Permission checks prevent unauthorized actions

### **Teams (Optional)**
- [ ] Create team
- [ ] Add team member
- [ ] Remove team member
- [ ] Delete team
- [ ] Active team switching

---

## 🔧 Configuration Options

### **Organization Plugin Options**

```typescript
// lib/auth.ts
organization({
  // Who can create organizations
  allowUserToCreateOrganization: true, // or function

  // Max organizations per user
  organizationLimit: 5, // or function

  // Creator's default role
  creatorRole: "owner", // or "admin"

  // Max members per organization
  membershipLimit: 100,

  // Invitation expiration (seconds)
  invitationExpiresIn: 60 * 60 * 48, // 48 hours

  // Cancel pending invites on re-invite
  cancelPendingInvitationsOnReInvite: false,

  // Max invitations per user
  invitationLimit: 100, // or function

  // Require email verification before accepting
  requireEmailVerificationOnInvitation: false,

  // Teams configuration
  teams: {
    enabled: false,
    maximumTeams: 10, // or function
    maximumMembersPerTeam: 50, // or function
    allowRemovingAllTeams: false,
  },

  // Dynamic role creation
  dynamicAccessControl: {
    enabled: false,
    maximumRolesPerOrganization: 10, // or function
  },

  // Prevent organization deletion
  disableOrganizationDeletion: false,

  // Lifecycle hooks (20+ hooks available)
  organizationHooks: {
    beforeCreateOrganization: async ({ organization, user }) => {
      // Custom logic before org creation
    },
    afterCreateOrganization: async ({ organization, member, user }) => {
      // Setup default resources, send notifications
    },
    beforeAddMember: async ({ member, user, organization }) => {
      // Validate membership, check limits
    },
    afterAddMember: async ({ member, user, organization }) => {
      // Send welcome email, grant access
    },
    // ... 18 more hooks
  },
})
```

### **Custom Schema Fields**

```typescript
// lib/auth.ts
organization({
  schema: {
    organization: {
      fields: {
        name: "title", // Rename field
      },
      additionalFields: {
        // Add custom fields
        billingEmail: {
          type: "string",
          required: false,
          input: true, // Accept in API
        },
        plan: {
          type: "string",
          defaultValue: "free",
        },
        stripeCustomerId: {
          type: "string",
          required: false,
        },
      },
    },
    member: {
      additionalFields: {
        // Track member activity
        lastActiveAt: {
          type: "date",
          required: false,
        },
      },
    },
  },
})
```

**Infer on Client:**
```typescript
// lib/auth-client.ts
import { inferOrgAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
})

// Now TypeScript knows about custom fields
await authClient.organization.create({
  name: "Acme Inc",
  slug: "acme",
  billingEmail: "billing@acme.com", // ✅ Type-safe
})
```

---

## 🎯 Use Cases

### **1. B2B SaaS Platform**

**Example:** Project management tool (Linear, Asana)

```
User → Creates "Acme Inc" organization
     → Invites team members
     → Creates projects (organization-scoped)
     → Manages billing per organization
```

### **2. Agency/Client Portal**

**Example:** Design agency with multiple clients

```
Agency → Creates organization per client
       → Adds client to organization
       → Client can view their projects
       → Agency manages all clients
```

### **3. Multi-Tenant SaaS**

**Example:** CRM with team workspaces

```
Company → Creates workspace
        → Invites sales team
        → Each member sees company data only
        → Admin manages users & billing
```

### **4. Educational Platform**

**Example:** Online course platform

```
Institution → Creates organization
            → Adds instructors (admin role)
            → Adds students (member role)
            → Course content is organization-scoped
```

---

## 📊 Master Prompt Alignment

| Principle                        | Implementation                        |
| -------------------------------- | ------------------------------------- |
| **"Modular but not fragmented"** | ✅ Organization plugin = single module |
| **"Opinionated but extensible"** | ✅ Default roles + custom permissions  |
| **"Minimal but powerful"**       | ✅ Essential features, no bloat        |
| **"No unnecessary bloat"**       | ✅ Better Auth plugin (battle-tested)  |
| **"Clean integration"**          | ✅ Extends existing auth seamlessly    |

**This branch demonstrates:**
- How to add multi-tenancy without rebuilding auth
- How to extend RBAC to organization-scoped permissions
- How to integrate email invitations cleanly
- How to structure B2B SaaS features

---

## 🔀 Integration Path

This branch builds on `feature/dashboard-foundation`:

```bash
# Base: Dashboard with user management
feature/dashboard-foundation
  ├── Better Auth (user auth + RBAC)
  ├── TanStack Query (data fetching)
  ├── TanStack Table (user table)
  └── User CRUD operations

# This branch adds:
feature/organization-workspace
  ├── Better Auth Organization Plugin
  ├── Organization CRUD operations
  ├── Member management
  ├── Invitation system
  └── Organization-scoped permissions
```

**Merge Strategy:**
```bash
# Test thoroughly in this branch
npm run build
npm run type-check

# Merge to dev for integration testing
git checkout dev
git merge feature/organization-workspace --no-ff

# After validation, merge to main
git checkout main
git merge dev --no-ff
```

---

## 🚧 Known Limitations

### **Current State**

✅ **Production-Ready:**
- Organization CRUD
- Member management
- Invitation system
- Active organization switching
- Organization-scoped RBAC
- Email delivery (Resend)

⚠️ **Not Implemented (Future):**
- Billing per organization (Stripe integration)
- Organization analytics dashboard
- Advanced audit trail (activity log)
- Webhooks (external integrations)
- Multi-language support (i18n)

### **Better Auth Plugin Limitations**

- Email provider required (cannot invite without email)
- Invitation link expires (48 hours default, configurable)
- Session-based active organization (not per-tab)
- Dynamic roles limited by `maximumRolesPerOrganization`

**Workarounds available** – see plugin documentation for hooks and custom implementations.

---

## 📚 Additional Resources

### **Better Auth Documentation**
- [Organization Plugin](https://www.better-auth.com/docs/plugins/organization)
- [Admin Plugin](https://www.better-auth.com/docs/plugins/admin) (user management)
- [Access Control](https://www.better-auth.com/docs/plugins/access)

### **Email Providers**
- [Resend](https://resend.com) (recommended for Next.js)
- [SendGrid](https://sendgrid.com) (alternative)
- [React Email](https://react.email) (template framework)

### **Reference Implementations**
- Linear (workspaces + teams)
- Vercel (teams + projects)
- GitHub (organizations + teams)
- Notion (workspaces + pages)

---

## 🤝 Contributing

This branch is part of the **next-branch** open-source initiative.

**How to contribute:**
1. Fork the repository
2. Create a feature branch from `feature/organization-workspace`
3. Make your changes
4. Submit a pull request with clear description

**What we look for:**
- Architectural improvements
- Bug fixes
- Performance optimizations
- Documentation improvements
- Better Auth plugin enhancements

**What we avoid:**
- UI component variants (not a UI library)
- Package bloat (justify every dependency)
- Breaking changes without discussion
- Non-standard patterns

---

## 📜 License

MIT License - See [LICENSE](../LICENSE) file for details

---

## 🙏 Acknowledgments

Built with:
- [Better Auth](https://www.better-auth.com) – Modern authentication
- [Next.js](https://nextjs.org) – React framework
- [Prisma](https://www.prisma.io) – Database ORM
- [TanStack Query](https://tanstack.com/query) – Data fetching
- [Resend](https://resend.com) – Email delivery
- [shadcn/ui](https://ui.shadcn.com) – UI components

Inspired by multi-tenancy patterns from Linear, Vercel, GitHub, and Notion.

---

**This is production-grade multi-tenancy foundation.**
**Built with discipline. Designed for scale.**

🏢 Opinionated | 🔐 Secure | 🚀 Production-Ready | 🔥 Extensible

---

## 📞 Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/rinosaputra/next-branch/issues)
- **Discussions:** [Ask questions, share ideas](https://github.com/rinosaputra/next-branch/discussions)
- **Pull Requests:** [Contribute improvements](https://github.com/rinosaputra/next-branch/pulls)

---

**Branch Status:** 🟢 Active Development
**Merge Target:** `dev` → `main`
**Production Ready:** ⚠️ Requires email provider setup

---

*Last Updated: 2025-02-21*
*Next.js Version: 16.1.6*
*Better Auth Version: 1.4.18*
