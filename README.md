# 🚀 next-branch

**Opinionated, production-grade Next.js fullstack starter architecture**

A modern fullstack reference implementation with clean Git workflow, branch-based evolution, and enterprise-ready foundation.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 🎯 What is next-branch?

`next-branch` is not just another boilerplate.

It's a **structured architectural foundation** that demonstrates:

- ✅ **Production-grade integrations** (Better Auth, Prisma, TanStack Query)
- ✅ **Clean Git workflow** with branch-based evolution
- ✅ **Feature isolation** through disciplined branch strategy
- ✅ **Modular architecture** without fragmentation
- ✅ **Enterprise-ready patterns** (RBAC, email verification, dark mode)
- ✅ **Scalable foundation** for SaaS applications

This is **not**:
- ❌ A kitchen-sink boilerplate with every tool dumped in
- ❌ A UI component showcase
- ❌ A beginner tutorial project

This **is**:
- ✅ A serious open-source engineering initiative
- ✅ A reusable enterprise-ready starter template
- ✅ An opinionated architecture blueprint
- ✅ A demonstration of professional Git workflow

---

## 🧱 Architectural Philosophy

### Core Principles

1. **Modular but not fragmented** – Clear boundaries, clean integration
2. **Opinionated but extensible** – Strong defaults, flexible customization
3. **Minimal but powerful** – Only essential tools, maximum capability
4. **No unnecessary bloat** – Every dependency justified
5. **Clean integration, not package dumping** – Structured, documented additions

### Branch-Based Evolution

Branches are **experimentation spaces**, not permanent stack variants.

```
default → feature/* → dev → main
   ↓         ↓        ↓      ↓
baseline  isolated  integration  stable
```

Each integration is:
- **Justified** – Solves real architectural needs
- **Structured** – Clean implementation, clear boundaries
- **Future-proof** – Scalable, maintainable patterns
- **Non-breaking** – Backward compatible, tested

---

## 📦 Technology Stack

### Core Framework

| Technology       | Version | Purpose                                       |
| ---------------- | ------- | --------------------------------------------- |
| **Next.js**      | 15.x    | App Router, Server Components, Server Actions |
| **TypeScript**   | 5.x     | Type safety, developer experience             |
| **React**        | 19.x    | UI library with concurrent features           |
| **Tailwind CSS** | 4.x     | Utility-first styling                         |

### Infrastructure

| Technology      | Purpose                   | Status       |
| --------------- | ------------------------- | ------------ |
| **Prisma**      | Database ORM (PostgreSQL) | ✅ Integrated |
| **Better Auth** | Authentication & RBAC     | ✅ Integrated |
| **Resend**      | Transactional emails      | ✅ Integrated |
| **React Email** | Email templates           | ✅ Integrated |

### UI & Forms

| Technology          | Purpose                 | Status        |
| ------------------- | ----------------------- | ------------- |
| **shadcn/ui**       | Essential UI primitives | ✅ Minimal set |
| **react-hook-form** | Form state management   | ✅ Integrated  |
| **Zod**             | Schema validation       | ✅ Integrated  |
| **next-themes**     | Dark mode support       | ✅ Integrated  |
| **Sonner**          | Toast notifications     | ✅ Integrated  |

### Data Management

| Technology         | Purpose                 | Status       |
| ------------------ | ----------------------- | ------------ |
| **TanStack Query** | Data fetching & caching | ✅ Integrated |
| **TanStack Table** | Data-heavy UI           | 🔄 Planned    |

### Future Roadmap

- 🔄 File upload strategy (S3/Cloudflare R2)
- 🔄 Audit log system
- 🔄 Multi-role management
- 🔄 Advanced caching strategy
- 🔄 Webhook infrastructure
- 🔄 API rate limiting

---

## 🌿 Branch Strategy

