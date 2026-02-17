# ⚡ feature/tanstack-query

**Isolated integration branch for TanStack Query (React Query)**

This branch establishes a **production-grade, type-safe data fetching infrastructure** for the **next-branch** fullstack architecture. It focuses on client-side state management, intelligent caching strategy, and seamless integration with Next.js App Router.

---

## 🎯 Purpose

This branch is part of the **branch-based evolution strategy** used in `next-branch`. It provides foundational data fetching capabilities:

- **Async state management** for server data
- **Intelligent caching** with configurable strategies
- **Automatic background refetching** and invalidation
- **Optimistic updates** support
- **DevTools integration** for debugging (development only)
- **Type-safe queries and mutations** with TypeScript

**This is not a permanent branch.**
Once validated, it will be merged into `dev` and used by feature branches that require data fetching (auth state, user profiles, data tables, etc.).

---

## 📦 What's Included

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | ^5.x.x | Data fetching & caching library |
| `@tanstack/react-query-devtools` | ^5.x.x | Dev-only debugging tools |

### Infrastructure Components

| File | Purpose |
|------|---------|
| `/lib/react-query/client.ts` | QueryClient configuration |
| `/lib/react-query/provider.tsx` | QueryClientProvider wrapper |
| `/app/layout.tsx` | Root layout integration |

### Configuration Strategy

- **staleTime:** 60 seconds (data considered fresh)
- **cacheTime:** 5 minutes (data kept in cache after last use)
- **retry:** 1 attempt (fail fast, avoid hanging UX)
- **refetchOnWindowFocus:** false (explicit refetch preferred)

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
    "@tanstack/react-query": "^5.x.x"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.x.x"
  }
}
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Open DevTools (Development Only)

- Navigate to any page
- Look for floating TanStack Query icon in bottom-right
- Click to inspect queries, mutations, cache state

---

## 🧱 Architecture Decisions

### Why TanStack Query?

#### **Modern Standard**
- Most widely adopted React data fetching library
- ~49k+ GitHub stars, battle-tested in production
- Framework-agnostic core (works with Next.js, Remix, etc.)

#### **Intelligent Caching**
- Automatic background refetching
- Deduplication of identical requests
- Cache invalidation strategies
- Stale-while-revalidate patterns

#### **Developer Experience**
- TypeScript-first design
- Powerful DevTools
- Simple, declarative API
- Excellent documentation

#### **Performance**
- Small bundle size (~13KB gzipped)
- Request deduplication
- Automatic garbage collection
- Optimistic updates support

### Why Not Alternatives?

| Alternative | Why Not |
|-------------|---------|
| **SWR** | Less flexible cache invalidation, fewer features |
| **RTK Query** | Redux-specific, larger bundle, more boilerplate |
| **Apollo Client** | GraphQL-specific, larger bundle, unnecessary for REST |
| **fetch + useState** | Manual cache management, not scalable |

---

## 📁 Directory Structure

```
/lib
  └── react-query/
      ├── client.ts           # QueryClient configuration
      └── provider.tsx        # QueryClientProvider wrapper

/app
  └── layout.tsx              # Root layout with QueryProvider

package.json                  # Dependencies added
```

---

## 🧪 Configuration Details

### QueryClient Setup

```typescript
// lib/react-query/client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 1 minute
      staleTime: 60 * 1000,

      // Data stays in cache for 5 minutes after last use
      cacheTime: 5 * 60 * 1000,

      // Disable automatic refetch on window focus
      // (prefer explicit refetch for better UX control)
      refetchOnWindowFocus: false,

      // Retry failed queries once before giving up
      // (fail fast to avoid hanging UI)
      retry: 1,
    },
  },
})
```

### Provider Integration

```typescript
// lib/react-query/provider.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './client'

export function QueryProvider({ children }: { children: React.NodeNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

### Root Layout Integration

```typescript
// app/layout.tsx
import { QueryProvider } from '@/lib/react-query/provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
```

---

## 🧪 Usage Patterns

### Basic Query

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'

export function UserProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const res = await fetch('/api/user/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      return res.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>Welcome, {data.name}</div>
}
```

---

### Query with Parameters

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'

export function UserPosts({ userId }: { userId: string }) {
  const { data } = useQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/posts`)
      return res.json()
    },
    enabled: !!userId, // Only run query if userId exists
  })

  return (
    <ul>
      {data?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

---

### Mutation (Create/Update/Delete)

```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function CreatePostForm() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newPost: { title: string; content: string }) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })
      return res.json()
    },
    onSuccess: () => {
      // Invalidate and refetch posts query
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ title: 'New Post', content: 'Content here' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  )
}
```

---

### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updatePost,
  onMutate: async (newData) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries({ queryKey: ['posts'] })

    // Snapshot previous value
    const previousPosts = queryClient.getQueryData(['posts'])

    // Optimistically update cache
    queryClient.setQueryData(['posts'], (old) => [...old, newData])

    // Return context with snapshot
    return { previousPosts }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['posts'], context.previousPosts)
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})
```

