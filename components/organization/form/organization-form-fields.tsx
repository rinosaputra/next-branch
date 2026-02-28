"use client"

import { UseFormReturn } from "react-hook-form"
import { CreateOrganizationInput, EditOrganizationInput } from "@/lib/validations/organization"
import { useState } from "react"
import { Loader2 } from "lucide-react"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

/**
 * Generate slug from name
 */
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface OrganizationFormFieldsProps {
  form: UseFormReturn<CreateOrganizationInput>
  isCheckingSlug?: boolean
  mode?: "create" | "edit"
}

/**
 * Organization Form Fields Component
 *
 * Reusable form fields for both create and edit forms.
 *
 * Features:
 * - Auto-generate slug from name
 * - Real-time slug validation
 * - Logo URL validation
 * - Description textarea
 * - Loading states
 *
 * Architecture:
 * - Reusable across create/edit forms
 * - Controlled by react-hook-form
 * - Type-safe with Zod validation
 *
 * @example
 * ```tsx
 * <OrganizationFormFields form={form} isCheckingSlug={checking} />
 * ```
 */
export function OrganizationFormFields({
  form,
  isCheckingSlug = false,
  mode = "create",
}: OrganizationFormFieldsProps) {
  const [autoSlug, setAutoSlug] = useState(mode === "create")

  /**
   * Handle name change (auto-generate slug if enabled)
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    form.setValue("name", value)

    // Auto-generate slug only on create mode and if not manually edited
    if (autoSlug && mode === "create") {
      const slug = generateSlug(value)
      form.setValue("slug", slug)
    }
  }

  /**
   * Handle slug manual edit (disable auto-generation)
   */
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSlug(false)
    const value = generateSlug(e.target.value)
    form.setValue("slug", value)
  }

  return (
    <FieldGroup>
      {/* Organization Name */}
      <Field>
        <FieldLabel htmlFor="name">
          Organization Name
        </FieldLabel>
        <Input
          id="name"
          placeholder="Acme Inc"
          {...form.register("name")}
          onChange={handleNameChange}
          disabled={form.formState.isSubmitting}
        />
        <FieldDescription>
          The display name for your organization
        </FieldDescription>
        <FieldError>{form.formState.errors.name?.message}</FieldError>
      </Field>

      {/* Organization Slug */}
      <Field>
        <FieldLabel htmlFor="slug">
          Organization Slug
        </FieldLabel>
        <div className="relative">
          <Input
            id="slug"
            placeholder="acme-inc"
            {...form.register("slug")}
            onChange={handleSlugChange}
            disabled={form.formState.isSubmitting}
          />
          {isCheckingSlug && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <FieldDescription>
          Used in URLs: <code className="text-xs">/organizations/{form.watch("slug") || "slug"}</code>
          {autoSlug && mode === "create" && (
            <span className="ml-2 text-xs text-muted-foreground">
              (Auto-generated from name)
            </span>
          )}
        </FieldDescription>
        <FieldError>{form.formState.errors.slug?.message}</FieldError>
      </Field>

      {/* Logo URL (Optional) */}
      <Field>
        <FieldLabel htmlFor="logo">Logo URL</FieldLabel>
        <Input
          id="logo"
          type="url"
          placeholder="https://example.com/logo.png"
          {...form.register("logo")}
          disabled={form.formState.isSubmitting}
        />
        <FieldDescription>
          A public URL to your organization's logo image
        </FieldDescription>
        <FieldError>{form.formState.errors.logo?.message}</FieldError>
      </Field>

      {/* Description (Optional) */}
      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          placeholder="Brief description of your organization..."
          rows={3}
          {...form.register("description")}
          disabled={form.formState.isSubmitting}
          className="resize-none"
        />
        <FieldDescription>
          Optional description for your organization (max 500 characters)
        </FieldDescription>
        <FieldError>{form.formState.errors.description?.message}</FieldError>
      </Field>
    </FieldGroup>
  )
}
