# 📊 feature/tanstack-table

**Production-grade headless table primitives for data-heavy Next.js applications**

This branch integrates **TanStack Table v8** into the **next-branch** architecture, building on top of shadcn/ui component infrastructure. It provides enterprise-ready table capabilities with sorting, filtering, pagination, and row selection—designed for scalability and maintainability.

---

## 🎯 Purpose

This branch provides **headless table infrastructure** for data-intensive dashboards:

- ✅ **TanStack Table v8** (headless, framework-agnostic primitives)
- ��� **Reusable DataTable component** (type-safe, composable)
- ✅ **Core table features** (sort, filter, paginate, select, column visibility)
- ✅ **shadcn/ui integration** (consistent with existing UI patterns)
- ✅ **Type-safe column definitions** (full TypeScript inference)
- ✅ **Demonstration pages** (real-world table patterns)

**This is table infrastructure, not UI showcase.**
Provides foundational patterns for building complex data tables in enterprise applications.

---

## 🧱 Architecture Overview

### **Branch Evolution**

```
default (pure Next.js baseline)
  └── feature/shadcn-setup (UI component primitives)
       └── feature/tanstack-table ← THIS BRANCH
            ├── Builds on shadcn/ui foundation
            ├── Reusable table components
            ├── Type-safe column patterns
            └── Production-ready examples
```

### **Why Built from `shadcn-setup`?**

TanStack Table requires UI primitives that `feature/shadcn-setup` already provides:

| Required | Provided by `shadcn-setup` | Status |
|----------|---------------------------|--------|
| Table primitive | `components/ui/table` | ✅ Available |
| Button | `components/ui/button` | ✅ Available |
| Checkbox | `components/ui/checkbox` | ✅ Available |
| Dropdown Menu | `components/ui/dropdown-menu` | ✅ Available |
| Input | `components/ui/input` | ✅ Available |
| Select | `components/ui/select` | ✅ Available |
| Badge | `components/ui/badge` | ✅ Available |
| Popover | `components/ui/popover` | ✅ Available |
| Command | `components/ui/command` | ✅ Available |
| Separator | `components/ui/separator` | ✅ Available |
| `lib/utils.ts` | `cn()` utility | ✅ Available |

**Clean dependency chain:** UI primitives → Table infrastructure

---

## 📦 What's Included

### **Core Components**

```
/components/table/
├── data-table.tsx                   # Main table component (orchestrator)
├── data-table-toolbar.tsx           # Search, filters, column visibility
├── data-table-pagination.tsx        # Pagination controls
├── data-table-column-header.tsx     # Sortable column header
├── data-table-row-actions.tsx       # Row action dropdown
├── data-table-faceted-filter.tsx    # Multi-select filter
└── data-table-view-options.tsx      # Column visibility toggle

/app/examples/tanstack-table/
├── page.tsx                         # Examples homepage
├── basic/page.tsx                   # Basic table
├── sorting/page.tsx                 # Sorting demonstration
├── filtering/page.tsx               # Filtering patterns
├── pagination/page.tsx              # Pagination examples
└── advanced/page.tsx                # All features combined

/data/
└── tanstack-table-mock-data.ts
```

### **Table Capabilities**

| Feature | Description | Status |
|---------|-------------|--------|
| **Sorting** | Single/multi-column, custom comparators | ✅ Implemented |
| **Filtering** | Global search, column filters, faceted filters | ✅ Implemented |
| **Pagination** | Client-side, configurable page sizes | ✅ Implemented |
| **Row Selection** | Single/multi-select with checkboxes | ✅ Implemented |
| **Column Visibility** | Show/hide columns dynamically | ✅ Implemented |
| **Row Actions** | Dropdown menu per row | ✅ Implemented |
| **Type Safety** | Full TypeScript inference | ✅ Implemented |
| **Responsive** | Mobile-friendly layouts | ✅ Implemented |

---

## 🚀 Getting Started

### **Prerequisites**

- `feature/shadcn-setup` already merged (provides UI components)
- Node.js 18+ installed
- Basic understanding of TanStack Table concepts

### **Installation**

