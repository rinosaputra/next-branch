import { Suspense } from "react"
import { redirect, notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { requirePermission } from "@/lib/auth/rbac-utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RoleBadge } from "@/components/rbac/users/role-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Generate metadata dynamically based on user
 */
export const metadata = createMetadata({
  title: `User Details | Dashboard`,
  description: `View user account information and activity`,
})

import Link from "next/link"
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Key,
  Ban,
  Trash2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { createMetadata } from "@/lib/metadata"

/**
 * User Detail Page
 *
 * Server component with RBAC protection.
 * Requires user.read permission.
 *
 * Features:
 * - Server-side authentication check
 * - Server-side permission check
 * - User data fetching
 * - Account information display
 * - Activity timeline
 * - Quick actions menu
 * - Responsive layout
 *
 * @route /dashboard/users/[id]
 */
interface UserDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  // ✅ Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // ✅ Server-side RBAC check
  await requirePermission("user", ["read"])

  // ✅ Fetch user data
  const id = (await params).id
  const user = await auth.api.getUser({
    headers: await headers(),
    query: {
      id
    }
  })

  // If user not found, show 404 page
  if (!(user && session)) notFound()

  // Check if viewing own account
  const isOwnAccount = session.user.id === user.id
  const currentUserRole = session.user.role

  // Check permissions for actions
  const canUpdate = currentUserRole === "admin" || currentUserRole === "editor"
  const canDelete = currentUserRole === "admin" && !isOwnAccount

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/users">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to users</span>
            </Link>
          </Button>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </div>
              </div>
            </div>

            {isOwnAccount && (
              <Badge variant="outline" className="mt-2">
                Your Account
              </Badge>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex gap-2">
          {canUpdate && (
            <Button asChild>
              <Link href={`/dashboard/users/${user.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/users/${user.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Key className="mr-2 h-4 w-4" />
                    Reset Password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {currentUserRole === "admin" && !isOwnAccount && (
                <>
                  <DropdownMenuItem>
                    <Ban className="mr-2 h-4 w-4" />
                    {user.banned ? "Unban User" : "Ban User"}
                  </DropdownMenuItem>
                  {canDelete && (
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />

      {/* Ban Alert */}
      {user.banned && (
        <Alert variant="destructive">
          <Ban className="h-4 w-4" />
          <AlertTitle>User Banned</AlertTitle>
          <AlertDescription>
            {user.banReason && (
              <p className="mb-2">
                <strong>Reason:</strong> {user.banReason}
              </p>
            )}
            {user.banExpires ? (
              <p>
                <strong>Expires:</strong>{" "}
                {formatDistanceToNow(new Date(user.banExpires), { addSuffix: true })}
              </p>
            ) : (
              <p>This ban is permanent.</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Basic user account details</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    Full Name
                  </dt>
                  <dd className="text-base font-medium">{user.name}</dd>
                </div>

                <div className="space-y-1">
                  <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </dt>
                  <dd className="flex items-center gap-2 text-base">
                    {user.email}
                    {user.emailVerified ? (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <XCircle className="mr-1 h-3 w-3" />
                        Not Verified
                      </Badge>
                    )}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Role
                  </dt>
                  <dd>
                    <RoleBadge role={user.role || "viewer"} showIcon />
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Status
                  </dt>
                  <dd>
                    {user.banned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Account creation and update history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">
                      {user.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50">
                    <Clock className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {user.updatedAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(user.updatedAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {user.emailVerified && (
                  <>
                    <Separator />
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Email Verified</p>
                        <p className="text-sm text-muted-foreground">
                          User has verified their email address
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Account Age</span>
                <span className="font-medium">
                  {Math.floor(
                    (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Activity</span>
                <span className="font-medium">
                  {formatDistanceToNow(user.updatedAt, { addSuffix: true })}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sessions</span>
                <span className="font-medium">
                  <Link
                    href={`/dashboard/users/${user.id}/sessions`}
                    className="text-primary hover:underline"
                  >
                    View Sessions
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email Status</span>
                {user.emailVerified ? (
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    <XCircle className="mr-1 h-3 w-3" />
                    Not Verified
                  </Badge>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">2FA Status</span>
                <Badge variant="secondary" className="text-xs">
                  Not Enabled
                </Badge>
              </div>

              <Separator />

              {canUpdate && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="#" onClick={(e) => e.preventDefault()}>
                    <Key className="mr-2 h-4 w-4" />
                    Reset Password
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          {currentUserRole === "admin" && !isOwnAccount && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {!user.banned && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      // In production: Open ban dialog
                      alert("Ban user dialog would open")
                    }}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </Button>
                )}

                {user.banned && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      // In production: Unban user
                      alert("User would be unbanned")
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unban User
                  </Button>
                )}

                {canDelete && (
                  <>
                    <Separator />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        // In production: Open delete dialog
                        alert("Delete user dialog would open")
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
