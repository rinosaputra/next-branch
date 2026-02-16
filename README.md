# Next Branch – shadcn/ui Integration

This branch represents the **shadcn/ui setup baseline** for the `next-branch` repository.

It contains the initialized configuration for shadcn/ui with:

- shadcn/ui v3.x (initialized via CLI)
- Component infrastructure ready
- New York style preset
- Lucide React icons
- CVA (Class Variance Authority)
- Tailwind merge utilities

**No components are installed yet.** This branch follows the principle of on-demand component installation.

---

## 🎯 Purpose of This Branch

The `feature/shadcn-setup` branch serves as:

- **UI foundation baseline** – Ready for component installation
- **Configuration reference** – Demonstrates shadcn/ui integration with Tailwind v4
- **Staging area** – Will be merged to `dev` once validated
- **Minimal approach** – Only essentials, no bloat

This is **not** a UI showcase. This is an **architecture foundation**.

---

## 📦 What's Included

### Dependencies Added

```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.564.0",
  "tailwind-merge": "^3.4.1"
}
```

### Configuration Files

- `components.json` – shadcn/ui config (New York style, RSC enabled)
- Path aliases configured (`@/components`, `@/lib`, `@/hooks`)
- Tailwind CSS v4 integration
- `globals.css` with CSS variables for theming

### File Structure

```
.
├── app/
│   ├── globals.css          # Tailwind + shadcn variables
│   ├── layout.tsx
│   └── page.tsx
├── components/              # Will contain shadcn components
│   └── ui/                  # Component installation target
├── lib/
│   └── utils.ts             # cn() utility for class merging
├── components.json          # shadcn/ui config
└── package.json
```

---

## 🧠 Component Strategy

### ❌ What We DON'T Do

- Install all 40+ components upfront
- Create a "component playground"
- Add unused dependencies

### ✅ What We DO

- Install components **on-demand** when feature requires it
- Keep dependency tree minimal
- Maintain clear separation between primitives and composed components

### Recommended Installation Tiers

**Tier 1: Core Primitives** (Install when needed for forms/layouts)
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add form
npx shadcn@latest add card
```

**Tier 2: Navigation & Feedback** (Install for UX patterns)
```bash
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
npx shadcn@latest add dialog
```

**Tier 3: Advanced/Specific** (Install per feature branch)
- `table` / `data-table` → When integrating TanStack Table
- `select` / `checkbox` / `radio-group` → When building complex forms
- `tabs` / `accordion` / `sheet` → When layout requires it

---

## 🚀 Getting Started

### Clone and Switch to This Branch

```bash
git clone https://github.com/rinosaputra/next-branch.git
cd next-branch
git checkout feature/shadcn-setup
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

### Install Components (Example)

```bash
# Install button component
npx shadcn@latest add button

# Install multiple components
npx shadcn@latest add button input card
```

Components will be installed to `components/ui/`.

---

## 🌱 Branch Workflow

```
default (baseline)
    ↓
feature/shadcn-setup (current)
    ↓
dev (integration)
    ↓
main (stable)
```

### Next Steps for This Branch

1. ✅ shadcn/ui initialized
2. ⏳ Install **Tier 1** components (optional validation)
3. ⏳ Create simple demo page (optional)
4. ⏳ Merge to `dev`

---

## 🔧 Configuration Details

### Style Preset

**New York** – Modern, minimal, refined aesthetic

- Clean component design
- Subtle shadows and borders
- Professional look & feel

### Path Aliases

```json
{
  "@/components": "./components",
  "@/lib": "./lib",
  "@/ui": "./components/ui",
  "@/hooks": "./hooks"
}
```

### Tailwind Integration

- **Tailwind CSS v4** (next-gen architecture)
- CSS variables for theming
- `neutral` base color
- `tw-animate-css` for animations

---

## 📚 Tech Stack (This Branch)

- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui v3.8.4
- Lucide React (icons)
- Class Variance Authority
- Radix UI (via shadcn components)

---

## 🧠 About Next Branch

`next-branch` is a **production-grade Next.js fullstack starter architecture** designed with:

- **Branch-based evolution** – Feature isolation via Git branches
- **Opinionated but extensible** – Clear patterns, room to customize
- **Minimal but powerful** – No unnecessary bloat
- **Enterprise-ready** – Built for scale from day one

Each branch represents a stage of stack integration, following a disciplined merge strategy.

---

## 📖 Related Branches

- `default` → Pure Next.js baseline
- `dev` → Integration branch (all features merge here first)
- `main` → Stable production snapshot
- `feature/prisma` → Database layer integration (planned)
- `feature/auth` → Better Auth integration (planned)

---

## 🤝 Contributing

This is an open-source reference architecture.

If you use this as a starter:

- Fork and customize freely
- Share improvements via PR
- Report architectural issues

---

## 📄 License

MIT License

Copyright (c) 2026 Rino Saputra

---

## 🔗 Links

- [Repository](https://github.com/rinosaputra/next-branch)
- [Issues](https://github.com/rinosaputra/next-branch/issues)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Next.js Docs](https://nextjs.org/docs)