```bash
# Clone repository
git clone https://github.com/rinosaputra/next-branch.git
cd next-branch

# Checkout this branch
git checkout feature/tanstack-table

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000/examples](http://localhost:3000/examples)

---

## 📖 Core Features

### **1. Sorting**

Click column headers to sort data:

```typescript
// Column definition with sorting
{
  accessorKey: "name",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Name" />
  ),
}
```

**Features:**
- Click once: Sort ascending (A→Z)
- Click twice: Sort descending (Z→A)
- Click third: Clear sort
- Visual indicators (↑ ↓ icons)
- Multi-column sorting support

---

### **2. Filtering**

#### **Global Search**

Search across all columns:

```typescript
<DataTable
  data={data}
  columns={columns}
  searchKey="name"
  searchPlaceholder="Search names..."
/>
```

#### **Column Filters**

Filter specific columns:

```typescript
// Filterable column
{
  accessorKey: "role",
  header: "Role",
  filterFn: (row, id, value) => {
    return value.includes(row.getValue(id))
  },
}
```

#### **Faceted Filters**

Multi-select dropdown filters:

```typescript
<DataTable
  data={data}
  columns={columns}
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

**Features:**
- Multi-select with badges
- Shows count per option
- Clear all filters button
- Preserves filter state

---

### **3. Pagination**

Navigate large datasets efficiently:

```typescript
// Pagination automatically enabled
<DataTable data={data} columns={columns} />
```

**Features:**
- Configurable page sizes (10, 20, 30, 40, 50)
- First/Previous/Next/Last navigation
- Current page indicator
- Total rows count
- Selected rows count

---

### **4. Row Selection**

Select rows for bulk operations:

```typescript
// Selection column
{
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
    />
  ),
}
```

**Features:**
- Select individual rows
- Select all rows on page
- Access selected row data
- Visual selection state

---

### **5. Column Visibility**

Show/hide columns dynamically:

```typescript
// Automatically included in DataTableToolbar
<DataTableViewOptions table={table} />
```

**Features:**
- Toggle individual columns
- Dropdown with all columns
- Persists visibility state
- Hide/show multiple columns

---

### **6. Row Actions**

Contextual actions per row:

```typescript
{
  id: "actions",
  cell: ({ row }) => (
    <DataTableRowActions
      row={row}
      onEdit={(data) => console.log('Edit', data)}
      onDelete={(data) => console.log('Delete', data)}
      onView={(data) => console.log('View', data)}
    />
  ),
}
```

**Features:**
- Dropdown menu per row
- View/Edit/Delete actions
- Custom actions support
- Keyboard accessible

---

## 📖 Usage Examples

### **Example 1: Basic Table**

```typescript
// app/examples/basic/page.tsx
"use client"

import { DataTable } from "@/components/table/data-table"
import { ColumnDef } from "@tanstack/react-table"

type User = {
  id: string
  name: string
  email: string
  role: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
]

export default function BasicTablePage() {
  const data: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Editor" },
  ]

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
```

---

### **Example 2: Sortable Columns**

```typescript
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
]
```

---

### **Example 3: Filterable Table**

```typescript
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]

// In component
<DataTable
  columns={columns}
  data={data}
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

---

### **Example 4: Row Selection**

```typescript
import { Checkbox } from "@/components/ui/checkbox"

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // ... other columns
]

// Access selected rows
const selectedRows = table.getFilteredSelectedRowModel().rows
console.log('Selected data:', selectedRows.map(row => row.original))
```

---

### **Example 5: Row Actions**

```typescript
import { DataTableRowActions } from "@/components/table/data-table-row-actions"

const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={(user) => {
          console.log('Edit user:', user)
          // Navigate to edit page or open modal
        }}
        onDelete={(user) => {
          console.log('Delete user:', user)
          // Show confirmation dialog
        }}
        customActions={[
          {
            label: "Reset Password",
            onClick: (user) => console.log('Reset password for:', user),
          },
        ]}
      />
    ),
  },
]
```

---

### **Example 6: Complete Table**

```typescript
"use client"

import { DataTable } from "@/components/table/data-table"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { DataTableRowActions } from "@/components/table/data-table-row-actions"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive"
  createdAt: Date
}

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={(user) => console.log('Edit', user)}
        onDelete={(user) => console.log('Delete', user)}
        onView={(user) => console.log('View', user)}
      />
    ),
  },
]

