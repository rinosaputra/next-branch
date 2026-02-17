# 🔔 feature/sonner

**Isolated integration branch for Sonner toast notifications**

This branch integrates **Sonner**, a toast notification component from the shadcn/ui ecosystem, for non-blocking user feedback.

---

## 🎯 Purpose

Add global toast notification capability for:
- ✅ Background operations (file uploads, sync)
- ✅ Async operation feedback
- ✅ Real-time notifications
- ❌ NOT for inline form validation (use `<FormMessage />`)
- ❌ NOT for auth errors (use `<Alert />`)

---

## 📦 What's Included

### shadcn Component Added

| Component | Type | Purpose |
|-----------|------|---------|
| `sonner` | Toast | Non-blocking notifications |

**Installation method:** shadcn CLI (`npx shadcn@latest add sonner`)

### Dependencies Added

```json
{
  "dependencies": {
    "sonner": "^1.x.x",
    "next-themes": "^0.x.x"
  }
}
```

---

## 🚀 Installation

```bash
# Install via shadcn CLI
npx shadcn@latest add sonner

# This creates:
# - components/ui/sonner.tsx
# - Installs: sonner, next-themes
```

---

## 🔧 Integration

### Root Layout

```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

---

## 🧪 Usage Examples

### Basic Toast

```tsx
import { toast } from "sonner"

toast("Event has been created.")
```

### Toast Types

```tsx
toast.success("Operation successful!")
toast.error("Something went wrong")
toast.warning("Warning message")
toast.info("Information")
toast.loading("Processing...")
```

### Promise-based Toast

```tsx
toast.promise(
  fetch('/api/upload').then(res => res.json()),
  {
    loading: 'Uploading...',
    success: 'Upload complete!',
    error: 'Upload failed',
  }
)
```

### With Description

```tsx
toast.success("Profile updated", {
  description: "Your changes have been saved successfully.",
})
```

---

## 🎨 Configuration

### Position

```tsx
<Toaster position="top-right" />
// Options: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
```

### Rich Colors

```tsx
<Toaster richColors />
// Enables colored variants for success, error, etc.
```

### Close Button

```tsx
<Toaster closeButton />
// Adds X button to dismiss
```

---

## 🔗 Integration Points

Used by:
- **File Upload** (future) – Upload progress toasts
- **Real-time Sync** (future) – Background sync notifications
- **Data Operations** (future) – CRUD operation feedback

NOT used for:
- ❌ Form validation errors → Use `<FormMessage />`
- ❌ Auth errors → Use inline `<Alert />`
- ❌ Page-level errors → Use error boundary

---

## 📚 References

- [Sonner Documentation](https://sonner.emilkowal.ski)
- [shadcn/ui Sonner](https://ui.shadcn.com/docs/components/sonner)

---

**Part of [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
