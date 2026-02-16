# 🔐 feature/better-auth-setup

**Isolated integration branch for Better Auth + Prisma**

This branch demonstrates a **clean, production-grade authentication setup** using **Better Auth** integrated with **Prisma ORM** for the **next-branch** fullstack architecture. It focuses on type-safe authentication, RBAC readiness, and scalable user management patterns suitable for modern Next.js applications.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It extends the Prisma integration (`feature/prisma-setup`) by adding:

- **Better Auth** configuration with Prisma adapter
- Email & password authentication foundation
- Type-safe authentication layer
- Database-backed session management
- RBAC-ready user schema structure
- Clean API route patterns for auth endpoints

**This is not a permanent branch.**
Once validated, it will be merged into `dev` as part of the controlled integration process.

---

## 📦 What's Included

### Core Setup
- **Better Auth** v1.4.18+ with Prisma adapter
- **Email & Password authentication** enabled by default
- **Type-safe auth client** for frontend usage
- **API routes** for authentication endpoints (`/api/auth/*`)
- **Prisma schema** extended with Better Auth tables
- **Environment configuration** for auth secrets

### Authentication Architecture
- Database-backed sessions (via Prisma)
- Secure password hashing (built-in)
- Session token management
- User model with auth metadata
- Prepared for OAuth providers (future enhancement)
- RBAC extension points ready

### Environment Configuration
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000" # or production URL
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file with:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/next_branch_dev"
BETTER_AUTH_SECRET="generate-a-secure-random-string"
BETTER_AUTH_URL="http://localhost:3000"
```

> **Note:** Generate `BETTER_AUTH_SECRET` using:
> ```bash
> openssl rand -base64 32
> ```

### 3. Generate Prisma Client with Auth Tables
```bash
npx prisma generate
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev --name add_better_auth
```

This creates necessary auth tables (`user`, `session`, `account`, `verification`, etc.)

### 5. Start Development Server
```bash
npm run dev
```

### 6. Test Authentication
- Sign up endpoint: `POST /api/auth/sign-up`
- Sign in endpoint: `POST /api/auth/sign-in`
- Session check: `GET /api/auth/session`

---

## 🧱 Architecture Decisions

### Why Better Auth?
- **Modern & lightweight** – no legacy bloat like NextAuth v4
- **Type-safe by design** – full TypeScript support
- **Prisma-first** – native adapter without ORM abstraction overhead
- **Flexible providers** – easy to add OAuth, magic links, etc.
- **Edge-compatible** – works with Next.js middleware and edge runtime
- **Active development** – modern API design aligned with Next.js App Router

### Why Not NextAuth/Auth.js?
- NextAuth v5 (Auth.js) still experimental
- Better Auth has cleaner Prisma integration
- Simpler API surface for custom workflows
- Better TypeScript inference out of the box

### Authentication Strategy
This setup uses **email & password** as baseline, but is **prepared for**:
- OAuth providers (Google, GitHub, etc.)
- Magic link authentication
- Two-factor authentication (2FA)
- Passkey/WebAuthn support

---

## 📁 Directory Structure

```
/prisma
  ├── schema.prisma         # Extended with Better Auth models
  └── migrations/           # Includes auth table migrations

/lib
  ├── prisma.ts             # Prisma Client singleton
  └── auth.ts               # Better Auth configuration

/app
  └── api
      └── auth
          └── [...all]
              └── route.ts  # Auth API endpoints (handled by Better Auth)
```

---

## 🔄 Database Schema

Better Auth automatically manages these tables via Prisma:

| Table | Purpose |
|-------|---------|
| `user` | Core user data (email, name, etc.) |
| `session` | Active user sessions |
| `account` | OAuth provider accounts (future) |
| `verification` | Email verification tokens |

All tables are versioned via Prisma migrations.

---

## 🛡️ Security Best Practices Implemented

✅ **Secure password hashing** (bcrypt/argon2 handled by Better Auth)
✅ **Environment-based secrets** (never commit `.env`)
✅ **Database-backed sessions** (no localStorage token exposure)
✅ **CSRF protection** (built into Better Auth)
✅ **Type-safe API routes** (TypeScript enforced)

---

## 🧪 Testing Authentication

### Sign Up Example
```typescript
// Client-side usage
import { authClient } from '@/lib/auth-client'

const { data, error } = await authClient.signUp.email({
  email: 'user@example.com',
  password: 'SecurePassword123',
  name: 'John Doe',
})
```

### Sign In Example
```typescript
const { data, error } = await authClient.signIn.email({
  email: 'user@example.com',
  password: 'SecurePassword123',
})
```

### Check Session
```typescript
const { data: session } = await authClient.getSession()
console.log(session?.user) // Authenticated user or null
```

---

## 🔗 Integration Points

This branch is designed to integrate with:

- **Prisma** (`feature/prisma-setup`) – database layer ✅ **MERGED**
- **RBAC system** (future) – role-based access control
- **TanStack Query** (`feature/tanstack-query`) – client-side auth state
- **Audit logging** (future) – track authentication events
- **shadcn/ui** (`feature/shadcn-ui`) – auth UI components (login forms, etc.)

---

## 🚧 Known Limitations

- OAuth providers not configured yet (add as needed)
- Email verification flow not implemented (template provided)
- 2FA/MFA not enabled (future enhancement)
- Password reset flow requires custom implementation

---

## 🧪 API Endpoints

Better Auth automatically handles these routes via `/api/auth/[...all]`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sign-up` | POST | Register new user |
| `/api/auth/sign-in` | POST | Authenticate user |
| `/api/auth/sign-out` | POST | Invalidate session |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/user` | GET | Get authenticated user data |

---

## 📚 References

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Better Auth + Prisma Guide](https://www.better-auth.com/docs/adapters/prisma)
- [Next.js App Router Auth Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- [Prisma Client Best Practices](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)

---

## 🧭 Branch Lifecycle

```
feature/prisma-setup → feature/better-auth-setup → dev → main
```

**Current Status:** 🟡 Isolated integration branch
**Previous Branch:** `feature/prisma-setup` (merged ✅)
**Next Step:** Validation & merge into `dev` after authentication testing
**End Goal:** Stable release in `main` as part of foundational auth stack

---

## 📝 Contributing to This Branch

If working on this branch:
1. **Never commit `.env`** – auth secrets must remain local
2. **Test authentication flows** before pushing
3. **Keep auth logic in `/lib/auth.ts`** – avoid scattered config
4. **Document new providers** if adding OAuth (Google, GitHub, etc.)
5. **Run Prisma migrations** after schema changes to auth models
6. **Update this README** if authentication strategy changes

---

## 🔐 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | ✅ Yes | Secret key for session encryption |
| `BETTER_AUTH_URL` | ✅ Yes | Base URL of your app (e.g., `http://localhost:3000`) |

---

## 🎯 What's Next?

After this branch stabilizes:

1. **Merge into `dev`** alongside other feature branches
2. **Add OAuth providers** (Google, GitHub) in future iteration
3. **Build UI components** for login/signup (using shadcn/ui)
4. **Implement RBAC layer** on top of user model
5. **Add email verification** workflow
6. **Integrate with TanStack Query** for client-side session management

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
