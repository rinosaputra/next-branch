# 🔐 feature/better-auth-setup

**Isolated integration branch for Better Auth authentication framework**

This branch establishes **production-grade authentication infrastructure** for the **next-branch** fullstack architecture. It integrates Better Auth with Prisma, implements session management, and provides RBAC foundation with clean architectural patterns.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It provides foundational authentication capabilities:

- **Better Auth framework** (type-safe authentication)
- **Session management** (HTTP-only cookies with CSRF protection)
- **Prisma adapter** (relational database integration)
- **RBAC foundation** (role-based access control ready)
- **Authentication utilities** (centralized auth proxy pattern)
- **Environment-based routing** (configurable dashboard/login URLs)

**This is infrastructure only.**
Authentication UI (forms, pages, flows) are implemented in feature branches that consume this (`feature/auth-ui`).

**This is not a permanent branch.**
Once validated, it will be merged into `dev` and enable authentication across all features.

---

## 📦 What's Included

### Core Dependencies

| Package                       | Version | Purpose                            |
| ----------------------------- | ------- | ---------------------------------- |
| `better-auth`                 | Latest  | Type-safe authentication framework |
| `better-auth/adapters/prisma` | Latest  | Prisma database adapter            |

### Infrastructure Components

| File                        | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| `/lib/auth.ts`              | Better Auth server configuration         |
| `/lib/auth-client.ts`       | Better Auth client instance              |
| `/lib/auth-proxy.ts`        | **Centralized authentication utilities** |
| `/prisma/schema.prisma`     | Database schema with Better Auth models  |
| `/middleware.ts` (optional) | Route protection at edge                 |

### Configuration

| Environment Variable        | Purpose                      | Required | Example                                    |
| --------------------------- | ---------------------------- | -------- | ------------------------------------------ |
| `DATABASE_URL`              | PostgreSQL connection string | Yes      | `postgresql://user:pass@localhost:5432/db` |
| `BETTER_AUTH_SECRET`        | Session encryption secret    | Yes      | Generate with `openssl rand -base64 32`    |
| `BETTER_AUTH_URL`           | Application base URL         | Yes      | `http://localhost:3000`                    |
| `NEXT_PUBLIC_DASHBOARD_URL` | Dashboard redirect URL       | Yes      | `/dashboard`                               |
| `NEXT_PUBLIC_LOGIN_URL`     | Login redirect URL           | Yes      | `/login`                                   |

---

## 🚀 Getting Started

### 1. Prerequisites

This branch requires:
- PostgreSQL database running
- Prisma configured (from `feature/prisma-setup` or manual setup)

### 2. Install Dependencies

```bash
npm install better-auth
```

### 3. Configure Environment Variables

Add to `.env`:

```env
# Database (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/next_branch_dev"

# Better Auth
BETTER_AUTH_SECRET="your-generated-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Authentication Routes
NEXT_PUBLIC_DASHBOARD_URL="/dashboard"
NEXT_PUBLIC_LOGIN_URL="/login"
```

**Generate secret:**
```bash
openssl rand -base64 32
```

### 4. Update Prisma Schema

Better Auth requires specific models:

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      Session[]
  accounts      Account[]
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  expiresAt    DateTime
  token        String   @unique
  ipAddress    String?
  userAgent    String?

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### 5. Push Schema to Database

```bash
npx prisma db push
```

### 6. Run Development Server

```bash
npm run dev
```

---

## 🧱 Architecture Details

### 1. Better Auth Server Configuration

```typescript
// lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/lib/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // 1 day
  },

  advanced: {
    cookieSecure: process.env.NODE_ENV === 'production',
  },
})
```

**Features:**
- Type-safe configuration
- Prisma adapter for database operations
- Email/password authentication enabled
- Session management with 7-day expiration
- Secure cookies in production
- CSRF protection built-in

---

### 2. Better Auth Client Instance

```typescript
// lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient
```

**Features:**
- Client-side authentication methods
- React hooks for session management
- Type-safe API calls
- Automatic CSRF token handling

