"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2, Users } from "lucide-react"

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

/**
 * Create team validation schema
 */
const createTeamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type CreateTeamFormValues = z.infer<typeof createTeamSchema>

interface CreateTeamDialogProps {
  organizationId?: string
  trigger?: React.ReactNode
}

/**
 * Create Team Dialog Component
 *
 * Features:
 * - Team name input
 * - Form validation
 * - Loading states
 * - Success feedback
 *
 * @example
 * ```tsx
 * <CreateTeamDialog />
 * ```
 */
export function CreateTeamDialog({
  organizationId,
  trigger,
}: CreateTeamDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (data: CreateTeamFormValues) => {
    try {
      const result = await authClient.organization.createTeam({
        name: data.name,
        ...(organizationId && { organizationId }),
      })

      if (result.error) {
        toast.error("Failed to create team", {
          description: result.error.message,
        })
        return
      }

      toast.success("Team created successfully")

      form.reset()
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to create team", {
        description: error.message || "An unexpected error occurred",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team to organize members within your organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for your team
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
                {form.formState.isSubmitting ? "Creating..." : "Create Team"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
