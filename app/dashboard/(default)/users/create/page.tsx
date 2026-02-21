import { Suspense } from "react"
import { requirePermission } from "@/lib/auth/rbac-utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, UserPlus, Shield, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createMetadata } from "@/lib/metadata"
import { CreateUserForm } from "@/components/rbac/users/form/create-user-form"

/**
 * Metadata for SEO and browser tab
 */
export const metadata = createMetadata({
  title: "Create User | Dashboard",
  description: "Add a new user to the system",
})


/**
 * Create User Page
 *
 * Server component with admin-only RBAC protection.
 * Requires user.create permission (typically admin role).
 *
 * Features:
 * - Server-side authentication check
 * - Server-side permission check
 * - Breadcrumb navigation
 * - Help section
 * - Responsive layout
 *
 * @route /dashboard/users/create
 */
export default async function CreateUserPage() {
  // ✅ Server-side RBAC check - Admin only
  await requirePermission("user", ["create"])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/users">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to users</span>
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new user to the system
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Enter the details for the new user. They will receive an email with login instructions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<CreateUserFormSkeleton />}>
                <CreateUserForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="space-y-6">
          {/* Role Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Role Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4 text-primary" />
                  Administrator
                </div>
                <p className="mt-1 text-muted-foreground">
                  Full system access including user management, settings, and all features.
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4 text-secondary" />
                  Editor
                </div>
                <p className="mt-1 text-muted-foreground">
                  Can create and edit content. Limited access to user management and settings.
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Viewer
                </div>
                <p className="mt-1 text-muted-foreground">
                  Read-only access to content. Cannot create, edit, or delete.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Best Practices</AlertTitle>
            <AlertDescription className="mt-2 space-y-2 text-sm">
              <ul className="list-inside list-disc space-y-1">
                <li>Use strong passwords (minimum 8 characters)</li>
                <li>Assign the least privileged role necessary</li>
                <li>Verify email addresses before creating accounts</li>
                <li>Review user permissions regularly</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for create user form
 */
function CreateUserFormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-48 animate-pulse rounded bg-muted" />
        </div>
      ))}
      <div className="flex gap-4">
        <div className="h-10 flex-1 animate-pulse rounded bg-muted" />
        <div className="h-10 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
