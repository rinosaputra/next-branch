# 🗄️ feature/prisma-setup

**Isolated integration branch for Prisma ORM**

This branch demonstrates a **clean, production-grade Prisma setup** for the **next-branch** fullstack architecture. It focuses on relational database patterns, type-safe queries, and migration strategy suitable for scalable Next.js applications.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It isolates Prisma integration to:

- Establish clean database architecture patterns
- Configure Prisma Client for Next.js App Router
- Implement migration workflows for development and production
- Demonstrate type-safe database access layer
- Set up foundational schema structure for future features (auth, RBAC, audit logs)

**This is not a permanent branch.**  
Once validated, it will be merged into `dev` as part of the controlled integration process.

---

## 📦 What's Included

### Core Setup
- **Prisma Client** configuration optimized for Next.js
- **Database schema** (`schema.prisma`) with foundational models
- **Migration strategy** (development vs production workflow)
- **Type generation** integrated with TypeScript
- **Connection pooling** best practices for serverless/edge environments

### Schema Design Principles
- Relational integrity enforced at DB level
- UUID-based primary keys (or sequential ID where appropriate)
- Timestamp tracking (`createdAt`, `updatedAt`)
- Soft delete pattern where applicable
- Prepared for multi-tenant or RBAC extension

### Environment Configuration
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
Create a `.env` file with your `DATABASE_URL`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/next_branch_dev"
```

### 3. Run Migrations
```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. (Optional) Seed Database
```bash
npx prisma db seed
```

### 6. View Database in Prisma Studio
```bash
npx prisma studio
```

---

## 🧱 Architecture Decisions

### Why Prisma?
- **Type-safe** queries without manual typing
- **Migration system** built-in (no need for external tools)
- **Developer experience** via Prisma Studio
- **Edge-compatible** client generation
- **Active ecosystem** with strong Next.js support

### Database Choice
This setup is **database-agnostic** but optimized for:
- PostgreSQL (recommended for production)
- MySQL/MariaDB (supported)
- SQLite (local dev only)

### Schema Philosophy
- **No premature abstraction** – start simple, extend as needed
- **Relational integrity** – leverage FK constraints
- **Explicit naming** – clear table/column names
- **Audit-ready structure** – prepared for logging/tracking layers

---

## 📁 Directory Structure

```
/prisma
  ├── schema.prisma       # Main database schema
  ├── migrations/         # Version-controlled migration history
  └── seed.ts             # (Optional) Seed script for dev data

/lib
  └── prisma.ts           # Prisma Client singleton (Next.js optimized)
```

---

## 🔄 Migration Workflow

### Development
```bash
npx prisma migrate dev --name descriptive_change_name
```
- Creates migration files
- Applies to local database
- Regenerates Prisma Client

### Production
```bash
npx prisma migrate deploy
```
- Applies pending migrations
- Does NOT create new migrations
- Safe for CI/CD pipelines

### Reset (Dev Only)
```bash
npx prisma migrate reset
```
⚠️ **Destructive** – drops database and re-applies all migrations

---

## 🛡️ Best Practices Implemented

✅ **Singleton pattern** for Prisma Client (prevents connection exhaustion in dev)  
✅ **Environment-based connection string** (`.env` not committed)  
✅ **Migration history versioned** in Git  
✅ **Generated client gitignored** (regenerated on `postinstall`)  
✅ **Type safety** enforced via generated types  

---

## 🧪 Testing Database Queries

Example usage in Next.js App Router:

```typescript
// app/api/users/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
```

---

## 🔗 Integration Points

This branch is designed to integrate with:

- **Better Auth** (`feature/better-auth`) – user authentication tables
- **RBAC system** (future) – roles and permissions models
- **Audit logging** (future) – change tracking architecture
- **TanStack Query** (`feature/tanstack-query`) – data fetching layer

---

## 🚧 Known Limitations

- No seed data included yet (add as needed)
- No connection pooling example (add PgBouncer/Supabase Pooler docs if needed)
- No multi-schema setup (future enhancement)

---

## 📚 References

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js + Prisma Best Practices](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
- [Database Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

## 🧭 Branch Lifecycle

```
feature/prisma-setup → dev → main
```

**Current Status:** 🟡 Isolated integration branch  
**Next Step:** Validation & merge into `dev` after testing  
**End Goal:** Stable release in `main` as part of foundational stack  

---

## 📝 Contributing to This Branch

If working on this branch:
1. Keep schema changes minimal and justified
2. Always create migrations (never edit schema without migrating)
3. Document any architectural decisions in this README
4. Test migrations on a clean database before pushing
5. Ensure generated client is gitignored

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**