### Branch Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                         main (stable)                        │
│                   Production-ready releases                  │
└────��────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                      dev (integration)                       │
│              Controlled integration branch                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
┌────────┴──────┐  ┌──────┴──────┐  ┌────┴──────────┐
│  feature/*    │  │  feature/*  │  │  feature/*    │
│ (isolated)    │  │ (isolated)  │  │ (isolated)    │
└────────┬──────┘  └──────┬──────┘  └────┬──────────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                  ┌───────┴────────┐
                  │    default     │
                  │   (baseline)   │
                  └────────────────┘
```

### Branch Types

| Branch      | Purpose                                  | Lifespan  |
| ----------- | ---------------------------------------- | --------- |
| `default`   | Pure Next.js baseline (zero abstraction) | Permanent |
| `feature/*` | Isolated integration per tool/feature    | Temporary |
| `dev`       | Controlled integration and testing       | Permanent |
| `main`      | Stable production-ready releases         | Permanent |

### Branch Philosophy

> **"Branch bukan tempat menyimpan variasi permanen stack."**
> **"Branch adalah ruang eksperimen yang akan disatukan secara disiplin."**

Branches are **not** for permanent stack variants.
Branches are **experimentation spaces** that merge into `dev` with discipline.

---

## 📚 Branch Catalog

### 🏗️ Infrastructure Branches

| Branch                      | Description                                                                                                  | Status     | Dependencies           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------- |
| `feature/prisma-setup`      | Database ORM with PostgreSQL adapter, schema management, migration strategy                                  | ✅ Complete | `default`              |
| `feature/better-auth-setup` | Authentication framework with session management, RBAC foundation, Prisma adapter                            | ✅ Complete | `feature/prisma-setup` |
| `feature/shadcn-setup`      | Essential UI primitives (Button, Input, Form), Tailwind configuration, CVA patterns                          | ✅ Complete | `default`              |
| `feature/form-validation`   | Form state management (react-hook-form), schema validation (Zod), type-safe forms                            | ✅ Complete | `default`              |
| `feature/email-setup`       | Transactional email infrastructure (Resend), React Email templates with Tailwind, development preview server | ✅ Complete | `default`              |
| `feature/theme-provider`    | Dark mode support (next-themes), theme persistence, consistent theming                                       | ✅ Complete | `default`              |
| `feature/sonner`            | Toast notification system with success/error feedback, user interaction feedback                             | ✅ Complete | `default`              |
| `feature/tanstack-query`    | Data fetching and caching strategy, optimistic updates, background sync                                      | ✅ Complete | `default`              |

### 🎨 Feature Branches

| Branch                     | Description                                                                                                                                                                                 | Status        | Dependencies                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `feature/auth-ui`          | Complete authentication UI (login, register, forgot password, reset password, email verification), email templates (verification, reset, welcome), Better Auth integration with email flows | ✅ Complete    | `feature/better-auth-setup`<br>`feature/email-setup`<br>`feature/form-validation`<br>`feature/shadcn-setup`<br>`feature/sonner` |
| `feature/dashboard-layout` | Protected dashboard layout system, navigation sidebar with theme support, user menu with logout, theme toggle component                                                                     | 🚧 In Progress | `feature/better-auth-setup`<br>`feature/theme-provider`                                                                         |

### 🔄 Future Branches (Planned)

| Branch                        | Description                                                                        | Status    | Dependencies                                              |
| ----------------------------- | ---------------------------------------------------------------------------------- | --------- | --------------------------------------------------------- |
| `feature/dashboard-analytics` | Analytics dashboard with data visualization                                        | 🔄 Planned | `feature/dashboard-layout`<br>`feature/tanstack-query`    |
| `feature/user-management`     | User CRUD operations, role management, user profile                                | 🔄 Planned | `feature/dashboard-layout`<br>`feature/better-auth-setup` |
| `feature/file-upload`         | File upload infrastructure (S3/Cloudflare R2), image optimization, upload progress | 🔄 Planned | `feature/dashboard-layout`                                |
| `feature/audit-log`           | System audit trail, user action logging, compliance tracking                       | 🔄 Planned | `feature/prisma-setup`                                    |
| `feature/api-rate-limiting`   | API rate limiting, request throttling, quota management                            | 🔄 Planned | `default`                                                 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or later
- **PostgreSQL** 15.x or later
- **pnpm** 9.x or later (recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/rinosaputra/next-branch.git
cd next-branch

# Checkout main branch
git checkout main

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env

# Configure your database URL and other variables
# Edit .env file

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

```env
# Application
NEXT_PUBLIC_APP_NAME="Next.js Starter"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/next_branch"

# Better Auth
BETTER_AUTH_SECRET="your-generated-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_xxx"
EMAIL_FROM="noreply@yourdomain.com"
SKIP_EMAIL_SENDING="true"  # Development mode
```

---

## 📖 Documentation

### For Users

- [Getting Started Guide](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [Authentication](docs/authentication.md)
- [Email System](docs/email.md)
- [Database Schema](docs/database.md)

### For Contributors

- [Contributing Guide](CONTRIBUTING.md)
- [Branch Strategy](docs/branch-strategy.md)
- [Code Style Guide](docs/code-style.md)
- [Testing Guide](docs/testing.md)

---

## 🎨 Features

### ✅ Authentication System

- Email/password authentication with Better Auth
- Email verification with 24-hour token expiration
- Password reset with 1-hour token expiration
- Session management with HTTP-only cookies
- Protected routes with server-side validation
- RBAC foundation ready for role-based access

### ✅ Email Infrastructure

- Transactional emails with Resend
- React Email templates with Tailwind CSS
- Auto-conversion of Tailwind classes to inline styles
- Email templates:
  - Verification email
  - Password reset email
  - Welcome email (post-verification)
- Development preview server (`npm run email:dev`)
- Browser-based email previews (`/preview/email`)

### ✅ Form Management

- Type-safe forms with react-hook-form + Zod
- Client-side and server-side validation
- Accessible form components (ARIA support)
- Error handling with clear feedback
- Loading states and submission control

### ✅ UI System

- Dark mode support with next-themes
- Essential shadcn/ui components (minimal set)
- Consistent design system with Tailwind
- Accessible UI primitives
- Toast notifications with Sonner

### ✅ Data Management

- TanStack Query for data fetching and caching
- Optimistic updates
- Background synchronization
- Request deduplication
- Automatic refetching

### 🚧 In Progress

- Dashboard layout with protected routes
- Navigation system with theme support
- User menu with logout functionality

### 🔄 Planned

- Analytics dashboard
- User management system
- File upload infrastructure
- Audit log system
- API rate limiting

---

## 🧪 Testing

```bash
# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Run tests (when implemented)
pnpm test

# Run Prisma Studio (database GUI)
pnpm db:studio
```

---

## 📝 Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Prisma Studio
pnpm db:generate      # Generate Prisma Client

# Email
pnpm email:dev        # Start email preview server

# Code Quality
pnpm typecheck        # Run TypeScript type checking
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

---

## 🏗️ Project Structure

```
next-branch/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/[token]/
│   │   └── verify-email/[token]/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   └── dashboard/
│   ├── preview/                  # Development preview routes
│   │   └── email/
│   └── api/                      # API routes
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui primitives
│   ├── auth/                     # Authentication components
│   └── dashboard/                # Dashboard components
│
├── lib/                          # Utilities and configurations
│   ├── auth.ts                   # Better Auth configuration
│   ├── prisma.ts                 # Prisma client instance
│   ├── email/                    # Email infrastructure
│   │   ├── client.ts             # Resend client
│   │   ├── send.ts               # Email sending utility
│   │   ├── components/           # Base email components
│   │   └── templates/            # Email templates
│   └── validations/              # Zod schemas
│
├── prisma/                       # Database schema and migrations
│   └── schema.prisma
│
├── public/                       # Static assets
├── docs/                         # Documentation
└── emails/                       # Email preview files (dev only)
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. **Fork the repository**
2. **Create feature branch** from `default`:
   ```bash
   git checkout -b feature/your-feature default
   ```
3. **Make changes** following our [Code Style Guide](docs/code-style.md)
4. **Test thoroughly** in development mode
5. **Submit pull request** to `dev` branch
6. **Wait for review** and address feedback

### Branch Contribution Guidelines

- Infrastructure branches: Branch from `default`, merge to `dev`
- Feature branches: Branch from `dev` (with infrastructure), merge to `dev`
- Use `--no-ff` for all merges to preserve history
- Write descriptive commit messages
- Update documentation for new features

---

## 🔒 Security

### Reporting Security Issues

If you discover a security vulnerability, please email **security@example.com** instead of using the issue tracker.

### Security Features

- ✅ HTTP-only cookies for sessions
- ✅ CSRF protection with Better Auth
- ✅ Password hashing with bcrypt
- ✅ Secure token generation
- ✅ Token expiration (24h verification, 1h reset)
- ✅ Email verification required in production
- ✅ Server-side session validation
- ✅ Type-safe API with TypeScript

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Technologies

- [Next.js](https://nextjs.org) - The React Framework for Production
- [Better Auth](https://better-auth.com) - Type-safe authentication
- [Prisma](https://prisma.io) - Next-generation ORM
- [Resend](https://resend.com) - Email for developers
- [React Email](https://react.email) - Email templates with React
- [shadcn/ui](https://ui.shadcn.com) - Re-usable components
- [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

### Inspiration

This architecture is inspired by production-grade systems and modern engineering practices:
- Clean architecture principles
- Domain-driven design
- Branch-based development workflow
- Feature isolation patterns
- Progressive enhancement

---

## 📞 Contact

- **GitHub**: [@rinosaputra](https://github.com/rinosaputra)
- **Repository**: [next-branch](https://github.com/rinosaputra/next-branch)
- **Issues**: [GitHub Issues](https://github.com/rinosaputra/next-branch/issues)

---

## 🌟 Star History

If you find this project helpful, please consider giving it a star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=rinosaputra/next-branch&type=Date)](https://star-history.com/#rinosaputra/next-branch&Date)

---

## 📊 Repository Stats

![GitHub Stars](https://img.shields.io/github/stars/rinosaputra/next-branch?style=social)
![GitHub Forks](https://img.shields.io/github/forks/rinosaputra/next-branch?style=social)
![GitHub Issues](https://img.shields.io/github/issues/rinosaputra/next-branch)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/rinosaputra/next-branch)

---

<div align="center">

**Built with discipline. Designed for scale.**

*Part of the next-branch architecture initiative.*

[⬆ Back to Top](#-next-branch)

</div>