---

### 3. Authentication Proxy Pattern

```typescript
// lib/auth-proxy.ts
import { authClient } from './auth-client'

/**
 * Authentication Proxy Pattern
 *
 * Provides centralized authentication utilities with type safety.
 * This is NOT Next.js Middleware/Proxy - this is a custom utility pattern.
 *
 * Purpose:
 * - Single import point for authentication operations
 * - Type-safe method access
 * - Environment-based routing configuration
 * - Consistent usage across server and client components
 *
 * @example Server Component
 * ```tsx
 * import { authProxy } from '@/lib/auth-proxy'
 *
 * const session = await authProxy.getSession()
 * if (!session) {
 *   redirect(authProxy.loginUrl)
 * }
 * ```
 *
 * @example Client Component
 * ```tsx
 * 'use client'
 * import { authProxy } from '@/lib/auth-proxy'
 *
 * const handleLogout = async () => {
 *   await authProxy.signOut()
 *   router.push(authProxy.loginUrl)
 * }
 * ```
 */
export const authProxy = {
  /**
   * Better Auth client instance
   */
  client: authClient,

  /**
   * Sign in with email and password
   */
  signIn: authClient.signIn,

  /**
   * Sign up with email and password
   */
  signUp: authClient.signUp,

  /**
   * Sign out current user
   */
  signOut: authClient.signOut,

  /**
   * Get current session (React hook - client-side only)
   */
  useSession: authClient.useSession,

  /**
   * Get current session (async - server/client)
   */
  getSession: authClient.getSession,

  /**
   * Dashboard URL (from environment)
   */
  dashboardUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL || '/dashboard',

  /**
   * Login URL (from environment)
   */
  loginUrl: process.env.NEXT_PUBLIC_LOGIN_URL || '/login',
} as const

export type AuthProxy = typeof authProxy
```

---

## 🔍 Naming Clarification

### `lib/auth-proxy.ts` (Authentication Utility Pattern)

This is **NOT** Next.js Middleware (formerly called Proxy in Next.js 16). This is a **custom authentication utility pattern** that provides:

- ✅ Centralized authentication API
- ✅ Type-safe method access
- ✅ Environment-based routing
- ✅ Consistent usage across components

```typescript
import { authProxy } from '@/lib/auth-proxy'

// Use in components:
await authProxy.signIn.email({ email, password })
router.push(authProxy.dashboardUrl)
```

### `middleware.ts` (Next.js Route Protection)

This is the **Next.js framework feature** for:

- ✅ Route protection at edge
- ✅ Request/response modification
- ✅ Redirects before page render

```typescript
// middleware.ts (optional - create if needed)
export function middleware(request: NextRequest) {
  // Protect routes at edge
}
```

**Two different concepts, two different purposes.**

---

## 🎯 Usage Examples

### Server Component (Protected Route)

```tsx
// app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { authProxy } from '@/lib/auth-proxy'

export default async function DashboardPage() {
  const session = await authProxy.getSession()

  if (!session) {
    redirect(authProxy.loginUrl)
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
    </div>
  )
}
```

**Benefits:**
- ✅ Single import (`authProxy`)
- ✅ Type-safe session check
- ✅ Environment-based redirect
- ✅ No hardcoded URLs

---

### Client Component (Login Form)

```tsx
// components/auth/login-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authProxy } from '@/lib/auth-proxy'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await authProxy.signIn.email({
      email,
      password,
    })

    if (result.error) {
      console.error('Login failed:', result.error)
      return
    }

    // Redirect to dashboard after successful login
    router.push(authProxy.dashboardUrl)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  )
}
```

---

### Client Component (User Menu)

```tsx
// components/dashboard/user-menu.tsx
'use client'

import { useRouter } from 'next/navigation'
import { authProxy } from '@/lib/auth-proxy'

export function UserMenu() {
  const router = useRouter()
  const { data: session } = authProxy.useSession()

  const handleLogout = async () => {
    await authProxy.signOut()
    router.push(authProxy.loginUrl)
  }

  return (
    <div>
      <p>Logged in as: {session?.user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

---

### Middleware (Optional Route Protection)

```typescript
// middleware.ts (create if edge protection needed)
import { NextRequest, NextResponse } from 'next/server'
import { authClient } from '@/lib/auth-client'

