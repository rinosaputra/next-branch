# 🚀 dev – Controlled Integration Branch

**The disciplined gateway between feature experimentation and production release**

This is the `dev` branch of **next-branch** — a **production-grade, opinionated Next.js fullstack starter architecture**. This branch serves as the **controlled integration environment** where validated feature branches are merged, tested, and stabilized before reaching `main`.

---

## 🎯 Purpose

The `dev` branch is **not** a playground.
The `dev` branch is **not** a permanent workspace.
The `dev` branch is the **integration staging environment**.

**Role in Branch Strategy:**

```
default (baseline)
  └── feature/* (isolated experimentation)
       └── dev ← CURRENT (controlled integration)
            └── main (stable production-ready)
```

**Key Principles:**

- ✅ Only merge **validated** feature branches
- ✅ Test integration compatibility here
- ✅ Stabilize before promoting to `main`
- ✅ Maintain architectural discipline
- ✅ Document all integrations

---

## 📦 Current Integrated Features

### Latest Integration State

| Feature Branch | Merge Date | Status | Description |
|----------------|------------|--------|-------------|
| `feature/dashboard-layout` | 2026-02-19 | ✅ **Active** | Modern sidebar-based dashboard layout with shadcn/ui |
| `feature/auth-ui` | 2026-02-19 | ✅ **Active** | Authentication UI (login, register, forgot password) |
| `feature/email-setup` | 2026-02-19 | ✅ **Active** | Resend email integration with React Email |
| `feature/better-auth-setup` | 2026-02-19 | ✅ **Active** | Better Auth authentication framework |
| `feature/theme-provider` | 2026-02-17 | ✅ **Active** | Dark mode support with next-themes |
| `feature/sonner` | 2026-02-17 | ✅ **Active** | Toast notification system |
| `feature/shadcn-setup` | 2026-02-17 | ✅ **Active** | shadcn/ui component system |
| `feature/prisma-setup` | 2026-02-16 | ✅ **Active** | Prisma ORM with PostgreSQL |

---

## 🧱 Current Architecture Stack

### Core Framework

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (utility-first styling)

### UI Layer

- **shadcn/ui** (minimal component primitives)
  - Sidebar, Avatar, Breadcrumb, Dropdown Menu
  - Input Group, Button, Card, Separator
  - Sheet (mobile drawer)
- **next-themes** (dark mode support)
- **Lucide Icons** (icon system)
- **Sonner** (toast notifications)

### Authentication

- **Better Auth** (type-safe authentication framework)
  - Email/password authentication
  - Session management (HTTP-only cookies)
  - CSRF protection built-in
  - Auth proxy pattern for centralized utilities
  - RBAC foundation ready

### Email Infrastructure

- **Resend** (email delivery service)
- **React Email** (email template components)
  - Verification email
  - Password reset email
  - Welcome email
  - Tailwind support for email styling

### Database

- **Prisma ORM** (type-safe database client)
- **PostgreSQL** (relational database)
  - Better Auth models (User, Session, Account)
  - Custom models ready

### Dashboard UI

- **Modern sidebar layout** (shadcn/ui sidebar primitives)
  - Collapsible navigation
  - Responsive mobile drawer
  - User menu with avatar
  - Breadcrumb navigation
  - Theme toggle integration

### Developer Experience

- **ESLint** (code quality)
- **TypeScript** (type safety)
- **Environment-based configuration** (`.env` management)
- **EditorConfig** (consistent code formatting)

---

## 📊 Integration Timeline

### Recent Merges (Last 30 commits shown)

