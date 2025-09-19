import { UserRole } from '../types/auth';

// Define permissions for each role
export const RolePermissions = {
  [UserRole.ADMIN]: [
    'manage:all',
    'manage:users',
    'manage:products',
    'manage:orders',
    'manage:reviews',
    'manage:distribution',
    'view:reports'
  ],
  [UserRole.MANAGER]: [
    'manage:products',
    'manage:orders',
    'manage:reviews',
    'view:reports'
  ],
  [UserRole.DEPT_HEAD]: [
    'manage:group-orders',
    'view:department-users'
  ],
  [UserRole.DISTRIBUTOR]: [
    'manage:distribution',
    'view:orders'
  ],
  [UserRole.CUSTOMER]: [
    'create:orders',
    'view:own-orders',
    'create:reviews'
  ]
};

/**
 * Check if a user has a specific permission based on their role
 * @param userRole - The role of the user
 * @param requiredPermission - The permission to check
 * @returns boolean indicating if the user has the permission
 */
export const hasPermission = (userRole: UserRole, requiredPermission: string): boolean => {
  // Admin has all permissions
  if (userRole === UserRole.ADMIN) return true;
  
  // Get permissions for the user's role
  const permissions = RolePermissions[userRole] || [];
  
  // Check if the user's role has the required permission
  return permissions.includes(requiredPermission);
};

/**
 * Check if a user has any of the specified permissions
 * @param userRole - The role of the user
 * @param requiredPermissions - Array of permissions to check
 * @returns boolean indicating if the user has any of the permissions
 */
export const hasAnyPermission = (userRole: UserRole, requiredPermissions: string[]): boolean => {
  // Admin has all permissions
  if (userRole === UserRole.ADMIN) return true;
  
  // Get permissions for the user's role
  const permissions = RolePermissions[userRole] || [];
  
  // Check if the user's role has any of the required permissions
  return requiredPermissions.some(permission => permissions.includes(permission));
};

/**
 * Check if a user has all of the specified permissions
 * @param userRole - The role of the user
 * @param requiredPermissions - Array of permissions to check
 * @returns boolean indicating if the user has all of the permissions
 */
export const hasAllPermissions = (userRole: UserRole, requiredPermissions: string[]): boolean => {
  // Admin has all permissions
  if (userRole === UserRole.ADMIN) return true;
  
  // Get permissions for the user's role
  const permissions = RolePermissions[userRole] || [];
  
  // Check if the user's role has all of the required permissions
  return requiredPermissions.every(permission => permissions.includes(permission));
};