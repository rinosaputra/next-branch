import { Badge } from "@/components/ui/badge"
import { Role } from "@/lib/auth/permissions"
import { Shield, Edit3, Eye } from "lucide-react"

interface RoleBadgeProps {
  role: Role | null
  showIcon?: boolean
  className?: string
}

/**
 * Visual badge for user roles
 *
 * Shows role with appropriate styling and optional icon.
 *
 * @example
 * ```tsx
 * <RoleBadge role="admin" showIcon />
 * <RoleBadge role={user.role} />
 * ```
 */
export function RoleBadge({
  role,
  showIcon = false,
  className
}: RoleBadgeProps) {
  // Default to viewer if no role
  const displayRole = role || "viewer"

  // Determine variant and icon
  const config = getRoleConfig(displayRole)

  return (
    <Badge
      variant={config.variant}
      className={className}
    >
      {showIcon && <config.icon className="mr-1 h-3 w-3" />}
      <span className="capitalize">{displayRole}</span>
    </Badge>
  )
}

function getRoleConfig(role: Role) {
  switch (role.toLowerCase()) {
    case "admin":
      return {
        variant: "default" as const,
        icon: Shield,
      }
    case "editor":
      return {
        variant: "secondary" as const,
        icon: Edit3,
      }
    case "viewer":
    default:
      return {
        variant: "outline" as const,
        icon: Eye,
      }
  }
}
