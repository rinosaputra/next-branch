# 🎯 feature/dashboard-foundation

**Production-grade dashboard infrastructure with authentication, RBAC, data management, and table capabilities**

This branch represents the **complete foundation layer** for building enterprise-ready dashboard applications. It integrates Better Auth (with RBAC), TanStack Query, TanStack Table, Prisma ORM, and shadcn/ui into a cohesive, production-ready architecture.

---

## 🏗️ Branch Architecture

```
default (pure Next.js baseline)
  └── feature/shadcn-setup (UI primitives)
       └── feature/better-auth-rbac (authentication + RBAC)
            └── feature/tanstack-query (server state management)
                 └── feature/form-validation (React Hook Form + Zod)
                      └── feature/tanstack-table (data tables)
                           └── feature/dashboard-foundation ← THIS BRANCH
```

**This branch consolidates:**
- ✅ Authentication system (Better Auth)
- ✅ Role-Based Access Control (RBAC)
- ✅ Server state management (TanStack Query)
- ✅ Form validation (React Hook Form + Zod)
- ✅ Data tables (TanStack Table)
- ✅ UI component system (shadcn/ui)
- ✅ Database layer (Prisma + PostgreSQL)
- ✅ Complete dashboard layout
- ✅ User management system

---

## 🎯 Purpose

This branch provides a **complete, production-ready dashboard foundation** that demonstrates:

1. **Authentication & Authorization**
   - Email/password authentication
   - Session management
   - Role-based permissions (admin, editor, viewer)
   - Protected routes and API endpoints

2. **Data Management**
   - Type-safe database queries (Prisma)
   - Optimistic updates (TanStack Query)
   - Cache management
   - Server/client state separation

3. **User Interface**
   - Responsive dashboard layout
   - Sidebar navigation
   - Theme support (light/dark)
   - Data tables with sorting, filtering, pagination
   - Form validation with real-time feedback

4. **User Management**
   - Complete CRUD operations
   - Role assignment
   - Password management
   - Ban/unban functionality
   - Session tracking

---

## 📦 Tech Stack

### **Core Framework**
- **Next.js 16.1.6** - App Router, Server Components, Server Actions
- **React 19.2.3** - Latest stable release
- **TypeScript 5** - Full type safety

### **Authentication & Authorization**
- **Better Auth 1.4.18** - Modern authentication library
  - Admin plugin for user management
  - RBAC (Role-Based Access Control)
  - Session management
  - Email/password authentication

### **Database**
- **Prisma 7.4.0** - Type-safe ORM
- **PostgreSQL** - Production database (via pg adapter)
- **Prisma Client** - Auto-generated type-safe database client

### **State Management**
- **TanStack Query 5.90.21** - Server state management
  - Cache management
  - Optimistic updates
  - Background refetching
  - DevTools for debugging

### **Data Tables**
- **TanStack Table 8.21.3** - Headless table primitives
  - Sorting (single/multi-column)
  - Filtering (global + column-specific)
  - Pagination (client/server-side)
  - Row selection
  - Column visibility

### **Forms & Validation**
- **React Hook Form 7.71.2** - Performant form library
- **Zod 4.3.6** - TypeScript-first schema validation
- **@hookform/resolvers 5.2.2** - Zod integration

### **UI Components**
- **shadcn/ui** - Radix UI + Tailwind CSS
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React 0.564.0** - Icon library
- **next-themes 0.4.6** - Theme management
- **Sonner 2.0.7** - Toast notifications

### **Utilities**
- **date-fns 4.1.0** - Date formatting
- **clsx** + **tailwind-merge** - Conditional classes
- **class-variance-authority** - Component variants

---

## 📁 Directory Structure

