import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CreateOrganizationForm } from "@/components/organization/form/create-organization-form"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Create Organization | Dashboard",
  description: "Create a new organization or workspace",
})

/**
 * Create Organization Page
 *
 * Server component for organization creation.
 * No special permission needed (allowUserToCreateOrganization handles this).
 *
 * Features:
 * - Organization creation form
 * - Name and slug input
 * - Client-side validation
 * - Auto-redirect after creation
 *
 * @route /dashboard/organizations/create
 */
export default function CreateOrganizationPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Organization</h1>
        <p className="text-muted-foreground">
          Set up a new workspace for your team
        </p>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Choose a name and unique identifier for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrganizationForm />
        </CardContent>
      </Card>

      {/* Info Section */}
      <div className="max-w-2xl space-y-4">
        <h3 className="text-lg font-semibold">What you'll get:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Dedicated workspace for your team</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Invite unlimited members</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Manage roles and permissions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Collaborate on projects</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