export default function UsersPage() {
  const data: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "editor",
      status: "active",
      createdAt: new Date("2024-02-10"),
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage your users with advanced filtering and sorting
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
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
          {
            id: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
      />
    </div>
  )
}
```

---

## 🎨 Component API

### **DataTable**

Main table component that orchestrates all features.

```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  filterableColumns?: {
    id: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}
```

**Props:**
- `columns` - Column definitions (required)
- `data` - Array of data objects (required)
- `searchKey` - Column key for global search (optional)
- `searchPlaceholder` - Search input placeholder (optional)
- `filterableColumns` - Columns with faceted filters (optional)

---

### **DataTableColumnHeader**

Sortable column header with dropdown menu.

```typescript
interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}
```

**Features:**
- Sort ascending/descending
- Hide column
- Keyboard accessible

---

### **DataTableRowActions**

Dropdown menu for row-level actions.

```typescript
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  onView?: (row: TData) => void
  customActions?: {
    label: string
    onClick: (row: TData) => void
    icon?: React.ReactNode
    variant?: "default" | "destructive"
  }[]
}
```

**Actions:**
- View (optional)
- Edit (optional)
- Delete (optional, shown in red)
- Custom actions (unlimited)

---

## 🧪 Demo Pages

Explore live examples after running `npm run dev`:

| Page | URL | Demonstrates |
|------|-----|--------------|
| **Examples Home** | `/examples` | Overview of all examples |
| **Basic Table** | `/examples/basic` | Simple table with data |
| **Sorting** | `/examples/sorting` | Single/multi-column sorting |
| **Filtering** | `/examples/filtering` | Global + column filters |
| **Pagination** | `/examples/pagination` | Page size, navigation |
| **Advanced** | `/examples/advanced` | All features combined |

---

## 🔧 Customization

### **Custom Filter Function**

```typescript
{
  accessorKey: "status",
  header: "Status",
  filterFn: (row, id, value) => {
    // Custom filter logic
    const status = row.getValue(id) as string
    if (value === "all") return true
    return status === value
  },
}
```

---

### **Custom Cell Rendering**

```typescript
{
  accessorKey: "avatar",
  header: "Avatar",
  cell: ({ row }) => {
    const avatarUrl = row.getValue("avatar") as string
    return (
      <img
        src={avatarUrl}
        alt="Avatar"
        className="h-10 w-10 rounded-full"
      />
    )
  },
}
```

---

### **Custom Sorting**

```typescript
{
  accessorKey: "createdAt",
  header: "Created",
  sortingFn: (rowA, rowB) => {
    const dateA = new Date(rowA.getValue("createdAt"))
    const dateB = new Date(rowB.getValue("createdAt"))
    return dateA.getTime() - dateB.getTime()
  },
}
```

---

### **Custom Row Actions**

```typescript
<DataTableRowActions
  row={row}
  customActions={[
    {
      label: "Duplicate",
      onClick: (data) => console.log('Duplicate', data),
      icon: <CopyIcon className="h-4 w-4" />,
    },
    {
      label: "Archive",
      onClick: (data) => console.log('Archive', data),
      variant: "destructive",
    },
  ]}
/>
```

---

## 🎯 Integration Patterns

### **Future Integration Points**

When this branch is merged with dashboard/data fetching systems:

#### **1. TanStack Query Integration**

```typescript
"use client"

import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/table/data-table'
import { columns } from './columns'

