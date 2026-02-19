# 🏗️ feature/dashboard-foundation

**Single-tenant dashboard infrastructure for enterprise applications**

This branch establishes the foundational dashboard system for **next-branch**. It integrates authentication, authorization, UI structure, data management, and form handling into a cohesive, production-ready foundation.

---

## 🎯 Purpose

This branch provides the **base layer** for dashboard applications:

- ✅ User-level authentication & RBAC
- ✅ Modern sidebar-based dashboard layout
- ✅ Type-safe data fetching with caching
- ✅ Production-grade form handling
- ✅ Protected routes with permission checks
- ✅ Responsive design (mobile/tablet/desktop)

**This is infrastructure, not features.**
Dashboard features (analytics, user management, etc.) build **on top** of this foundation.

**This is single-tenant.**
Multi-tenant capabilities (organization isolation, org-level permissions) will **extend** this foundation in future branches.

---

## 🧱 What's Included

### 1. Authentication & Authorization
- Better Auth integration (session management)
- Custom RBAC system (resource.action permissions)
- Role definitions (viewer, editor, admin)
- Server-side permission utilities
- Client-side permission hooks
- Permission-gated components

### 2. Dashboard Layout
- Modern sidebar navigation (shadcn/ui)
- Collapsible sidebar with mobile drawer
- Dashboard header with breadcrumb
- User menu with avatar
- Theme toggle (light/dark mode)
- Responsive design

### 3. Data Management
- TanStack Query integration
- Server state management
- Automatic caching & refetching
- Loading & error states
- Query invalidation
- Optimistic updates foundation

### 4. Form Handling
- React Hook Form integration
- Zod validation schemas
- Type-safe form definitions
- Real-time validation feedback
- Form submission with mutations
- Error handling & display

---

## 📁 Directory Structure

```
/app
├── dashboard/
│   ├── layout.tsx              # Protected dashboard layout
│   ├── page.tsx                # Dashboard home
│   └── [future features]/      # Analytics, users, settings, etc.

/components
├── dashboard/
│   ├── app-sidebar.tsx         # Main sidebar
│   ├── site-header.tsx         # Dashboard header
│   └── nav-user.tsx            # User menu
├── rbac/
│   ├── require-permission.tsx  # Permission gate
│   └── require-role.tsx        # Role gate
└── ui/
    └── [shadcn components]     # UI primitives

/lib
├── auth.ts                     # Better Auth server
├── auth-client.ts              # Better Auth client
├── auth/
│   ├── permissions.ts          # RBAC definitions
│   └── rbac-utils.ts           # Permission utilities
├── query/
│   ├── client.ts               # TanStack Query client
│   └── provider.tsx            # Query provider
├── validations/
│   ├── user.ts                 # User schemas
│   └── auth.ts                 # Auth schemas
└── hooks/
    └── use-permission.ts       # Permission hooks
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Environment variables configured

### Installation
```bash
git checkout feature/dashboard-foundation
npm install
npx @better-auth/cli migrate
npm run dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

---

## 📖 Usage Examples

### Protected Page with Permission Check
```typescript
// app/dashboard/users/page.tsx
import { requirePermission } from '@/lib/auth/rbac-utils'

export default async function UsersPage() {
  await requirePermission('user', ['read'])

  return <div>User Management</div>
}
```

### Form with Validation & Mutation
```typescript
const form = useForm({
  resolver: zodResolver(createUserSchema)
})

const createUser = useMutation({
  mutationFn: authClient.admin.createUser,
  onSuccess: () => queryClient.invalidateQueries(['users'])
})
```

### Permission-Gated UI
```tsx
<RequirePermission resource="user" actions={["delete"]}>
  <Button variant="destructive">Delete</Button>
</RequirePermission>
```

---

## 🔄 Future Extensions

This foundation will be extended by:

- **`feature/multi-tenant`** → Organization isolation
- **`feature/tenant-rbac`** → Org-level permissions
- **`feature/dashboard-analytics`** → Analytics dashboard
- **`feature/dashboard-users`** → User management UI
- **`feature/tenant-customization`** → Org branding & settings

---

## 🧪 Testing Checklist

- [ ] Authentication flow works
- [ ] RBAC permission checks enforce
- [ ] Dashboard layout renders correctly
- [ ] Data fetching with TanStack Query works
- [ ] Forms validate and submit
- [ ] Build passes (`npm run build`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Lint passes (`npm run lint`)

---

## 🔥 Philosophy Alignment

This branch adheres to **next-branch** principles:

| Principle                        | Implementation                          |
| -------------------------------- | --------------------------------------- |
| **"Modular but not fragmented"** | ✅ Four systems integrated cohesively    |
| **"Opinionated but extensible"** | ✅ Clear patterns, extensible foundation |
| **"Minimal but powerful"**       | ✅ Essential features only               |
| **"Clean integration"**          | ✅ No architectural conflicts            |
| **"Architecture foundation"**    | ✅ Named and designed as foundation      |

---

## 📖 Summary

**This branch provides single-tenant dashboard infrastructure.**

**Stack:**
- Better Auth + Custom RBAC
- shadcn/ui Dashboard Layout
- TanStack Query
- React Hook Form + Zod

**Capabilities:**
- User authentication & authorization
- Protected routes & permission checks
- Modern, responsive dashboard UI
- Type-safe data fetching with caching
- Production-grade form handling

**This is the foundation for building enterprise dashboard applications.**

Multi-tenant capabilities will extend this foundation in future branches.

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
