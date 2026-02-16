# ✅ feature/form-validation

**Isolated integration branch for production-grade form validation**

This branch establishes a **type-safe, schema-based form validation infrastructure** for the **next-branch** fullstack architecture. It focuses on reusable validation patterns, clean error handling, and seamless integration with React forms.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It provides foundational form validation capabilities:

- **Type-safe form validation** using Zod schemas
- **React form state management** via react-hook-form
- **Seamless integration** with @hookform/resolvers
- **Reusable validation patterns** for auth, user profiles, data entry
- **Production-ready error handling** with clear, actionable messages

**This is not a permanent branch.**
Once validated, it will be merged into `dev` and used by feature branches that require forms (auth-ui, user-profile, etc.).

---

## 📦 What's Included

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `zod` | ^4.3.6 | Schema validation & type inference |
| `react-hook-form` | ^7.71.1 | Form state management |
| `@hookform/resolvers` | ^5.2.2 | Bridge between react-hook-form & Zod |

### Validation Infrastructure

- **No validation schemas yet** – this branch establishes foundation only
- **Ready for schema creation** in `/lib/validations/`
- **Type-safe patterns** via Zod's `infer` utility
- **Environment-agnostic** – works with any Next.js App Router setup

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Verify Installation

Check `package.json` dependencies:

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "react-hook-form": "^7.71.1",
    "zod": "^4.3.6"
  }
}
```

### 3. Run Development Server

```bash
npm run dev
```

---

## 🧱 Architecture Decisions

### Why This Validation Stack?

#### **Zod**
- **Type inference** – schemas generate TypeScript types automatically
- **Composable** – build complex validations from simple rules
- **Runtime validation** – catches errors at form submission
- **Ecosystem support** – integrates with react-hook-form, tRPC, etc.
- **DX excellence** – clear error messages, autocomplete support

#### **react-hook-form**
- **Performance** – minimal re-renders, uncontrolled inputs by default
- **DX** – simple API, built-in validation support
- **Flexibility** – works with controlled/uncontrolled inputs
- **Bundle size** – ~9KB gzipped
- **TypeScript-first** – full type safety

#### **@hookform/resolvers**
- **Bridge** – connects react-hook-form with Zod (and other validators)
- **Official** – maintained by react-hook-form team
- **Type-safe** – preserves Zod type inference

### Why Not Alternatives?

| Alternative | Why Not |
|-------------|---------|
| **Formik** | Larger bundle, more re-renders, older API design |
| **Yup** | Less powerful type inference than Zod |
| **Joi** | Not designed for frontend, larger bundle |
| **Manual validation** | Not scalable, error-prone, no type safety |

---

## 📁 Expected Directory Structure

After creating validation schemas:

```
/lib
  ├── metadata.ts                # Metadata utility (already exists)
  ├── utils.ts                   # shadcn utils (already exists)
  └── validations/               # NEW: Validation schemas directory
      ├── auth.ts                # Login, register, forgot password
      ├── user.ts                # User profile, settings
      └── common.ts              # Reusable validators (email, phone, etc.)

/components (future feature branches)
  └── forms/
      ├── login-form.tsx         # Uses auth.ts schemas
      └── register-form.tsx      # Uses auth.ts schemas
```

---

## 🧪 Usage Pattern Examples

### 1. Basic Schema Definition

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

---

### 2. Integration with react-hook-form

```typescript
// components/auth/login-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  async function onSubmit(data: LoginInput) {
    // data is type-safe and validated
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('email')} />
      {form.formState.errors.email && (
        <p>{form.formState.errors.email.message}</p>
      )}

      <input type="password" {...form.register('password')} />
      {form.formState.errors.password && (
        <p>{form.formState.errors.password.message}</p>
      )}

      <button type="submit" disabled={form.formState.isSubmitting}>
        Sign In
      </button>
    </form>
  )
}
```

---

### 3. Complex Validation (Password Confirmation)

```typescript
// lib/validations/auth.ts
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
```

---

### 4. Reusable Validators

```typescript
// lib/validations/common.ts
import { z } from 'zod'

