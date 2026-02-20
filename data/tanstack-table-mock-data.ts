/**
 * Mock data generator for TanStack Table examples
 *
 * Provides realistic user data for demonstration purposes
 * In production, replace with actual API calls
 */

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  status: "active" | "inactive" | "pending"
  department: "engineering" | "design" | "marketing" | "sales" | "support"
  createdAt: Date
  lastActive: Date
}

/**
 * Generate deterministic mock users
 * Same seed = same data (useful for testing)
 */
export function generateMockUsers(count: number = 50): User[] {
  const firstNames = [
    "John", "Jane", "Michael", "Sarah", "David", "Emily",
    "Robert", "Lisa", "William", "Jennifer", "James", "Patricia",
    "Richard", "Linda", "Thomas", "Barbara", "Christopher", "Susan",
    "Daniel", "Jessica", "Matthew", "Karen", "Anthony", "Nancy"
  ]

  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia",
    "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez",
    "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson",
    "Martin", "Lee", "Perez", "Thompson", "White", "Harris"
  ]

  const roles: User["role"][] = ["admin", "editor", "viewer"]
  const statuses: User["status"][] = ["active", "inactive", "pending"]
  const departments: User["department"][] = [
    "engineering", "design", "marketing", "sales", "support"
  ]

  const users: User[] = []

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`

    // Deterministic but varied distribution
    const roleIndex = i % 10 < 1 ? 0 : i % 10 < 4 ? 1 : 2 // 10% admin, 30% editor, 60% viewer
    const statusIndex = i % 10 < 7 ? 0 : i % 10 < 9 ? 1 : 2 // 70% active, 20% inactive, 10% pending

    users.push({
      id: `user_${i + 1}`,
      name,
      email,
      role: roles[roleIndex],
      status: statuses[statusIndex],
      department: departments[i % departments.length],
      createdAt: new Date(2024, 0, 1 + i), // Sequential dates starting from Jan 1, 2024
      lastActive: new Date(2024, 11, 20 - (i % 20)), // Recent dates (last 20 days)
    })
  }

  return users
}

/**
 * Get single user by ID
 */
export function getMockUserById(id: string): User | undefined {
  const users = generateMockUsers()
  return users.find((user) => user.id === id)
}

/**
 * Filter users by role
 */
export function getMockUsersByRole(role: User["role"]): User[] {
  const users = generateMockUsers()
  return users.filter((user) => user.role === role)
}

/**
 * Filter users by status
 */
export function getMockUsersByStatus(status: User["status"]): User[] {
  const users = generateMockUsers()
  return users.filter((user) => user.status === status)
}

/**
 * Get statistics
 */
export function getMockUserStats() {
  const users = generateMockUsers()

  return {
    total: users.length,
    byRole: {
      admin: users.filter((u) => u.role === "admin").length,
      editor: users.filter((u) => u.role === "editor").length,
      viewer: users.filter((u) => u.role === "viewer").length,
    },
    byStatus: {
      active: users.filter((u) => u.status === "active").length,
      inactive: users.filter((u) => u.status === "inactive").length,
      pending: users.filter((u) => u.status === "pending").length,
    },
    byDepartment: {
      engineering: users.filter((u) => u.department === "engineering").length,
      design: users.filter((u) => u.department === "design").length,
      marketing: users.filter((u) => u.department === "marketing").length,
      sales: users.filter((u) => u.department === "sales").length,
      support: users.filter((u) => u.department === "support").length,
    },
  }
}