```
feature/dashboard-foundation/
├── app/                                 # Next.js App Router
│   ├── (auth)/                          # Auth-related routes (public)
│   │   ├── login/page.tsx               # Login page
│   │   └── register/page.tsx            # Registration page
│   ├── dashboard/                       # Protected dashboard routes
│   │   ├── layout.tsx                   # Dashboard layout with sidebar
│   │   ├── page.tsx                     # Dashboard home
│   │   └── users/                       # User management
│   │       ├── page.tsx                 # Users list (with TanStack Table)
│   │       ├── create/page.tsx          # Create user
│   │       ├── [id]/page.tsx            # User detail
│   │       └── [id]/edit/page.tsx       # Edit user
│   ├── api/                             # API routes
│   │   └── auth/[...all]/route.ts       # Better Auth API handler
│   ├── globals.css                      # Global styles
│   ├── layout.tsx                       # Root layout
│   └── providers.tsx                    # Client providers (Query, Theme)
│
├── components/                          # React components
│   ├── ui/                              # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── table.tsx
│   │   └── ... (essential components only)
│   ├── dashboard/                       # Dashboard-specific components
│   │   ├── app-sidebar.tsx              # Main navigation sidebar
│   │   └── site-header.tsx              # Header with user menu
│   ├── rbac/                            # RBAC-aware components
│   │   ├── require-permission.tsx       # Permission gate
│   │   ├── require-role.tsx             # Role gate
│   │   ├── role-badge.tsx               # Role display
│   │   ├── columns.tsx                  # User table columns
│   │   ├── user-row-actions.tsx         # Table row actions
│   │   ├── users-data-table.tsx         # Users table component
│   │   ├── create-user-form.tsx         # Create user form
│   │   └── edit-user-form.tsx           # Edit user form
│   └── table/                           # TanStack Table components
│       ├── data-table.tsx               # Main table component
│       ├── data-table-toolbar.tsx       # Search + filters
│       ├── data-table-pagination.tsx    # Pagination controls
│       ├── data-table-column-header.tsx # Sortable header
│       └── data-table-faceted-filter.tsx# Multi-select filter
│
├── lib/                                 # Utility libraries
│   ├── auth.ts                          # Better Auth server config
│   ├── auth-client.ts                   # Better Auth client
│   ├── auth/                            # Auth utilities
│   │   └── rbac-utils.ts                # Permission checking
│   ├── prisma.ts                        # Prisma client singleton
│   └── utils.ts                         # General utilities (cn, etc.)
│
├── hooks/                               # React hooks
│   └── use-permission.ts                # Client-side permission hook
│
├── data/                                # Mock/demo data
│   └── tanstack-table-mock-data.ts      # Table demo data
│
├── prisma/                              # Prisma schema & migrations
│   └── schema.prisma                    # Database schema
│
├── public/                              # Static assets
│
├── .env.example                         # Environment variables template
├── components.json                      # shadcn/ui config
├── prisma.config.ts                     # Prisma configuration
├── proxy.ts                             # Better Auth proxy (development)
├── tsconfig.json                        # TypeScript config
├── tailwind.config.ts                   # Tailwind config
├── next.config.ts                       # Next.js config
└── package.json                         # Dependencies
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ installed
- PostgreSQL database running
- Git installed

### **1. Clone Repository**

```bash
git clone https://github.com/rinosaputra/next-branch.git
cd next-branch
git checkout feature/dashboard-foundation
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Environment Setup**

Create `.env` file from template:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/next_branch?schema=public"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Optional: Email provider for password reset
# SMTP_HOST="smtp.example.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@example.com"
# SMTP_PASS="your-password"
```

### **4. Database Setup**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### **5. Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### **6. Create Admin User**

Visit `/register` and create your first user. The first user is automatically assigned the `admin` role.

---

## 🔐 Authentication & RBAC

### **Roles**

This foundation includes three default roles:

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Admin** | Full system access | User management, settings, all features |
| **Editor** | Create & edit content | Content management, limited admin |
| **Viewer** | Read-only access | Consume content, no modifications |

### **Permission System**

Permissions are resource-based:

```typescript
// Example: Check if user can delete users
await requirePermission("user", ["delete"])

// Client-side permission check
const { hasPermission: canUpdate } = usePermission("user", ["update"])
```

**Available Resources:**
- `user` - User management (create, read, update, delete, ban, set-role, set-password)
- `session` - Session management (list, revoke)

### **Protected Routes**

```typescript
// Server-side protection (app/dashboard/users/page.tsx)
export default async function UsersPage() {
  await requirePermission("user", ["read"]) // ✅ Blocks unauthorized users
  // ... page content
}

