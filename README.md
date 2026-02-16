# 🔐 feature/shadcn-auth-ui

**Isolated integration branch for Authentication UI with shadcn/ui**

This branch demonstrates a **production-grade authentication user interface** built on top of **Better Auth** and **shadcn/ui** for the **next-branch** fullstack architecture. It focuses on accessible forms, clean validation patterns, and secure authentication flows.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It combines multiple foundational integrations:

- **Better Auth** (`feature/better-auth-setup`) – Authentication API layer ✅
- **shadcn/ui** (`feature/shadcn-setup`) – UI primitives ✅
- **Form validation** – Zod + react-hook-form integration
- **Authentication pages** – Login, Register, Forgot Password, Reset Password
- **User experience patterns** – Loading states, error handling, success feedback

**This is not a permanent branch.**
Once validated, it will be merged into `dev` as part of the controlled integration process.

---

## 📦 What's Included

### Authentication Pages

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/login` | Email & password sign-in |
| Register | `/register` | New user sign-up |
| Forgot Password | `/forgot-password` | Password reset request |
| Reset Password | `/reset-password/[token]` | Password reset form |
| Verify Email | `/verify-email/[token]` | Email verification (future) |

### shadcn/ui Components Added

| Component | Purpose | Usage |
|-----------|---------|-------|
| `form` | react-hook-form wrapper | Form structure |
| `checkbox` | "Remember me", ToS acceptance | Auth forms |
| `separator` | Visual grouping | Form sections |

**Note:** Core primitives (button, input, label, card, alert) already installed in `feature/shadcn-setup`.

### Form Validation

- **Zod schemas** for type-safe validation
- **react-hook-form** for form state management
- **Client-side validation** with real-time feedback
- **Server-side error handling** from Better Auth API

### UX Features

- ✅ Loading states during submission
- ✅ Error messages (inline + alert)
- ✅ Success feedback with redirect
- ✅ Keyboard navigation (accessible)
- ✅ Focus management
- ✅ ARIA labels for screen readers

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
BETTER_AUTH_SECRET="your-generated-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Test Authentication

Visit:
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Forgot Password: `http://localhost:3000/forgot-password`

---

## 🧱 Architecture Decisions

### Why This Component Selection?

**Tier 1 (from `feature/shadcn-setup`):**
- `button`, `input`, `label`, `card`, `alert` – Already available

**Tier 2 (added in this branch):**
- `form` – react-hook-form integration, reduces boilerplate
- `checkbox` – "Remember me" functionality, accessibility built-in
- `separator` – Visual grouping (e.g., "or continue with")

**NOT added (yet):**
- OAuth buttons (Google, GitHub) – future enhancement
- Multi-step forms – not needed for baseline auth
- Toast notifications – using `alert` component for now

### Form Architecture

```typescript
// Validation schema (Zod)
/lib/validations/auth.ts

// Form components
/components/auth/login-form.tsx
/components/auth/register-form.tsx
/components/auth/forgot-password-form.tsx

// Pages (route handlers)
/app/(auth)/login/page.tsx
/app/(auth)/register/page.tsx
/app/(auth)/forgot-password/page.tsx
```

### Route Group Strategy

Using `(auth)` route group for:
- Shared layout (centered form design)
- Consistent styling
- Auth-specific middleware (future)
- No impact on URL structure

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
  │           └── page.tsx         # Reset password page (dynamic)
  │
  └── api/auth/[...all]/
      └── route.ts                 # Better Auth endpoints (already exists)

/components
  ├── auth/                        # Auth-specific form components
  │   ├── login-form.tsx           # Login form with validation
  │   ├── register-form.tsx        # Register form with validation
  │   ├── forgot-password-form.tsx # Forgot password form
  │   └── reset-password-form.tsx  # Reset password form
  │
  └── ui/                          # shadcn/ui components
      ├── button.tsx
      ├── input.tsx
      ├── label.tsx
      ├── card.tsx
      ├── alert.tsx
      ├── form.tsx                 # NEW: react-hook-form wrapper
      ├── checkbox.tsx             # NEW: for "Remember me"
      └── separator.tsx            # NEW: visual divider

/lib
  ├── auth.ts                      # Better Auth config (already exists)
  ├── auth-client.ts               # Client-side auth helpers
  ├── metadata.ts                  # Metadata utility (already exists)
  └── validations/
      └── auth.ts                  # Zod schemas for auth forms
