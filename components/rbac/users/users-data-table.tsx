"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { DataTable } from "@/components/table/data-table"
import { userColumns } from "./columns"
import { Skeleton } from "@/components/ui/skeleton"

export function UsersDataTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {
          limit: 100,
          offset: 0,
        },
      })
      return result.data
    },
  })

  if (isLoading) {
    return <UsersTableSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-6">
        <p className="text-sm text-destructive">
          Failed to load users: {error.message}
        </p>
      </div>
    )
  }

  const users = data?.users || []

  return (
    <DataTable
      columns={userColumns}
      data={users}
      searchKey="name"
      searchPlaceholder="Search users..."
      filterableColumns={[
        {
          id: "role",
          title: "Role",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
            { label: "Viewer", value: "viewer" },
          ],
        },
        {
          id: "banned",
          title: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Banned", value: "banned" },
          ],
        },
      ]}
    />
  )
}

function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-62.5" />
        <Skeleton className="h-8 w-25" />
      </div>
      <div className="rounded-md border">
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-50" />
        <Skeleton className="h-8 w-75" />
      </div>
    </div>
  )
}
