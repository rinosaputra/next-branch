import { Suspense } from "react"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Building2, CheckCircle2, XCircle, Clock } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { AcceptInvitationActions } from "@/components/organization/accept-invitation-actions"

interface AcceptInvitationPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Accept Invitation | Organizations",
  description: "Review and accept your organization invitation",
}

/**
 * Accept Invitation Page
 *
 * Server component for invitation acceptance flow.
 * Requires authentication. No special permission needed.
 *
 * Features:
 * - Display invitation details
 * - Accept invitation button
 * - Reject invitation option
 * - Expiration status
 * - Inviter information
 *
 * Architecture:
 * - Server component for invitation validation
 * - Client component for accept/reject actions
 * - Error states (expired, invalid, already accepted)
 *
 * @route /dashboard/organizations/accept-invitation/[id]
 */
export default async function AcceptInvitationPage({
  params,
}: AcceptInvitationPageProps) {
  // ✅ Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    // Redirect to login with return URL
    redirect(`/login?callbackUrl=/dashboard/organizations/accept-invitation/${params.id}`)
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Suspense fallback={<InvitationCardSkeleton />}>
        <InvitationCard invitationId={params.id} userEmail={session.user.email} />
      </Suspense>
    </div>
  )
}

/**
 * Invitation Card Component
 *
 * Async component that fetches and displays invitation.
 */
async function InvitationCard({
  invitationId,
  userEmail,
}: {
  invitationId: string
  userEmail: string
}) {
  // Fetch invitation data
  const invitation = await fetchInvitation(invitationId)

  if (!invitation) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-center">Invitation Not Found</CardTitle>
          <CardDescription className="text-center">
            This invitation does not exist or has been removed
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <a href="/dashboard/organizations">View Organizations</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Check if invitation is for this user
  if (invitation.email !== userEmail) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-center">Wrong Account</CardTitle>
          <CardDescription className="text-center">
            This invitation is for <strong>{invitation.email}</strong>.
            <br />
            You are currently logged in as <strong>{userEmail}</strong>.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild variant="outline">
            <a href="/logout">Switch Account</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Check if expired
  const isExpired = new Date(invitation.expiresAt) < new Date()

  if (isExpired) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-center">Invitation Expired</CardTitle>
          <CardDescription className="text-center">
            This invitation expired on {new Date(invitation.expiresAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Contact <strong>{invitation.inviter.name}</strong> ({invitation.inviter.email})
            to request a new invitation.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild variant="outline">
            <a href="/dashboard/organizations">View Organizations</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Check if already accepted
  if (invitation.status === "accepted") {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-center">Already Accepted</CardTitle>
          <CardDescription className="text-center">
            You are already a member of {invitation.organization.name}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <a href={`/dashboard/organizations/${invitation.organization.slug}`}>
              Go to Organization
            </a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Valid pending invitation
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          {invitation.organization.logo ? (
            <img
              src={invitation.organization.logo}
              alt={invitation.organization.name}
              className="h-16 w-16 rounded-lg"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          )}
        </div>

        <CardTitle className="text-center">
          You've been invited to join
        </CardTitle>
        <CardDescription className="text-center text-lg font-semibold text-foreground">
          {invitation.organization.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Inviter Information */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm font-medium mb-2">Invited by</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
              {invitation.inviter.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{invitation.inviter.name}</p>
              <p className="text-sm text-muted-foreground">
                {invitation.inviter.email}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Invitation Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Role</span>
            <Badge variant="secondary" className="capitalize">
              {invitation.role}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Expires</span>
            <span className="font-medium">
              {new Date(invitation.expiresAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Members</span>
            <span className="font-medium">
              {invitation.organization.memberCount} members
            </span>
          </div>
        </div>

        <Separator />

        {/* What you'll get */}
        <div className="space-y-2">
          <p className="text-sm font-medium">As a {invitation.role}, you'll be able to:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <span>Access organization resources</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <span>Collaborate with team members</span>
            </li>
            {invitation.role !== 'member' && (
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <span>Manage organization settings</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter>
        <AcceptInvitationActions
          invitationId={invitation.id}
          organizationSlug={invitation.organization.slug}
        />
      </CardFooter>
    </Card>
  )
}

/**
 * Fetch invitation data
 *
 * In production: Use Better Auth API
 */
async function fetchInvitation(invitationId: string) {
  // Mock data for demonstration
  // In production: await authClient.organization.getInvitation({ id: invitationId })
  return {
    id: invitationId,
    email: "user@example.com",
    role: "member",
    status: "pending",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    organization: {
      id: "org-1",
      name: "Acme Inc",
      slug: "acme-inc",
      logo: null,
      memberCount: 5,
    },
    inviter: {
      name: "John Doe",
      email: "john@acme.com",
    },
  }
}

/**
 * Loading Skeleton
 */
function InvitationCardSkeleton() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Skeleton className="h-16 w-16 rounded-lg mx-auto mb-4" />
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