```

---

## 🧪 Form Validation Examples

### Login Schema

```typescript
// lib/validations/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
```

### Register Schema

```typescript
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>
```

---

## 🎨 Component Usage Examples

### Login Form

```typescript
// components/auth/login-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError(error.message)
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

---

## 🔗 Integration Points

This branch integrates with:

- **Better Auth** (`feature/better-auth-setup`) – API endpoints ✅ **MERGED**
- **shadcn/ui** (`feature/shadcn-setup`) – UI primitives ✅ **MERGED**
- **Prisma** (`feature/prisma-setup`) – User data layer ✅ **MERGED**
- **Metadata utility** (from `default`) – Page SEO ✅
- **TanStack Query** (future) – Client-side auth state management
- **Middleware** (future) – Route protection

---

## 🛡️ Security Best Practices Implemented

✅ **Client-side validation** (Zod schemas prevent malformed data)
✅ **Server-side validation** (Better Auth handles API validation)
✅ **Password strength enforcement** (regex validation)
✅ **HTTPS required in production** (enforced via Better Auth)
✅ **CSRF protection** (built into Better Auth)
✅ **No password stored in state** (cleared after submission)
✅ **Accessible forms** (ARIA labels, keyboard navigation)

---

## 🚧 Known Limitations

- OAuth providers not implemented (Google, GitHub) – future enhancement
- Email verification flow UI incomplete – requires email service setup
- 2FA/MFA not implemented – future security enhancement
- Password reset email not styled – uses plain text template
- No "magic link" authentication – can be added later

---

## 🧪 Testing Authentication Flows

### Test User Registration

1. Navigate to `/register`
2. Fill form with:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "SecurePass123"
   - Confirm Password: "SecurePass123"
3. Submit → should redirect to `/login` (or `/dashboard` if auto-login enabled)

### Test Login

1. Navigate to `/login`
2. Fill form with registered credentials
3. Submit → should redirect to `/dashboard`

### Test Validation

1. Try submitting empty forms → see inline errors
2. Try invalid email → see validation message
3. Try weak password → see strength requirements
4. Try mismatched passwords (register) → see error

---

## 📚 Dependencies Added

```json
{
  "dependencies": {
    "react-hook-form": "^7.x.x",
    "@hookform/resolvers": "^3.x.x",
    "zod": "^3.x.x"
  }
}
```

**Note:** shadcn/ui components use Radix UI primitives (installed automatically via CLI).

---

## 🧭 Branch Lifecycle

```
feature/prisma-setup → feature/better-auth-setup → feature/shadcn-setup
                                                          ↓
                                                  feature/shadcn-auth-ui
                                                          ↓
                                                        dev → main
```

**Current Status:** 🟡 Isolated integration branch
**Dependencies:** `feature/better-auth-setup` ✅, `feature/shadcn-setup` ✅
**Next Step:** Validation & merge into `dev` after UI testing
**End Goal:** Stable release in `main` as part of auth stack

---

## 📝 Contributing to This Branch

If working on this branch:

1. **Keep forms minimal** – avoid unnecessary fields
2. **Test accessibility** – keyboard navigation, screen readers
3. **Validate on client AND server** – never trust client-only validation
4. **Handle errors gracefully** – show clear, actionable messages
5. **Test all auth flows** – register → login → forgot password → reset
6. **Update this README** if adding new pages or components

### Commit Message Format

```bash
git commit -m "auth-ui: add <page/component>

- <what was added>
- <why it was needed>
- <how it integrates with Better Auth>"
```

---

## 🎯 Success Criteria

This branch is ready to merge when:

- ✅ All auth pages functional (login, register, forgot password, reset)
- ✅ Form validation working (client-side + server-side)
- ✅ Error handling graceful (inline errors + alert messages)
- ✅ Loading states implemented (prevent double submission)
- ✅ Accessibility verified (keyboard nav, ARIA labels)
- ✅ Responsive design tested (mobile + desktop)
- ✅ Integration with Better Auth API confirmed
- ✅ No UI bloat (only essential shadcn components added)

---

## 🔥 Philosophy Reminder

> **"This is not a UI showcase repo."**
> **"This is an architecture foundation."**

Authentication UI must be:
- **Functional first** – security and UX over aesthetics
- **Accessible** – keyboard navigation, screen readers
- **Minimal** – only essential components
- **Scalable** – easy to extend (OAuth, 2FA, etc.)

Every component added must serve a **real authentication need**, not hypothetical use cases.

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