```
2026-02-19  dev: merge dashboard-layout (cd1abf0)
            ├─ dashboard-layout: fix layout.tsx
            ├─ dashboard-layout: update nav-user type
            ├─ dashboard-layout: add shadcn avatar, breadcrumb, dropdown-menu
            ├─ dashboard-layout: init sidebar
            └─ dashboard-layout: merge sonner, shadcn-setup, theme-provider

2026-02-19  dev: merge auth-ui (7f1a1ef)
            ├─ auth-ui: update README.md
            ├─ auth-ui: update template email
            ├─ auth-ui: add preview
            ├─ auth-ui: add template email
            ├─ auth-ui: merge email-setup
            ├─ auth-ui: fix reset-password
            ├─ auth-ui: update templates with tw
            ├─ auth-ui: add chadcn input-group
            ├─ auth-ui: add forgot password
            ├─ auth-ui: add register component
            ├─ auth-ui: update fn login, add const.ts
            └─ auth-ui: merge theme-provider

2026-02-19  feature/email-setup integrated
            ├─ email-setup: add api/test-email
            ├─ email-setup: fix leading-0 on email-layout
            └─ email-setup: init tw (Tailwind for emails)

2026-02-19  feature/better-auth-setup updates
            ├─ better-auth-setup: add type auth.ts
            ├─ better-auth-setup: update proxy
            ├─ better-auth-setup: update
            └─ better-auth-setup: add proxy pattern

2026-02-17  feature/theme-provider integrated
2026-02-17  feature/sonner integrated
2026-02-17  feature/shadcn-setup integrated
2026-02-16  feature/prisma-setup integrated
```