// Client-side protection (components)
<RequirePermission resource="user" actions={["delete"]}>
  <DeleteButton />
</RequirePermission>
```

---

## 📊 Features Overview

### **1. Dashboard Layout**

- **Responsive sidebar** - Collapsible on mobile
- **User menu** - Profile, settings, logout
- **Theme switcher** - Light/dark mode
- **Breadcrumb navigation** - Current page context

### **2. User Management**

**Users List (`/dashboard/users`)**
- View all users in sortable, filterable table
- Search by name/email
- Filter by role and status
- Pagination (10, 20, 30, 50, 100 per page)
- Row selection for bulk operations
- Quick actions per user

**User Detail (`/dashboard/users/[id]`)**
- Complete user information
- Account activity timeline
- Security status
- Quick actions (edit, reset password, ban/unban, delete)

**Create User (`/dashboard/users/create`)**
- Form validation with Zod
- Role assignment
- Password strength requirements
- Immediate account activation

**Edit User (`/dashboard/users/[id]/edit`)**
- Update name, email (disabled), role
- Set password (separate dialog)
- Change role (separate dialog)
- RBAC-protected actions

### **3. Data Tables (TanStack Table)**

**Features:**
- ✅ Sorting (single/multi-column)
- ✅ Filtering (global search + column filters)
- ✅ Faceted filters (multi-select dropdowns)
- ✅ Pagination (configurable page sizes)
- ✅ Row selection (single/multi-select)
- ✅ Column visibility toggle
- ✅ Responsive design
- ✅ Loading states
- ✅ Empty states

**Usage Example:**
```tsx
<DataTable
  columns={userColumns}
  data={users}
  searchKey="name"
  searchPlaceholder="Search users..."
  filterableColumns={[
    {
      id: "role",
      title: "Role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
    },
  ]}
/>
```

### **4. Form Handling**

**React Hook Form + Zod Integration:**
```tsx
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### **5. State Management**

**TanStack Query for Server State:**
```tsx
// Fetch users with automatic caching
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})

// Mutation with optimistic updates
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

---

## 🧪 Testing

### **Build Check**

```bash
npm run build
```

### **Type Check**

```bash
npm run type-check
```

### **Lint**

```bash
npm run lint
```

---

## 🔧 Customization

### **Add New Role**

1. **Update Prisma schema** (if using database roles)
2. **Update permission system** (`lib/auth/rbac-utils.ts`)
3. **Update UI components** (`components/rbac/role-badge.tsx`)

### **Add New Protected Resource**

```typescript
// lib/auth/rbac-utils.ts
export const permissions = {
  user: ["read", "create", "update", "delete"],
  post: ["read", "create", "update", "delete"], // ← New resource
}

// Usage
await requirePermission("post", ["create"])
```

### **Customize Dashboard Layout**

Edit `app/dashboard/layout.tsx` and `components/dashboard/app-sidebar.tsx`

### **Add New Table**

1. Create column definitions (see `components/rbac/columns.tsx`)
2. Use `DataTable` component
3. Add filters, sorting as needed

---

## 📖 API Documentation

### **Better Auth Endpoints**

All auth endpoints are handled by Better Auth:

```
POST   /api/auth/sign-in/email        # Email/password login
POST   /api/auth/sign-up/email        # Registration
POST   /api/auth/sign-out             # Logout
GET    /api/auth/session              # Get current session

