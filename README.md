# 🎨 feature/shadcn-setup

**Isolated integration branch for shadcn/ui primitives**

This branch demonstrates a **minimal, production-grade shadcn/ui setup** for the **next-branch** fullstack architecture. It focuses on selective component installation, avoiding UI bloat, and maintaining architectural clarity.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It establishes shadcn/ui foundation by:

- Configuring shadcn/ui CLI and tooling
- Installing **only essential UI primitives** (no full component dump)
- Establishing component usage patterns
- Preparing foundation for auth UI and data-heavy interfaces
- Demonstrating "minimal but powerful" UI philosophy

**This is not a permanent branch.**
Once validated, it will be merged into `dev` as part of the controlled integration process.

---

## 📦 What's Included

### Core Setup
- **shadcn/ui CLI** configuration
- **Tailwind CSS v4** integration (already present)
- **Component installation strategy** (selective, justified)
- **TypeScript-first** component patterns
- **Accessibility** built-in (via Radix UI primitives)

### Installed Components (Tier 1: Foundational Primitives)

| Component | Purpose | Justification |
|-----------|---------|---------------|
| `button` | Primary actions | Universal need across all features |
| `input` | Text fields | Form foundation (auth, data entry) |
| `label` | Form labels | Accessibility requirement |
| `card` | Content containers | Layout primitive for sections |
| `alert` | Feedback messages | Error/success state communication |

**Total:** 5 components
**Approach:** Install additional components **only when features explicitly require them**

---

## 🚫 NOT Installed (By Design)

shadcn/ui offers 50+ components. We explicitly **DO NOT** install:

- ❌ All other components (accordion, avatar, badge, calendar, checkbox, etc.)
- ❌ Complex patterns (command palette, data tables, etc.)
- ❌ Experimental components

**Why?**
- Avoid UI bloat
- Maintain architectural focus
- Install on demand (as features need them)
- Keep bundle size minimal
- Prevent "component showcase" anti-pattern

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify shadcn/ui Configuration
Check `components.json`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 3. View Installed Components
```bash
ls components/ui
# Output: button.tsx, input.tsx, label.tsx, card.tsx, alert.tsx
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🧱 Architecture Decisions

### Why shadcn/ui?
- **Not a component library** – copy/paste approach, full ownership
- **Built on Radix UI** – accessibility and primitives built-in
- **Tailwind-native** – consistent with existing styling
- **TypeScript-first** – type safety enforced
- **Customizable** – modify components without fighting library constraints

### Why Minimal Component Set?
- **Avoid premature abstraction** – install when needed
- **Bundle size discipline** – only ship what's used
- **Architectural clarity** – this is not a UI showcase
- **Long-term maintainability** – fewer components = less maintenance
- **Scalability** – easy to add more later with justification

### Component Selection Criteria
A component is installed ONLY if:
1. ✅ Used by multiple features (not one-off)
2. ✅ Part of foundational patterns (auth, forms, layout)
3. ✅ Cannot be easily built with existing primitives
4. ✅ Provides accessibility benefits (Radix UI primitives)

---

## 📁 Directory Structure

```
/components
  └── ui/                    # shadcn/ui components
      ├── button.tsx         # Primary action component
      ├── input.tsx          # Text input field
      ├── label.tsx          # Form label (accessibility)
      ├── card.tsx           # Content container
      └── alert.tsx          # Feedback message

/lib
  └── utils.ts               # cn() helper (Tailwind class merging)

/app
  └── globals.css            # Tailwind + shadcn/ui CSS variables

components.json              # shadcn/ui configuration
tailwind.config.ts           # Tailwind v4 config
```

---

## 🧪 Component Usage Examples

### Button
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Sign In</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Learn More</Button>
```

### Input + Label
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Your content here</p>
  </CardContent>
</Card>
```

### Alert
```tsx
import { Alert, AlertDescription } from "@/components/ui/alert"

