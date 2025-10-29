// Role-based redirection utility
export type UserRole = 'admin' | 'user'

export interface RoleRedirectConfig {
  [key: string]: string
}

// Default redirect paths for each role
export const ROLE_REDIRECTS: RoleRedirectConfig = {
  admin: '/admin',
  user: '/dashboard',
  }

/**
 * Get the appropriate redirect path based on user role
 * @param role - The user's role
 * @param customRedirect - Optional custom redirect path (e.g., from URL params)
 * @returns The redirect path
 */
export function getRoleRedirectPath(role: string, customRedirect?: string | null): string {
  // If there's a custom redirect and it's not a role-specific path, use it
  if (customRedirect && !customRedirect.startsWith('/admin')) {
    return customRedirect
  }

  // Get role-specific redirect
  const roleKey = role.toLowerCase() as UserRole
  return ROLE_REDIRECTS[roleKey]
}

/**
 * Check if a user has permission to access a specific path
 * @param userRole - The user's role
 * @param path - The path to check
 * @returns Whether the user can access the path
 */
export function hasRolePermission(userRole: string, path: string): boolean {
  const role = userRole.toLowerCase()
  
  // Admin can access everything
  if (role === 'admin') return true
  
  // Instructor can access instructor and public paths
  if (role === 'instructor') {
    return !path.startsWith('/admin')
  }
  
  // Regular users/students can only access public and user-specific paths
  if (role === 'user' || role === 'student') {
    return !path.startsWith('/admin') && !path.startsWith('/instructor')
  }
  
  // Default: allow access to public paths only
  return !path.startsWith('/admin') && !path.startsWith('/instructor')
}

/**
 * Get a user-friendly role display name
 * @param role - The user's role
 * @returns Display name for the role
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: { [key: string]: string } = {
    admin: 'Administrator',
    user: 'User',
  }
  
  return roleMap[role.toLowerCase()] || 'User'
}
