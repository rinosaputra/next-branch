import { Suspense } from "react"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { requirePermission } from "@/lib/auth/rbac-utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { ArrowLeft, UserCog, AlertTriangle, Key, Mail, Ban } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import { EditUserForm } from "@/components/rbac/users/form/edit-user-form"

/**
 * Generate metadata dynamically based on user
 */
export const metadata = createMetadata({
  title: "Edit User | Dashboard",
  description: "Update user information and permissions",
})

/**
 * Edit User Page
 *
 * Server component with RBAC protection.
 * Requires user.update permission (typically admin/editor role).
 *
 * Features:
 * - Server-side authentication check
 * - Server-side permission check
 * - User data fetching
 * - Quick actions sidebar
 * - Responsive layout
 *
 * @route /dashboard/users/[id]/edit
 */
interface EditUserPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  // ✅ Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const id = (await params).id

  // ✅ Server-side RBAC check
  await requirePermission("user", ["update"])
  const user = await auth.api.getUser({
    headers: await headers(),
    query: {
      id
    }
  })

  // ✅ Fetch user data
  // In production: Fetch from database via API
  // const user = await fetchUserById(params.id)
  if (!(user && session)) notFound()


  // Prevent editing own account (optional safety measure)
  const isOwnAccount = session.user.id === user.id
  const currentUserRole = session.user.role

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/users/${user.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to user detail</span>
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <UserCog className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Update information for {user.name}
              </p>
              {isOwnAccount && (
                <Badge variant="outline" className="text-xs">
                  Your Account
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Warning for editing own account */}
      {isOwnAccount && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Editing Your Own Account</AlertTitle>
          <AlertDescription>
            Be careful when changing your own role or permissions. You may lose access to this page.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Make changes to the user's account details and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<EditUserFormSkeleton />}>
                <EditUserForm user={{
                  ...user,
                  role: user.role || "viewer" // Default to viewer if role is missing
                }} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email Verified</span>
                {user.emailVerified ? (
                  <Badge variant="default" className="bg-green-600">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not Verified</Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                {user.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600">
                    Active
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {user.createdAt.toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription className="text-xs">
                Perform common user management tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Password Reset */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link href="#" onClick={(e) => {
                  e.preventDefault()
                  // In production: Trigger password reset
                  alert("Password reset email would be sent")
                }}>
                  <Key className="mr-2 h-4 w-4" />
                  Reset Password
                </Link>
              </Button>

              {/* Send Email */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link href="#" onClick={(e) => {
                  e.preventDefault()
                  // In production: Open email compose
                  alert("Email compose would open")
                }}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Link>
              </Button>

              <Separator />

              {/* Ban/Unban User */}
              {currentUserRole === "admin" && !isOwnAccount && (
                <Button
                  variant={user.banned ? "outline" : "destructive"}
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="#" onClick={(e) => {
                    e.preventDefault()
                    // In production: Ban/unban user
                    alert(user.banned ? "User would be unbanned" : "User would be banned")
                  }}>
                    <Ban className="mr-2 h-4 w-4" />
                    {user.banned ? "Unban User" : "Ban User"}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Help Text */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm">Important</AlertTitle>
            <AlertDescription className="text-xs">
              Changes to user roles take effect immediately. Users may need to log out and back in to see permission changes.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for edit user form
 */
function EditUserFormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-48 animate-pulse rounded bg-muted" />
        </div>
      ))}
      <div className="rounded-lg border border-dashed p-4">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-full animate-pulse rounded bg-muted" />
        <div className="mt-3 h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex gap-4">
        <div className="h-10 flex-1 animate-pulse rounded bg-muted" />
        <div className="h-10 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