[**View complete commit history →**](https://github.com/rinosaputra/next-branch/commits/dev)

---

## 🏗️ Current Directory Structure

```
/app
├── dashboard/                    # Protected dashboard routes
│   ├── layout.tsx               # Dashboard layout with sidebar
│   └── page.tsx                 # Dashboard home page
├── login/                       # Login page
├── register/                    # Registration page
├── forgot-password/             # Password reset page
└── api/
    ├── auth/[...all]/           # Better Auth API routes
    └── test-email/              # Email testing endpoint

/components
├── dashboard/                    # Dashboard-specific components
│   ├── app-sidebar.tsx          # Main sidebar navigation
│   ├── site-header.tsx          # Dashboard header with breadcrumb
│   ├── nav-user.tsx             # User navigation menu
│   └── theme-toggle.tsx         # Dark mode toggle
├── auth/                        # Authentication forms
│   ├── login-form.tsx           # Login form
│   ├── register-form.tsx        # Registration form
│   └── forgot-password-form.tsx # Password reset form
└── ui/                          # shadcn/ui components
    ├── sidebar.tsx              # Sidebar primitive
    ├── avatar.tsx               # Avatar component
    ├── breadcrumb.tsx           # Breadcrumb navigation
    ├── dropdown-menu.tsx        # Dropdown menu
    └── [other primitives]       # Button, Card, Input, etc.

/lib
├── auth.ts                      # Better Auth server config
├── auth-client.ts               # Better Auth client instance
├── auth-proxy.ts                # Authentication utility proxy
├── prisma.ts                    # Prisma client instance
├── metadata.ts                  # App metadata config
├── const.ts                     # App constants
└── email/
    ├── client.ts                # Resend client
    ├── send.ts                  # Email sending utility
    ├── components/
    │   └── email-layout.tsx     # Email layout wrapper
    └── templates/
        ├── verification-email.tsx    # Email verification
        ├── reset-password-email.tsx  # Password reset
        └── welcome-email.tsx         # Welcome email

/prisma
├── schema.prisma                # Database schema
└── migrations/                  # Database migrations

/public
└── [static assets]              # Images, fonts, etc.
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Resend API key (for email)

### Installation

```bash
# Clone repository
git clone https://github.com/rinosaputra/next-branch.git
cd next-branch

# Checkout dev branch
git checkout dev

# Install dependencies
npm install
```

### Environment Configuration

Create `.env` file:

```env
# Application
NEXT_PUBLIC_APP_NAME="Next.js Starter"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DASHBOARD_URL="/dashboard"
NEXT_PUBLIC_LOGIN_URL="/login"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/next_branch_dev"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"  # Generate: openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="onboarding@yourdomain.com"
SKIP_EMAIL_SENDING="false"  # Set to "true" for dev without email
```

### Database Setup

```bash
# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing Current Integration

### Authentication Flow

1. **Register**: `http://localhost:3000/register`
   - Create new account with email/password
   - Receives verification email (if Resend configured)

2. **Login**: `http://localhost:3000/login`
   - Sign in with credentials
   - Redirects to dashboard on success

3. **Dashboard**: `http://localhost:3000/dashboard`
   - Protected route (requires authentication)
   - Modern sidebar navigation
   - User menu with logout
   - Theme toggle (light/dark)

4. **Password Reset**: `http://localhost:3000/forgot-password`
   - Request password reset link
   - Receives email with reset token

### Email Testing

```bash
# Test email sending (dev mode)
curl http://localhost:3000/api/test-email

# Preview emails (React Email)
npm run email:dev
```

### Database Inspection

```bash
# Open Prisma Studio
npx prisma studio
```

---

## 🎨 UI Components Available

### shadcn/ui Components

| Component | Usage | Location |
|-----------|-------|----------|
| **Sidebar** | Dashboard navigation | `@/components/ui/sidebar` |
| **Avatar** | User profile display | `@/components/ui/avatar` |
| **Breadcrumb** | Page navigation trail | `@/components/ui/breadcrumb` |
| **Dropdown Menu** | User menu, actions | `@/components/ui/dropdown-menu` |
| **Button** | Primary actions | `@/components/ui/button` |
| **Input** | Form inputs | `@/components/ui/input` |
| **Input Group** | Enhanced input fields | `@/components/ui/input-group` |
| **Card** | Content containers | `@/components/ui/card` |
| **Separator** | Visual dividers | `@/components/ui/separator` |
| **Sheet** | Mobile drawer | `@/components/ui/sheet` |
| **Sonner** | Toast notifications | `sonner` |

---

## 🔐 Authentication Features

### Implemented

- ✅ Email/password registration
- ✅ Email/password login
- ✅ Session management (HTTP-only cookies)
- ✅ CSRF protection
- ✅ Password reset flow
- ✅ Email verification
- ✅ Protected routes (server-side validation)
- ✅ Auth proxy pattern (centralized utilities)
- ✅ Logout functionality

### Ready for Extension

- ⏳ OAuth providers (Google, GitHub)
- ⏳ Two-factor authentication (2FA)
- ⏳ Role-based access control (RBAC)
- ⏳ User profile management
- ⏳ Session device management

---

## 📧 Email System

### Configured Templates

| Template | Purpose | File |
|----------|---------|------|
| **Verification Email** | Email confirmation | `lib/email/templates/verification-email.tsx` |
| **Password Reset** | Reset password link | `lib/email/templates/reset-password-email.tsx` |
| **Welcome Email** | New user onboarding | `lib/email/templates/welcome-email.tsx` |

### Email Features

- ✅ Resend integration for delivery
- ✅ React Email for templates
- ✅ Tailwind styling support
- ✅ Development mode (skip sending)
- ✅ Preview mode for testing
- ✅ Type-safe template props

---

## 🎯 Integration Validation Checklist

Before promoting to `main`, ensure:

### Functionality

- [ ] Authentication flow works (register, login, logout)
- [ ] Dashboard renders correctly (sidebar, header, content)
- [ ] Email sending functions (verification, password reset)
- [ ] Dark mode toggle works
- [ ] Protected routes enforce authentication
- [ ] Session persistence across page refreshes
- [ ] Mobile responsive (sidebar drawer works)

### Technical

- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Database migrations clean
- [ ] Environment variables documented
- [ ] No console errors in browser

### Architecture

- [ ] Feature branches cleanly integrated
- [ ] No merge conflicts remaining
- [ ] Commit history clean and meaningful
- [ ] README documentation complete
- [ ] Breaking changes documented

---

## 🚧 Known Issues

### Current Limitations

None currently blocking.

### Planned Improvements

- [ ] Add dashboard analytics page
- [ ] Implement user profile editing
- [ ] Add user management CRUD
- [ ] Implement RBAC roles
- [ ] Add OAuth providers
- [ ] Add 2FA support

---

## 🧭 Branch Management

### Merging New Features

```bash
# From feature branch
git checkout feature/new-feature
git rebase dev  # Ensure up-to-date

# Switch to dev
git checkout dev
git merge feature/new-feature --no-ff

# Update README.md (add to integration table)
# Commit and push
git commit -m "dev: merge new-feature"
git push origin dev
```

### Promoting to Main

```bash
# Only when dev is stable and validated
git checkout main
git merge dev --no-ff
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags
```

---

## 📖 Documentation

### Feature Branch READMEs

Each integrated feature has detailed documentation:

- [feature/dashboard-layout](https://github.com/rinosaputra/next-branch/tree/feature/dashboard-layout)
- [feature/auth-ui](https://github.com/rinosaputra/next-branch/tree/feature/auth-ui)
- [feature/email-setup](https://github.com/rinosaputra/next-branch/tree/feature/email-setup)
- [feature/better-auth-setup](https://github.com/rinosaputra/next-branch/tree/feature/better-auth-setup)
- [feature/theme-provider](https://github.com/rinosaputra/next-branch/tree/feature/theme-provider)
- [feature/sonner](https://github.com/rinosaputra/next-branch/tree/feature/sonner)
- [feature/shadcn-setup](https://github.com/rinosaputra/next-branch/tree/feature/shadcn-setup)
- [feature/prisma-setup](https://github.com/rinosaputra/next-branch/tree/feature/prisma-setup)

### API Documentation

- [Better Auth API](https://better-auth.com/docs)
- [Resend API](https://resend.com/docs)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)
- [shadcn/ui Components](https://ui.shadcn.com)

---

## 🔥 Philosophy Reminder

> **"Modular but not fragmented."**
> **"Opinionated but extensible."**
> **"Minimal but powerful."**

The `dev` branch maintains **architectural discipline**:

- ✅ Every integration is justified
- ✅ Every merge is validated
- ✅ Every commit is meaningful
- ✅ Every feature is documented
- ✅ Every decision serves long-term scalability

This is **not** a feature dumping ground.
This is **not** a permanent experimentation space.
This is the **controlled gateway to production**.

Every change must align with:
- Long-term maintainability
- Architectural clarity
- Professional Git workflow
- Production-grade standards

---

## 🎯 Current Status

**Branch State:** 🟢 **Stable** (latest integration: `dashboard-layout`)

**Last Updated:** 2026-02-19
**Latest Commit:** `cd1abf0` - "dev: merge dashboard-layout"
**Total Integrated Features:** 8
**Ready for Main:** ⏳ Pending validation

**Next Steps:**

1. Complete integration testing
2. Validate all authentication flows
3. Test email delivery
4. Verify dashboard functionality
5. Document any breaking changes
6. Prepare for `main` promotion

---

## 📝 Contributing

### For Feature Branches

1. Branch from `dev` (not `default`)
2. Implement feature in isolation
3. Test thoroughly
4. Update feature branch README
5. Rebase on latest `dev`
6. Submit for integration review

### For Dev Branch

1. Only merge validated features
2. Test integration compatibility
3. Update this README (integration table)
4. Document breaking changes
5. Maintain clean commit history

---

## 🔗 References

- **Main Repository**: [rinosaputra/next-branch](https://github.com/rinosaputra/next-branch)
- **Commit History**: [View on GitHub](https://github.com/rinosaputra/next-branch/commits/dev)
- **Issues**: [GitHub Issues](https://github.com/rinosaputra/next-branch/issues)

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**

---

*Note: Commit history shown is limited to last 30 commits. [View complete history →](https://github.com/rinosaputra/next-branch/commits/dev)*
