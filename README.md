# 🔐 feature/auth-ui

**Isolated integration branch for production-grade Authentication UI**

This branch demonstrates a **complete, type-safe authentication user interface** built on top of **Better Auth**, **Prisma**, **shadcn/ui**, and **react-hook-form + Zod validation** for the **next-branch** fullstack architecture. It focuses on accessible forms, secure validation patterns, and clean authentication flows.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It combines multiple foundational integrations to create a complete auth UI:

- **Prisma ORM** (`feature/prisma-setup`) – Database layer ✅
- **Better Auth** (`feature/better-auth-setup`) – Authentication API ✅
- **shadcn/ui** (`feature/shadcn-setup`) – UI primitives ✅
- **Form Validation** (`feature/form-validation`) – Zod + react-hook-form ✅
- **Authentication pages** – Login, Register, Forgot Password, Reset Password
- **Production UX patterns** – Loading states, error handling, accessibility

**This is not a permanent branch.**
Once validated, it will be merged into `dev` as part of the controlled integration process.

---

## 📦 What's Included

### Dependencies

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| **Database** | `@prisma/client` | ^7.4.0 | Database client |
| **Auth** | `better-auth` | ^1.4.18 | Authentication framework |
| **Forms** | `react-hook-form` | ^7.71.1 | Form state management |
| **Validation** | `zod` | ^4.3.6 | Schema validation |
| **Integration** | `@hookform/resolvers` | ^5.2.2 | Form validation bridge |
| **UI** | `shadcn/ui` | - | Component primitives |

### Authentication Pages

| Page | Route | Status | Purpose |
|------|-------|--------|---------|
| Login | `/login` | 🔄 In Progress | Email & password sign-in |
| Register | `/register` | 🔄 In Progress | New user sign-up |
| Forgot Password | `/forgot-password` | 🔄 In Progress | Password reset request |
| Reset Password | `/reset-password/[token]` | 🔄 In Progress | Password reset form |
| Verify Email | `/verify-email/[token]` | ⏳ Future | Email verification |

### shadcn/ui Components

| Component | Category | Purpose |
|-----------|----------|---------|
| `button` | Tier 1 | Primary actions |
| `input` | Tier 1 | Text fields |
| `label` | Tier 1 | Form labels (accessibility) |
| `card` | Tier 1 | Content containers |
| `alert` | Tier 1 | Error/success messages |
| `form` | Tier 2 | react-hook-form wrapper |
| `checkbox` | Tier 2 | "Remember me", ToS acceptance |
| `separator` | Tier 2 | Visual grouping |

**Total:** 8 components (minimal, justified selection)

### Validation Schemas

| Schema | File | Purpose |
|--------|------|---------|
| `loginSchema` | `/lib/validations/auth.ts` | Login form validation |
| `registerSchema` | `/lib/validations/auth.ts` | Registration with password matching |
| `forgotPasswordSchema` | `/lib/validations/auth.ts` | Password reset request |
| `resetPasswordSchema` | `/lib/validations/auth.ts` | New password with confirmation |

**Common validators:** Email, password strength, phone number (in `/lib/validations/common.ts`)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Ensure your `.env` includes:

```env
# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Next.js Starter"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/next_branch_dev"

# Better Auth
BETTER_AUTH_SECRET="your-generated-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

> **Generate secret:** `openssl rand -base64 32`

### 3. Run Database Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Test Authentication Pages

Visit:
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Forgot Password: `http://localhost:3000/forgot-password`

---

## 🧱 Architecture Decisions

### Integration Strategy

This branch **merges** multiple feature branches:

```
feature/prisma-setup ──────┐
feature/better-auth-setup ─┤
feature/shadcn-setup ──────┼─→ feature/auth-ui
feature/form-validation ───┘
```

**Result:** Complete auth UI stack with:
- ✅ Database layer (Prisma)
- ✅ Auth API (Better Auth)
- ✅ UI primitives (shadcn/ui)
- ✅ Form validation (Zod + react-hook-form)

### Why This Component Selection?