export function UsersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <TableSkeleton />

  return <DataTable data={data || []} columns={columns} />
}
```

---

#### **2. Server-Side Pagination**

```typescript
"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export function UsersTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data } = useQuery({
    queryKey: ['users', pagination],
    queryFn: () => fetchUsers({
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
    }),
    keepPreviousData: true,
  })

  return (
    <DataTable
      data={data?.users || []}
      columns={columns}
      // Server-side pagination props
      pageCount={Math.ceil(data?.total / pagination.pageSize)}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
```

---

#### **3. RBAC Integration**

```typescript
import { DataTableRowActions } from '@/components/table/data-table-row-actions'
import { RequirePermission } from '@/components/rbac/require-permission'

const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        // Only admins can delete
        onDelete={
          <RequirePermission resource="user" actions={["delete"]}>
            {(user) => handleDelete(user)}
          </RequirePermission>
        }
        // Editors and admins can edit
        onEdit={
          <RequirePermission resource="user" actions={["update"]}>
            {(user) => handleEdit(user)}
          </RequirePermission>
        }
      />
    ),
  },
]
```

---

## 📊 Performance Considerations

### **Large Datasets**

Current implementation uses **client-side pagination**, suitable for:
- ✅ Up to ~10,000 rows
- ✅ Fast filtering/sorting in browser
- ✅ No network latency per page

For larger datasets (>10,000 rows):
- Use **server-side pagination** (TanStack Query integration)
- Implement **virtual scrolling** (`@tanstack/react-virtual`)
- Add **lazy loading** for improved UX

---

### **Optimize Filters**

Debounce search inputs for better performance:

```typescript
import { useDebouncedValue } from '@/hooks/use-debounced-value'

const [search, setSearch] = useState('')
const debouncedSearch = useDebouncedValue(search, 300)

useEffect(() => {
  table.getColumn("name")?.setFilterValue(debouncedSearch)
}, [debouncedSearch])
```

---

## 🚧 Current State

### **✅ Completed (Foundation)**

- [x] TanStack Table v8 integration
- [x] DataTable component (reusable, type-safe)
- [x] Sorting (single/multi-column)
- [x] Filtering (global + column + faceted)
- [x] Pagination (client-side)
- [x] Row selection (checkbox, multi-select)
- [x] Column visibility toggle
- [x] Row actions (dropdown menu)
- [x] Column headers (sortable)
- [x] Pagination controls (first/prev/next/last)
- [x] Toolbar (search, filters, column visibility)
- [x] Demo pages (6 examples)
- [x] TypeScript types (full inference)
- [x] Responsive design (mobile/tablet/desktop)
- [x] Accessible (ARIA labels, keyboard navigation)

---

### **🔄 Not Included (Future Integration)**

These features require integration with other branches:

- [ ] TanStack Query integration → Requires `feature/tanstack-query`
- [ ] RBAC permission checks → Requires `feature/better-auth-rbac`
- [ ] Dashboard layout → Requires `feature/dashboard-layout`
- [ ] Real API endpoints → Requires backend integration
- [ ] Server-side pagination → Requires TanStack Query
- [ ] Server-side filtering → Requires API support
- [ ] Server-side sorting → Requires API support
- [ ] Optimistic updates → Requires mutation layer
- [ ] Error boundaries → Requires error handling layer
- [ ] Loading skeletons → Requires loading state layer

---

### **⏳ Future Enhancements (Phase 2)**

Advanced features that can be added later:

- [ ] Column resizing (`@tanstack/react-table` resize feature)
- [ ] Row virtualization (`@tanstack/react-virtual`)
- [ ] Row grouping (expandable groups)
- [ ] Export to CSV/Excel
- [ ] Column pinning (freeze columns)
- [ ] Row reordering (drag & drop)
- [ ] Inline editing (editable cells)
- [ ] Advanced filters (date ranges, number ranges)
- [ ] Saved filter presets
- [ ] Column presets (saved layouts)

---

## 🧭 Branch Lifecycle

### **Current Position**

```
default (pure Next.js baseline)
  └── feature/shadcn-setup (UI component primitives)
       └── feature/tanstack-table ← THIS BRANCH
```

### **Dependencies**

**Requires:**
- ✅ `feature/shadcn-setup` (UI components, styling utilities)

**Enables:**
- ⏳ `feature/dashboard-layout` (can use DataTable in dashboard pages)
- ⏳ `feature/admin-panel` (can build admin tables)
- ⏳ `feature/data-analytics` (can build analytics tables)

### **Integration Path**

```
feature/shadcn-setup → dev (test UI primitives)
feature/tanstack-table → dev (test table integration)
  └── Validate: Tables work with existing UI components
       └── dev → main (stable release)
```

### **Merge Strategy**

When ready for integration:

```bash
# 1. Ensure shadcn-setup is in dev
git checkout dev
git merge feature/shadcn-setup --no-ff

# 2. Merge tanstack-table
git merge feature/tanstack-table --no-ff -m "feat: add TanStack Table integration