# Admin endpoints (requires admin role)
POST   /api/auth/admin/create-user    # Create user
GET    /api/auth/admin/list-users     # List users
POST   /api/auth/admin/set-role       # Change user role
POST   /api/auth/admin/ban-user       # Ban user
POST   /api/auth/admin/unban-user     # Unban user
DELETE /api/auth/admin/remove-user    # Delete user
```

Full documentation: [Better Auth Admin Plugin](https://www.better-auth.com/docs/plugins/admin)

---

## 🚧 Current State

### **✅ Production-Ready**

- [x] Authentication system (Better Auth)
- [x] RBAC implementation (3 roles, resource-based permissions)
- [x] Dashboard layout (sidebar, header, theme)
- [x] User management (CRUD operations)
- [x] Data tables (sorting, filtering, pagination)
- [x] Form validation (React Hook Form + Zod)
- [x] Server state management (TanStack Query)
- [x] Database layer (Prisma + PostgreSQL)
- [x] Type-safe throughout (TypeScript)
- [x] Responsive design (mobile-friendly)
- [x] Production build working

### **⏳ Future Enhancements**

- [ ] Email verification flow
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] User profile editing (self-service)
- [ ] Activity logs / audit trail
- [ ] Advanced RBAC (custom permissions)
- [ ] Multi-tenancy support
- [ ] API rate limiting
- [ ] File upload system
- [ ] Notification system

---

## 🔀 Integration Path

This branch is designed to be merged into `dev` for testing, then `main` for stable release:

```bash
# Merge to dev for integration testing
git checkout dev
git merge feature/dashboard-foundation --no-ff

# After thorough testing, merge to main
git checkout main
git merge dev --no-ff
```

---

## 🏗️ Branch Philosophy

This branch follows **next-branch** architectural principles:

| Principle | Implementation |
|-----------|----------------|
| **"Modular but not fragmented"** | ✅ Clear separation of concerns, cohesive architecture |
| **"Opinionated but extensible"** | ✅ Strong defaults, easy to customize |
| **"Minimal but powerful"** | ✅ Essential features only, production-grade |
| **"No unnecessary bloat"** | ✅ Only required shadcn components, no UI showcase |
| **"Clean integration"** | ✅ All tools work together seamlessly |

---

## 📚 Dependencies Explained

### **Why Better Auth?**
- Modern authentication library for Next.js
- Built-in RBAC support
- Admin plugin for user management
- Type-safe, easy to extend

### **Why TanStack Query?**
- Industry-standard for server state
- Automatic caching, refetching, optimistic updates
- DevTools for debugging
- Excellent TypeScript support

### **Why TanStack Table?**
- Headless table primitives (no UI lock-in)
- Powerful sorting, filtering, pagination
- Composable, extensible
- Works perfectly with shadcn/ui

### **Why Prisma?**
- Type-safe database queries
- Excellent DX with auto-generated types
- Migration system
- Multi-database support

### **Why shadcn/ui?**
- Copy-paste components (full control)
- Built on Radix UI (accessible, tested)
- Tailwind CSS (consistent styling)
- Only add what you need (no bloat)

---

## 🎯 Use Cases

This foundation is ideal for:

- ✅ **SaaS applications** - Multi-tenant platforms
- ✅ **Admin dashboards** - Content management, user management
- ✅ **Internal tools** - Employee portals, CRUD apps
- ✅ **B2B platforms** - Role-based access, complex permissions
- ✅ **Data-heavy applications** - Analytics, reporting, tables

---

## 🤝 Contributing

This is an open-source architectural reference. Contributions are welcome!

**How to contribute:**
1. Fork the repository
2. Create a feature branch from `feature/dashboard-foundation`
3. Make your changes
4. Submit a pull request with clear description

**What we look for:**
- Architectural improvements
- Bug fixes
- Performance optimizations
- Documentation improvements
- Test coverage

**What we avoid:**
- UI component variants (this is not a UI library)
- Package bloat (justify every dependency)
- Breaking changes without discussion

---

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🔗 Links

- **Repository:** [github.com/rinosaputra/next-branch](https://github.com/rinosaputra/next-branch)
- **Branch:** `feature/dashboard-foundation`
- **Issues:** [github.com/rinosaputra/next-branch/issues](https://github.com/rinosaputra/next-branch/issues)
- **Documentation:** See branch-specific README files

---

## 💬 Support

- **GitHub Issues:** Report bugs or request features
- **Discussions:** Ask questions, share ideas
- **Pull Requests:** Contribute improvements

---

## 🙏 Acknowledgments

Built with best practices from:
- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth](https://www.better-auth.com)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Table](https://tanstack.com/table)
- [Prisma](https://www.prisma.io)
- [shadcn/ui](https://ui.shadcn.com)

---

**This is production-grade dashboard foundation.**
**Built with discipline. Designed for scale.**

🎯 Opinionated | 🏗️ Modular | 🚀 Production-Ready | 🔥 Extensible