**Tier 1 (from `feature/shadcn-setup`):**
- `button`, `input`, `label`, `card`, `alert` – Core primitives

**Tier 2 (added for auth UI):**
- `form` – react-hook-form integration (reduces boilerplate)
- `checkbox` – "Remember me", ToS acceptance (accessibility built-in)
- `separator` – Visual grouping (e.g., "or sign in with")

**NOT added:**
- ❌ OAuth buttons (Google, GitHub) – future enhancement
- ❌ Multi-step forms – not needed for baseline auth
- ❌ Toast notifications – using `alert` component for now
- ❌ Dialog/Modal – not required for auth flows

### Validation Architecture

**Type-safe end-to-end:**

```typescript
Zod Schema → TypeScript Type → react-hook-form → Better Auth API
```

**Benefits:**
- Compile-time type safety
- Runtime validation
- Clear error messages
- Reusable across pages

---

## 📁 Directory Structure

```
/app
  ├── (auth)/                      # Route group for auth pages
  │   ├── layout.tsx               # Centered layout for auth forms
  │   ├── login/
  │   │   └── page.tsx             # Login page
  │   ├── register/
  │   │   └── page.tsx             # Register page
  │   ├── forgot-password/
  │   │   └── page.tsx             # Forgot password page
  │   └── reset-password/
  │       └── [token]/
  │           └── page.tsx         # Reset password (dynamic route)
  │
  └── api/auth/[...all]/
      └── route.ts                 # Better Auth endpoints (from feature/better-auth-setup)

/components
  ├── auth/                        # Auth-specific form components
  │   ├── login-form.tsx           # Login form with validation
  │   ├── register-form.tsx        # Register form with validation
  │   ├── forgot-password-form.tsx # Forgot password form
  │   └── reset-password-form.tsx  # Reset password form
  │
  └── ui/                          # shadcn/ui components
      ├── button.tsx               # Tier 1
      ├── input.tsx                # Tier 1
      ├── label.tsx                # Tier 1
      ├── card.tsx                 # Tier 1
      ├── alert.tsx                # Tier 1
      ├── form.tsx                 # Tier 2 (NEW)
      ├── checkbox.tsx             # Tier 2 (NEW)
      └── separator.tsx            # Tier 2 (NEW)

/lib
  ├── auth.ts                      # Better Auth config (from feature/better-auth-setup)
  ├── auth-client.ts               # Client-side auth helpers
  ├── prisma.ts                    # Prisma client (from feature/prisma-setup)
  ├── metadata.ts                  # Metadata utility (from default)
  ├── utils.ts                     # shadcn utils (from feature/shadcn-setup)
  └── validations/                 # Validation schemas (from feature/form-validation)
      ├── auth.ts                  # Login, register, forgot/reset password
      └── common.ts                # Reusable validators (email, password, phone)

/prisma
  ├── schema.prisma                # Database schema with auth tables
  └── migrations/                  # Version-controlled migrations
```

---

## 🧪 Implementation Examples

### Login Form with Validation

```typescript
// components/auth/login-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  async function onSubmit(data: LoginInput) {
    setError(null)

    const { error: authError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError(authError.message)
      return
    }

    router.push('/dashboard')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Remember me</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  )
}
```

### Validation Schema Example

```typescript
// lib/validations/auth.ts
import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
```

---

## 🔗 Integration Points

This branch integrates with:

- **Prisma** (`feature/prisma-setup`) – User data layer ✅ **MERGED**
- **Better Auth** (`feature/better-auth-setup`) – API endpoints ✅ **MERGED**
- **shadcn/ui** (`feature/shadcn-setup`) – UI primitives ✅ **MERGED**
- **Form Validation** (`feature/form-validation`) – Zod schemas ✅ **MERGED**
- **Metadata utility** (from `default`) – Page SEO ✅
- **TanStack Query** (future) – Client-side state management
- **Middleware** (future) – Route protection

---

## 🛡️ Security Best Practices Implemented