---

## 🔗 Integration Points

This branch is designed to be used by:

- **Auth UI** (`feature/auth-ui`) – Session state, user profile queries
- **User Profile** (future) – Profile data fetching, update mutations
- **Data Tables** (future) – Paginated data queries, infinite scroll
- **Admin Dashboard** (future) – Real-time data, background refetching
- **Any feature requiring server data** – Universal data fetching layer

---

## 🛡️ Best Practices Implemented

✅ **Centralized configuration** – Single QueryClient instance
✅ **Type-safe queries** – Full TypeScript support
✅ **Dev-only DevTools** – Tree-shaken in production build
✅ **Smart caching** – Balance between UX and server load
✅ **Fail-fast retry** – Avoid hanging user experience
✅ **Explicit refetch control** – No surprise background fetches
✅ **Provider pattern** – Clean React Server Components compatibility

---

## 🚧 Current State

### ✅ Completed
- Dependencies installed (@tanstack/react-query + devtools)
- QueryClient configured with production-grade defaults
- QueryClientProvider set up in root layout
- DevTools integrated (development only)
- Infrastructure ready for feature branches

### 🔄 Pending (Feature Branch Work)
- Feature-specific query hooks (goes in `feature/auth-ui`, etc.)
- Mutations for CRUD operations (goes in feature branches)
- Prefetching patterns (implement per feature need)
- SSR hydration patterns (if needed for specific features)

### 🎯 Will Be Used By
- `feature/auth-ui` – Auth state management
- `feature/user-profile` (future) – Profile queries
- `feature/data-tables` (future) – Table data queries
- Any feature requiring client-side data fetching

---

## 📚 Cache Strategy Explained

### staleTime (60 seconds)
**What:** How long data is considered "fresh"
**Effect:** No automatic refetch within 60s
**Why:** Reduce unnecessary server requests, improve UX

### cacheTime (5 minutes)
**What:** How long unused data stays in cache
**Effect:** Data available instantly if accessed within 5min
**Why:** Balance memory usage with cache benefits

### retry (1 attempt)
**What:** Number of retry attempts on failure
**Effect:** Fail fast after 1 retry
**Why:** Avoid hanging UI, show error quickly

### refetchOnWindowFocus (false)
**What:** Automatic refetch when window gains focus
**Effect:** No surprise refetches
**Why:** Explicit control preferred, avoid unexpected loading states

---

## 🧭 Branch Lifecycle

```
default
  └── feature/tanstack-query ← CURRENT (foundation only)
       ├── feature/auth-ui (uses for auth state queries)
       ├── feature/data-tables (future, uses for table data)
       └── feature/user-profile (future, uses for profile queries)
            └── dev → main
```

**Current Status:** 🟡 Foundation established, awaiting feature integration
**Dependencies:** None (branches from `default`)
**Next Step:** Merge into `dev`, use in feature branches
**End Goal:** Universal data fetching infrastructure for all features

---

## 📝 Contributing to This Branch

If working on this branch:

1. **Keep configuration minimal** – only essential QueryClient options
2. **Don't add feature-specific queries** – those go in feature branches
3. **Document configuration changes** – update README with rationale
4. **Test DevTools in development** – verify debugging experience
5. **Verify production build** – ensure DevTools tree-shaken

### Commit Message Format

```bash
git commit -m "tanstack-query: <change>

- <what was changed>
- <why it was changed>
- <impact on architecture>"
```

**Examples:**
```bash
git commit -m "tanstack-query: configure QueryClient defaults

- Set staleTime: 60s, cacheTime: 5min
- Configure retry: 1, refetchOnWindowFocus: false
- Balance UX responsiveness with server load"

git commit -m "tanstack-query: add QueryClientProvider

- Wrap root layout with QueryProvider
- Add ReactQueryDevtools (dev only)
- Enable data fetching for all pages"
```

---

## 🎯 Success Criteria

This branch is ready to merge when:

- ✅ Dependencies installed and verified
- ✅ QueryClient configured with production defaults
- ✅ QueryClientProvider integrated in root layout
- ✅ DevTools working in development
- ✅ DevTools tree-shaken in production build
- ✅ TypeScript types working correctly
- ✅ Documentation complete with usage examples
- ✅ No feature-specific queries (pure infrastructure)

---

## 🔥 Philosophy Reminder

> **"Modular but not fragmented."**
> **"Clean integration, not package dumping."**

TanStack Query is **foundational infrastructure** for client-side data fetching:
- **Not a feature itself** – enabling capability
- **Reusable by design** – universal data fetching layer
- **Type-safe by default** – catch errors at compile time
- **Production-ready** – intelligent caching, retry logic

This branch provides the **foundation**. Feature branches provide the **queries**.

---

## 📖 References

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Next.js + TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/nextjs)
- [Caching Strategies](https://tanstack.com/query/latest/docs/framework/react/guides/caching)
- [Mutations Guide](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**
**Built with discipline. Designed for scale.**
