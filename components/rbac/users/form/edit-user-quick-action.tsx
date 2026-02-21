"use client"

import { Ban, Key, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const EditUserQuickAction: React.FC<{
  user: {
    banned: boolean
  }
  currentUserRole: string
  isOwnAccount: boolean
}> = ({ user, currentUserRole, isOwnAccount }) => {
  return (
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
            <Key />
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
            <Mail />
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
              <Ban />
              {user.banned ? "Unban User" : "Ban User"}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default EditUserQuickAction
