# Next Branch – Default

This branch represents the **baseline Next.js setup** for the `next-branch` repository.

It contains a clean and minimal installation of Next.js using:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- ESLint

No additional integrations (Prisma, Better Auth, shadcn/ui, TanStack, etc.) are included in this branch.

---

## 🎯 Purpose of This Branch

The `default` branch serves as:

- A clean starting point
- A comparison baseline for other branches
- The foundation for feature integrations
- A reference for minimal Next.js configuration

If you are looking for a more complete starter with additional packages integrated, please check other branches.

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/rinosaputra/next-branch.git
cd next-branch
git checkout default
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` if needed (optional for baseline setup).

Run development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## ⚙️ Environment Variables

This branch uses minimal environment configuration:

```env
# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Next.js Starter"
```

**Note:** Database, authentication, and other service variables are added in feature branches (`feature/prisma-setup`, `feature/better-auth-setup`, etc.)

---

## 🌱 Branch Strategy Overview

- `default` → Clean Next.js baseline (this branch)
- `dev` → Integration branch (feature merging)
- `feature/*` → Feature development branches
- `main` → Stable integrated version (if available)

---

## 📦 Tech Stack (Default Branch)

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

**No additional packages installed.**

---

## 🔗 Feature Branches

To explore specific integrations, check out these feature branches:

| Branch | Integration |
|--------|-------------|
| `feature/prisma-setup` | Prisma ORM + PostgreSQL |
| `feature/better-auth-setup` | Better Auth + Prisma |
| `feature/shadcn-setup` | shadcn/ui components (minimal) |
| `feature/auth-ui` | Authentication UI pages |

Each branch builds incrementally on this baseline.

---

## 🧠 About This Repository

`next-branch` is a public experimental repository designed to explore and integrate modern fullstack tools in a structured way.

Each branch may represent a different stage of stack integration.

**Philosophy:**
- Branch-based evolution
- Modular but not fragmented
- Clean integration, not package dumping
- Production-grade patterns

---

## 📄 License

MIT License

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