- Headless table primitives with TanStack Table v8
- Reusable DataTable component with sorting/filtering/pagination
- Column visibility toggle and row selection
- Row actions dropdown with custom actions
- Faceted filters for multi-select filtering
- Type-safe column definitions
- Demo pages with real-world examples

Integration: Builds on feature/shadcn-setup UI components
Ready for: Dashboard integration, admin panels, data-heavy UIs"

# 3. Test integration
npm run dev
npm run build
npm run type-check

# 4. If all tests pass
git push origin dev
```

---

## 🔥 Architectural Philosophy

This branch adheres to **next-branch** master prompt principles:

| Principle | Implementation |
|-----------|----------------|
| **"Modular but not fragmented"** | ✅ Table system is modular (separate components) but cohesive (works together) |
| **"Opinionated but extensible"** | ✅ Clear patterns (DataTable API) but allows customization (column definitions) |
| **"Minimal but powerful"** | ✅ Core features only (sort, filter, paginate), no unnecessary bloat |
| **"No unnecessary bloat"** | ✅ Only essential shadcn components used, no UI showcase |
| **"Clean integration"** | ✅ Builds on shadcn-setup foundation, natural dependency chain |
| **"Branch-based evolution"** | ✅ Sequential evolution: baseline → UI primitives → table infrastructure |

---

## 📖 Learning Resources

### **TanStack Table**
- [Official Documentation](https://tanstack.com/table/latest)
- [React Examples](https://tanstack.com/table/latest/docs/framework/react/examples/basic)
- [API Reference](https://tanstack.com/table/latest/docs/api/core/table)
- [Column Definitions](https://tanstack.com/table/latest/docs/guide/column-defs)
- [Sorting Guide](https://tanstack.com/table/latest/docs/guide/sorting)
- [Filtering Guide](https://tanstack.com/table/latest/docs/guide/filters)
- [Pagination Guide](https://tanstack.com/table/latest/docs/guide/pagination)

### **shadcn/ui Components**
- [Table](https://ui.shadcn.com/docs/components/table)
- [Button](https://ui.shadcn.com/docs/components/button)
- [Checkbox](https://ui.shadcn.com/docs/components/checkbox)
- [Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu)
- [Input](https://ui.shadcn.com/docs/components/input)
- [Select](https://ui.shadcn.com/docs/components/select)

### **Next.js Documentation**
- [App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

---

## 🎯 Summary

**This branch provides production-grade table infrastructure for Next.js applications.**

### **What it is:**
- ✅ Headless table primitives (TanStack Table v8)
- ✅ Reusable DataTable component
- ✅ Core features (sort, filter, paginate, select)
- ✅ Type-safe column definitions
- ✅ shadcn/ui integration
- ✅ Demo pages with examples
- ✅ Foundation for data-heavy UIs

### **What it is NOT:**
- ❌ A complete data grid library
- ❌ A dashboard system (that's `feature/dashboard-layout`)
- ❌ Integrated with API layer (that's future integration)
- ❌ A UI component showcase

### **Technology Stack:**
```
Next.js 15 (App Router)
├── TypeScript (strict mode)
├── TanStack Table v8 (headless table)
├── shadcn/ui (UI primitives)
└── Tailwind CSS (styling)
```

### **Dependencies:**
```
Requires: feature/shadcn-setup (UI components)
Enables: Dashboard, admin panels, analytics tables
```

### **Integration Strategy:**
```
1. Merge shadcn-setup to dev
2. Merge tanstack-table to dev
3. Test table + UI integration
4. Ready for dashboard features
```

---

**This is table infrastructure for enterprise applications.**
**Built with discipline. Designed for scale.**

---

**Part of the [next-branch](https://github.com/rinosaputra/next-branch) architecture.**

📊 Modular | 🎯 Type-Safe | 🚀 Production-Ready | 🔥 Extensible

---

**Repository:** [rinosaputra/next-branch](https://github.com/rinosaputra/next-branch)
**Branch:** `feature/tanstack-table`
**Base:** `feature/shadcn-setup` (UI primitives)
**Status:** ✅ Foundation complete
**Integration:** Ready for `dev` branch

---

*Last updated: 2026-02-20*