// Reusable email validator
export const emailSchema = z.string().email('Invalid email address')

// Reusable phone validator (E.164 format)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')

// Reusable URL validator
export const urlSchema = z.string().url('Invalid URL')

// Reusable required string helper
export const requiredString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`)

// Password strength validator (reusable)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
```

---

## 🔗 Integration Points

This branch is designed to be used by:

- **Auth UI** (`feature/auth-ui`) – login, register, forgot password forms
- **User Profile** (future) – profile editing, settings forms
- **Data Entry** (future) – content creation, admin forms
- **API Routes** (future) – backend validation with same schemas

---

## 🛡️ Best Practices Implemented

✅ **Type-safe validation** – Zod schemas generate TypeScript types
✅ **DRY principle** – reusable validators in `common.ts`
✅ **Clear error messages** – user-friendly, actionable feedback
✅ **Client & server validation** – same schemas can be used in API routes
✅ **Performance-optimized** – react-hook-form minimizes re-renders
✅ **Composable schemas** – build complex validations from simple rules

---

## 🚧 Current State

### ✅ Completed
- Dependencies installed (zod, react-hook-form, @hookform/resolvers)
- Foundation ready for schema creation
- Type-safe infrastructure established

### 🔄 Pending (Next Steps)
- Create `/lib/validations/auth.ts` (login, register, forgot password)
- Create `/lib/validations/user.ts` (profile, settings)
- Create `/lib/validations/common.ts` (reusable helpers)
- Document validation patterns in this README

### 🎯 Will Be Used By
- `feature/auth-ui` branch (authentication forms)
- `feature/user-profile` branch (future)
- API route validation (future)

---

## 📚 References

- [Zod Documentation](https://zod.dev)
- [react-hook-form Documentation](https://react-hook-form.com)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [Next.js Form Validation Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#validation)

---

## 🧭 Branch Lifecycle

```
default
  └── feature/form-validation  ← CURRENT (foundation only)
       ├── feature/auth-ui (will use validation schemas)
       └── feature/user-profile (future, will use validation schemas)
            └── dev → main
```

**Current Status:** 🟡 Foundation established, awaiting schema implementation
**Dependencies:** None (branches from `default`)
**Next Step:** Create validation schemas for auth forms
**End Goal:** Merge into `dev` as reusable validation infrastructure

---

## 📝 Contributing to This Branch

If working on this branch:

1. **Create validation schemas** in `/lib/validations/`
2. **Use descriptive error messages** – help users fix issues
3. **Make validators reusable** – avoid duplication
4. **Export TypeScript types** – use `z.infer<typeof schema>`
5. **Test schemas** – verify valid/invalid inputs
6. **Document patterns** – update this README with examples

### Commit Message Format

```bash
git commit -m "form-validation: add <schema-name> validation

- Define schema for <use-case>
- Include <specific validations>
- Export TypeScript types"
```

---

## 🎯 Success Criteria

This branch is ready to merge when:

- ✅ Dependencies installed and verified (**DONE**)
- ⏳ Auth validation schemas created (login, register, forgot password)
- ⏳ Common validation helpers created (email, password, phone)
- ⏳ User validation schemas created (profile, settings)
- ⏳ Integration tested with react-hook-form
- ⏳ TypeScript types properly inferred
- ⏳ Documentation complete with usage examples

---

## 🔥 Philosophy Reminder

> **"Modular but not fragmented."**
> **"Clean integration, not package dumping."**

Form validation is **foundational infrastructure** that will be used across multiple features:
- **Not a feature itself** – supporting capability
- **Reusable by design** – DRY validation logic
- **Type-safe by default** – catch errors at compile time
- **Production-ready** – clear error messages, accessible forms

Every validation schema must serve a **real feature need**, not hypothetical use cases.

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
