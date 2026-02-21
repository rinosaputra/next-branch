"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * Invite member validation schema
 */
const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["member", "admin", "owner"], {
    required_error: "Please select a role",
  }),
})

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>

interface InviteMemberDialogProps {
  organizationId?: string
  trigger?: React.ReactNode
}

/**
 * Invite Member Dialog Component
 *
 * Features:
 * - Email input with validation
 * - Role selection
 * - Form validation
 * - Loading states
 * - Success/error feedback
 * - Auto-close on success
 *
 * @example
 * ```tsx
 * <InviteMemberDialog />
 *
 * // With custom trigger
 * <InviteMemberDialog
 *   trigger={<Button>Custom Invite</Button>}
 * />
 * ```
 */
export function InviteMemberDialog({
  organizationId,
  trigger,
}: InviteMemberDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  })

  /**
   * Handle form submission
   */
  const onSubmit = async (data: InviteMemberFormValues) => {
    try {
      const result = await authClient.organization.inviteMember({
        email: data.email,
        role: data.role,
        ...(organizationId && { organizationId }),
      })

      if (result.error) {
        toast.error("Failed to send invitation", {
          description: result.error.message,
        })
        return
      }

      toast.success("Invitation sent successfully", {
        description: `${data.email} will receive an email to join the organization.`,
      })

      // Reset form and close dialog
      form.reset()
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to send invitation", {
        description: error.message || "An unexpected error occurred",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to add a new member to your organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="colleague@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    They will receive an invitation email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium">Member</span>
                          <span className="text-xs text-muted-foreground">
                            Can view and contribute to projects
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium">Admin</span>
                          <span className="text-xs text-muted-foreground">
                            Can manage members and settings
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="owner">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium">Owner</span>
                          <span className="text-xs text-muted-foreground">
                            Full control over organization
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Determines what they can access and modify
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {form.formState.isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