✅ **Client-side validation** (Zod schemas prevent malformed data)
✅ **Server-side validation** (Better Auth API validation)
✅ **Password strength enforcement** (regex validation)
✅ **HTTPS required in production** (Better Auth enforced)
✅ **CSRF protection** (built into Better Auth)
✅ **Session management** (database-backed via Prisma)
✅ **Type-safe API calls** (TypeScript end-to-end)
✅ **Accessible forms** (ARIA labels, keyboard navigation)

---

## 🚧 Known Limitations

- OAuth providers not implemented (Google, GitHub) – future enhancement
- Email verification flow UI incomplete – requires email service setup
- 2FA/MFA not implemented – future security enhancement
- Password reset email uses plain text – needs HTML template
- No "magic link" authentication – can be added later
- No rate limiting UI feedback – backend handles throttling

---

## 🧪 Testing Authentication Flows

### Test User Registration

1. Navigate to `/register`
2. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "SecurePass123"
   - Confirm Password: "SecurePass123"
3. Submit → redirects to `/login` or `/dashboard`

### Test Login

1. Navigate to `/login`
2. Use registered credentials
3. Check "Remember me" (optional)
4. Submit → redirects to `/dashboard`

### Test Validation

1. Submit empty forms → inline error messages
2. Enter invalid email → "Invalid email address"
3. Enter weak password → strength requirements shown
4. Mismatched passwords (register) → "Passwords don't match"

### Test Error Handling

1. Login with wrong credentials → alert message displayed
2. Network error simulation → graceful error handling
3. Loading states → button disabled during submission

---

## 🧭 Branch Lifecycle

```
feature/prisma-setup ──────┐
feature/better-auth-setup ─┤
feature/shadcn-setup ──────┼─→ feature/auth-ui ← CURRENT
feature/form-validation ───┘        ↓
                                   dev → main
```

**Current Status:** 🔄 Active development (auth UI implementation)
**Dependencies:** All foundational branches merged ✅
**Next Step:** Complete auth pages, test flows, merge to `dev`
**End Goal:** Stable release in `main` as production auth stack

---

## 📝 Contributing to This Branch

If working on this branch:

1. **Keep forms minimal** – only essential fields
2. **Test accessibility** – keyboard navigation, screen readers
3. **Validate client AND server** – never trust client-only
4. **Handle errors gracefully** – clear, actionable messages
5. **Test all auth flows** – register → login → forgot → reset
6. **Update README** if adding pages/components
7. **Document integration points** – how components connect

### Commit Message Format

```bash
git commit -m "auth-ui: add <feature>

- <what was added/changed>
- <why it was needed>
- <how it integrates>"
```

**Examples:**
```bash
git commit -m "auth-ui: add login form component

- Integrate react-hook-form with Zod validation
- Connect to Better Auth API
- Add loading states and error handling"

git commit -m "auth-ui: merge feature/form-validation

- Add Zod, react-hook-form, @hookform/resolvers
- Create validation schemas for auth flows
- Enable type-safe form validation"
```

---

## 🎯 Success Criteria

This branch is ready to merge when:

- ✅ All foundational branches merged (prisma, better-auth, shadcn, form-validation)
- 🔄 Auth pages created (login, register, forgot password, reset)
- 🔄 Form validation working (client + server)
- 🔄 Better Auth API integration complete
- 🔄 Error handling graceful (inline + alert messages)
- 🔄 Loading states implemented (prevent double submission)
- 🔄 Accessibility verified (keyboard nav, ARIA labels, screen readers)
- 🔄 Responsive design tested (mobile + desktop)
- 🔄 No UI bloat (only essential shadcn components)
- 🔄 README documentation complete

---

## 🔥 Philosophy Reminder

> **"This is not a UI showcase repo."**
> **"This is an architecture foundation."**

Authentication UI must be:
- **Functional first** – security and UX over aesthetics
- **Accessible** – keyboard navigation, screen readers, ARIA labels
- **Minimal** – only essential components (8 shadcn components total)
- **Scalable** – easy to extend (OAuth, 2FA, magic links)
- **Type-safe** – validated at compile time and runtime

Every component added must serve a **real authentication need**, not hypothetical use cases.

---

## 📚 References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [react-hook-form + Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