export async function middleware(request: NextRequest) {
  const session = await authClient.getSession({
    headers: request.headers,
  })

  const pathname = request.nextUrl.pathname
  const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL || '/login'
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || '/dashboard'

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL(loginUrl, request.url))
    }
  }

  // Redirect authenticated users away from login
  if (pathname === loginUrl && session) {
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
```

---

## 🛡️ Security Features

### Built-in Security

✅ **Password hashing** – Automatic bcrypt hashing
✅ **CSRF protection** – Token validation on all mutations
✅ **HTTP-only cookies** – Session tokens not accessible via JavaScript
✅ **Secure cookies** – HTTPS-only in production
✅ **Session expiration** – 7-day expiration with 1-day update age
✅ **Token validation** – Cryptographically secure tokens
✅ **Database transactions** – Atomic operations via Prisma

### Production Configuration

```typescript
// Production best practices
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7,    // 7 days
    updateAge: 60 * 60 * 24,        // Update every day
  },

  advanced: {
    cookieSecure: true,              // HTTPS only
    sameSite: 'lax',                 // CSRF protection
  },

  emailAndPassword: {
    minPasswordLength: 8,            // Minimum 8 characters
    requireEmailVerification: true,  // Email verification required
  },
})
```

---

## 🔗 Integration Points

This branch provides authentication infrastructure for:

| Consumer                   | Purpose                                |
| -------------------------- | -------------------------------------- |
| `feature/auth-ui`          | Login, register, forgot password forms |
| `feature/dashboard-layout` | Protected dashboard routes             |
| `feature/user-management`  | User CRUD operations                   |
| `feature/admin-panel`      | Admin-only routes with RBAC            |

**Pattern:**
```
feature/better-auth-setup (infrastructure)
  └── Provides: authProxy, session management, RBAC foundation

feature/auth-ui (consumer)
  ├── Uses: authProxy.signIn, authProxy.signUp
  ├── Creates: Login/register forms
  └── Implements: Email verification flow

feature/dashboard-layout (consumer)
  ├── Uses: authProxy.getSession, authProxy.dashboardUrl
  ├── Creates: Protected layout wrapper
  └── Implements: User menu with logout
```

---

## 🛠️ API Reference

### `authProxy` Methods

#### Client-Side Methods

```typescript
// Sign in with email/password
await authProxy.signIn.email({
  email: 'user@example.com',
  password: 'password123',
})

// Sign up with email/password
await authProxy.signUp.email({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
})

// Sign out
await authProxy.signOut()

// Get session (React hook)
const { data: session, isPending } = authProxy.useSession()
```

#### Server-Side Methods

```typescript
// Get session in Server Component
const session = await authProxy.getSession()

// Get session in API Route
const session = await authProxy.getSession({
  headers: request.headers,
})
```

#### Environment-Based URLs

```typescript
// Dashboard URL (from NEXT_PUBLIC_DASHBOARD_URL)
authProxy.dashboardUrl  // → '/dashboard'

// Login URL (from NEXT_PUBLIC_LOGIN_URL)
authProxy.loginUrl      // → '/login'
```

---

## 📊 Environment Variables Reference

### Required Variables

```env
# Database connection
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Better Auth configuration
BETTER_AUTH_SECRET="your-generated-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Authentication routes
NEXT_PUBLIC_DASHBOARD_URL="/dashboard"
NEXT_PUBLIC_LOGIN_URL="/login"
```

### Optional Variables

```env
# Application name (for branding)
NEXT_PUBLIC_APP_NAME="Next.js Starter"

# Application URL (for absolute URLs)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🧪 Testing

### Manual Testing

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'

# Test login
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Test session
curl http://localhost:3000/api/auth/session \
  -H "Cookie: better-auth.session_token=<token>"
