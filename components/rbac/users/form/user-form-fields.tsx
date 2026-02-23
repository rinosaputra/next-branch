"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import {
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
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { roleSelectOptions } from "@/lib/validations/user"
import { PasswordInput } from "@/components/input/password"

/**
 * Shared user form fields
 *
 * DRY principle: Reused in both create and edit forms
 * Prevents duplication of field definitions
 */

interface UserFormFieldsProps {
  form: UseFormReturn<any>
  isEditMode?: boolean
}

export function UserFormFields({ form, isEditMode = false }: UserFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      {/* Name Field */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormDescription>
              The user's full name as it will appear in the system
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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
                placeholder="john@example.com"
                {...field}
                disabled={isEditMode} // Email cannot be changed
              />
            </FormControl>
            <FormDescription>
              {isEditMode
                ? "Email cannot be changed after account creation"
                : "Used for login and system notifications"
              }
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password Field - Only in create mode */}
      {!isEditMode && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <PasswordInput
                    placeholder="••••••••"
                    {...field}
                    showStrength
                    showStrengthFeedback
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Must be at least 8 characters long
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Role Field */}
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roleSelectOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium">{role.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {role.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Determines what the user can access and modify in the system
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