<Alert>
  <AlertDescription>
    Your password has been reset successfully.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertDescription>
    Invalid credentials. Please try again.
  </AlertDescription>
</Alert>
```

---

## 🔄 Adding More Components (When Needed)

### Process
1. **Identify need** – feature explicitly requires component
2. **Justify** – explain why existing primitives are insufficient
3. **Install** – use shadcn CLI
4. **Document** – update this README with justification
5. **Commit** – clear message explaining WHY component was added

### Example
```bash
# Future: Auth UI needs checkbox for "Remember me"
npx shadcn@latest add checkbox

# Commit with justification
git commit -m "shadcn: add checkbox component

Justification: Required for 'Remember me' functionality in login form.
Cannot be built with existing primitives while maintaining accessibility."
```

---

## 🔗 Integration Points

This branch is designed to integrate with:

- **Better Auth** (`feature/better-auth-setup`) – auth forms UI
- **TanStack Query** (future) – loading states, error handling
- **TanStack Table** (future) – data display components
- **Auth UI** (`feature/auth-ui`) – login/register forms

---

## 🛡️ Best Practices Implemented

✅ **Selective installation** (not full component dump)
✅ **Accessibility-first** (Radix UI primitives)
✅ **Type-safe** (full TypeScript support)
✅ **Customizable** (components in repo, not node_modules)
✅ **Tailwind-native** (consistent styling strategy)
✅ **CSS variables** (theme customization ready)

---

## 🚧 Known Limitations

- Form validation components not installed yet (add `form` when integrating react-hook-form)
- Data display components not included (add `table`, `badge` when building data views)
- Modal/dialog patterns not configured (add `dialog` when needed)
- Toast notifications not set up (add `toast` when implementing global feedback)

---

## 📚 Component Roadmap

### Future Additions (Install When Needed)

| Tier | Components | When to Add |
|------|-----------|-------------|
| **Tier 2: Forms** | `form`, `checkbox`, `radio-group`, `select`, `textarea` | When building auth UI or data entry forms |
| **Tier 3: Data** | `table`, `badge`, `avatar`, `separator` | When building data-heavy interfaces |
| **Tier 4: Interactions** | `dialog`, `dropdown-menu`, `popover`, `toast` | When adding modals, menus, notifications |
| **Tier 5: Advanced** | `command`, `calendar`, `date-picker`, `tabs` | Only if explicitly required by features |

**Principle:** Install incrementally, justify each addition.

---

## 📖 References

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🧭 Branch Lifecycle

```
default → feature/shadcn-setup → dev → main
```

**Current Status:** 🟡 Isolated integration branch
**Next Step:** Validation & merge into `dev` after component testing
**End Goal:** Stable release in `main` as part of foundational UI stack

---

## 📝 Contributing to This Branch

If working on this branch:

1. **Only add components when explicitly needed** – avoid bulk installation
2. **Justify each addition in commit message** – explain WHY component is required
3. **Update this README** when adding new components
4. **Test accessibility** – ensure keyboard navigation and screen reader support
5. **Keep components minimal** – resist customization bloat

### Commit Message Format
```bash
git commit -m "shadcn: add <component> for <use-case>

Justification: <why existing primitives are insufficient>
Use case: <which feature requires this component>"
```

---

## 🎯 Success Criteria

This branch is ready to merge when:

- ✅ Tier 1 components installed and tested
- ✅ Component usage patterns documented
- ✅ Accessibility verified (keyboard nav, screen readers)
- ✅ Integration with Tailwind CSS v4 confirmed
- ✅ TypeScript types working correctly
- ✅ No UI bloat (only essential components)

---

## 🔥 Philosophy Reminder

> **"This is not a UI showcase repo."**
> **"This is an architecture foundation."**

shadcn/ui is a **tool**, not the focus.
We use it to enable **production-grade features**, not to demonstrate UI capabilities.

Every component must earn its place through **real feature needs**, not hypothetical use cases.

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
