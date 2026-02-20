import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMockUserStats } from "@/data/tanstack-table-mock-data"

export default function TanStackTableExamplesPage() {
  const stats = getMockUserStats()

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">TanStack Table Examples</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Production-grade table patterns with sorting, filtering, pagination, and row selection
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Mock data for demonstration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus.active}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.byStatus.active / stats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">By Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="outline">{stats.byRole.admin} Admin</Badge>
              <Badge variant="outline">{stats.byRole.editor} Editor</Badge>
              <Badge variant="outline">{stats.byRole.viewer} Viewer</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <ExampleCard
          title="Basic Table"
          description="Simple table with minimal configuration. No sorting, filtering, or pagination."
          href="/examples/tanstack-table/basic"
          features={["Static data", "Basic columns", "No interactions"]}
        />

        <ExampleCard
          title="Sorting"
          description="Single and multi-column sorting with visual indicators."
          href="/examples/tanstack-table/sorting"
          features={["Click to sort", "Asc/desc toggle", "Sort indicators"]}
        />

        <ExampleCard
          title="Filtering"
          description="Global search, column filters, and faceted multi-select filters."
          href="/examples/tanstack-table/filtering"
          features={["Global search", "Column filters", "Faceted filters"]}
        />

        <ExampleCard
          title="Pagination"
          description="Client-side pagination with configurable page sizes and navigation."
          href="/examples/tanstack-table/pagination"
          features={["Page size selector", "Navigation buttons", "Page indicator"]}
        />

        <ExampleCard
          title="Advanced"
          description="All features combined: sorting, filtering, pagination, and row selection."
          href="/examples/tanstack-table/advanced"
          features={["All features", "Row selection", "Row actions", "Column visibility"]}
          highlight
        />
      </div>

      {/* Usage Note */}
      <Card className="mt-8 border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Integration Note</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            These examples use mock data for demonstration. In production:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Replace <code className="rounded bg-muted px-1">generateMockUsers()</code> with actual API calls</li>
            <li>Integrate with TanStack Query for server-state management</li>
            <li>Add RBAC permission checks for row actions</li>
            <li>Implement server-side pagination for large datasets</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function ExampleCard({
  title,
  description,
  href,
  features,
  highlight = false,
}: {
  title: string
  description: string
  href: string
  features: string[]
  highlight?: boolean
}) {
  return (
    <Link href={href}>
      <Card className={`transition-colors hover:border-primary ${highlight ? "border-primary" : ""}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            {highlight && <Badge>Recommended</Badge>}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <Badge key={feature} variant="secondary">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