```

---

## 🚧 Current State

### ✅ Completed (Infrastructure)
- [x] Better Auth framework installed
- [x] Prisma adapter configured
- [x] Session management implemented
- [x] Email/password authentication enabled
- [x] Server configuration (`/lib/auth.ts`)
- [x] Client configuration (`/lib/auth-client.ts`)
- [x] Authentication proxy pattern (`/lib/auth-proxy.ts`)
- [x] Environment-based routing
- [x] Database schema updated
- [x] Security best practices implemented

### 🔄 Not Included (Feature Branch Responsibility)
- [ ] Login/register UI components
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] OAuth providers (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] User profile management
- [ ] Role-based access control implementation

### 🎯 Will Be Used By
- `feature/auth-ui` → Authentication forms and flows
- `feature/dashboard-layout` → Protected dashboard routes
- `feature/user-management` → User CRUD operations
- `feature/admin-panel` → Admin-only access with RBAC

---

## 🧭 Branch Lifecycle

```
default (baseline)
  └── feature/better-auth-setup ← CURRENT (authentication infrastructure)
       └── feature/auth-ui (authentication UI)
            └── feature/dashboard-layout (protected routes)
                 └── dev → main
```

**Current Status:** 🟢 Authentication infrastructure complete
**Dependencies:** `feature/prisma-setup` (optional, can setup Prisma here)
**Next Step:** Merge into `dev`, enable authentication across features
**End Goal:** Universal authentication infrastructure

---

## 📝 Contributing to This Branch

### Guidelines

1. **Maintain infrastructure focus** – No UI components, forms, or pages
2. **Keep security standards** – Follow Better Auth best practices
3. **Document changes** – Update README for new features
4. **Test thoroughly** – Both manual and automated tests
5. **Type everything** – Full TypeScript support
6. **Environment-aware** – Use auth-proxy for configurable routes

### Commit Message Format

```bash
git commit -m "auth: <change>

- <what was changed>
- <why it was changed>
- <impact on authentication infrastructure>"
```

---

## 🎯 Success Criteria

This branch is ready to merge when:

- ✅ Better Auth installed and configured
- ✅ Prisma adapter working
- ✅ Session management functional
- ✅ Email/password authentication enabled
- ✅ Server configuration complete
- ✅ Client configuration complete
- ✅ Authentication proxy pattern implemented
- ✅ Environment variables configured
- ✅ Security best practices applied
- ✅ Database schema updated
- ✅ Documentation complete

---

## 🔧 Troubleshooting

### Issue: "BETTER_AUTH_SECRET is not defined"

**Solution:**
```bash
openssl rand -base64 32
# Add to .env: BETTER_AUTH_SECRET="generated-secret"
```

---

### Issue: "Database schema not in sync"

**Solution:**
```bash
npx prisma db push
```

---

### Issue: "Session not persisting"

**Solution:**
Check `BETTER_AUTH_URL` matches your dev server:
```env
BETTER_AUTH_URL="http://localhost:3000"
```

---

## 📖 References

- [Better Auth Documentation](https://better-auth.com/docs)
- [Better Auth Prisma Adapter](https://better-auth.com/docs/adapters/prisma)
- [Better Auth Security](https://better-auth.com/docs/concepts/security)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## 🔥 Philosophy Reminder

> **"Modular but not fragmented."**
> **"Clean integration, not package dumping."**

Authentication infrastructure is **foundational capability**:

- **Single responsibility** – Authentication and session management
- **Feature-agnostic** – No UI, no forms, no flows
- **Type-safe** – Full TypeScript support with proxy pattern
- **Environment-aware** – Configurable via environment variables
- **Reusable** – Any feature can use `authProxy`
- **Extensible** – RBAC foundation, OAuth ready, 2FA ready
- **Production-ready** – Security best practices, session management

This branch provides **infrastructure**.
Feature branches provide **UI, flows, and business logic**.

Every decision must serve:
- Long-term maintainability
- Architectural clarity
- Professional scalability
- Type safety and developer experience

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
