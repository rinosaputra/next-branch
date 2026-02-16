# 🚀 next-branch

**Opinionated fullstack Next.js starter template for experimenting and integrating modern packages like Prisma, Better Auth, shadcn/ui, and TanStack.**

A production-grade architectural foundation designed with **branch-based evolution**, clean integration patterns, and enterprise-ready structure.

---

## 🎯 Philosophy

This is **not** a boilerplate dump.  
This is **not** a component playground.  
This is **not** a tutorial project.

**next-branch** is:
- A **structured experimentation lab** for modern fullstack patterns
- A **reusable foundation** for scalable SaaS applications
- An **opinionated reference** for clean Next.js architecture
- A **Git workflow blueprint** for disciplined feature integration

---

## 🧱 Architecture Principles

1. **Modular but not fragmented** — Clear separation without over-engineering
2. **Opinionated but extensible** — Strong defaults with customization paths
3. **Minimal but powerful** — No unnecessary bloat, every dependency justified
4. **Clean integration** — Each tool added with architectural intent

---

## 🌿 Branch Strategy

```
default     →  Pure Next.js baseline (zero abstraction)
feature/*   →  Isolated integration per tool/feature
dev         →  Controlled integration branch (current)
main        →  Stable production snapshot
```

### Current Branch: `dev`

This branch represents the **integration testing ground** where feature branches are merged, validated, and stabilized before reaching `main`.

**What's integrated so far:**
- ✅ **shadcn/ui** — Minimal component infrastructure (New York preset)
- ✅ **Prisma ORM** — Type-safe database layer with PostgreSQL
- 🚧 **Better Auth** — Coming soon
- 🚧 **TanStack Query** — Coming soon
- 🚧 **TanStack Table** — Coming soon

---

## 📦 Tech Stack

### Core
- **Next.js 16.1.6** — App Router, React Server Components
- **React 19.2.3** — Latest stable release
- **TypeScript 5** — Full type safety

### UI Layer
- **Tailwind CSS v4** — Next-generation CSS architecture
- **shadcn/ui v3.8.4** — Composable UI primitives (on-demand installation)
- **Lucide React** — Icon system
- **Class Variance Authority** — Component variant management

### Database Layer
- **Prisma 7.4.0** — Type-safe ORM with migration system
- **PostgreSQL** — Recommended production database
- **@prisma/adapter-pg** — Connection pooling for serverless

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (LTS recommended)
- PostgreSQL database (local or hosted)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/rinosaputra/next-branch.git
cd next-branch
git checkout dev
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/next_branch_dev"
```

### 4. Database Setup
```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# (Optional) Open Prisma Studio
npx prisma studio
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🧠 Component Philosophy (shadcn/ui)

### ❌ What We DON'T Do
- Install all 40+ components upfront
- Create a "component showcase"
- Add unused dependencies

### ✅ What We DO
- Install components **on-demand** when features require them
- Keep dependency tree minimal
- Maintain clear separation between primitives and composed components

### Installing Components
```bash
# Install individual components as needed
npx shadcn@latest add button
npx shadcn@latest add form
npx shadcn@latest add card

# Or multiple at once
npx shadcn@latest add button input label
```

Components are installed to `components/ui/` and remain under your control.

---

## 🗄️ Database Architecture (Prisma)

### Schema Philosophy
- **Relational integrity** enforced at database level
- **Type-safe queries** without manual typing
- **Migration-first approach** — version-controlled schema evolution
- **Prepared for scale** — RBAC, audit logs, multi-tenant patterns

### Key Commands
```bash
# Create and apply migrations
npx prisma migrate dev --name descriptive_name

# Reset database (dev only)
npx prisma migrate reset

# Deploy migrations (production)
npx prisma migrate deploy
```

### Example Usage
```typescript
// app/api/users/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
```

---

## 📁 Project Structure

```
next-branch/
├── app/                    # Next.js App Router
│   ├── globals.css         # Tailwind + shadcn theme variables
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   └── ui/                 # shadcn components (installed on-demand)
├── lib/
│   ├── prisma.ts           # Prisma Client singleton
│   └── utils.ts            # Utility functions (cn, etc.)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Version-controlled migrations
├── components.json         # shadcn/ui configuration
├── next-branch.json        # Package metadata for npm
└── package.json
```

---

## 🛠️ Development Workflow

### Adding a New Feature
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Implement changes following architectural patterns
3. Test thoroughly in isolation
4. Open PR to `dev` for integration testing
5. After validation, merge to `main`

### Branch Lifecycle
```
feature/your-feature → dev → main
```

---

## 🔗 Roadmap

### ✅ Completed
- Next.js baseline setup
- Tailwind CSS v4 integration
- shadcn/ui infrastructure
- Prisma ORM setup with PostgreSQL

### 🚧 In Progress
- Better Auth integration (session-based + OAuth)
- TanStack Query for server state management
- TanStack Table for data-heavy UIs

### 🔮 Planned
- File upload strategy (S3-compatible)
- Multi-tenant architecture patterns
- RBAC implementation
- Audit logging system
- Email service integration
- Cache strategy (Redis)

---

## 📖 Documentation

- **[shadcn/ui Integration](./docs/shadcn-setup.md)** — Component strategy & installation guide
- **[Prisma Setup](./docs/prisma-setup.md)** — Database architecture & migration workflow
- *(Coming soon)* Better Auth setup
- *(Coming soon)* TanStack Query patterns

---

## 🤝 Contributing

This is an **open-source reference architecture**.

### How to Contribute
1. Fork the repository
2. Create a feature branch following our naming convention
3. Implement changes with clear architectural intent
4. Submit PR with detailed description
5. Ensure all tests pass and docs are updated

### Contribution Guidelines
- Follow the established architectural philosophy
- Keep integrations clean and justified
- Document decisions in relevant README files
- Maintain backward compatibility where possible

---

## 📄 License

MIT License

Copyright (c) 2026 Rino Saputra

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

---

## 🔗 Links

- **Repository**: [github.com/rinosaputra/next-branch](https://github.com/rinosaputra/next-branch)
- **Issues**: [github.com/rinosaputra/next-branch/issues](https://github.com/rinosaputra/next-branch/issues)
- **Discussions**: [github.com/rinosaputra/next-branch/discussions](https://github.com/rinosaputra/next-branch/discussions)

---

**Built with discipline. Designed for scale. Open for all.**