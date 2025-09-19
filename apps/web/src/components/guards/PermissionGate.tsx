import { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { UserRole } from '../../types/auth';

interface PermissionGateProps {
  permission?: string;
  role?: UserRole | UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component for conditionally rendering content based on user permissions or roles
 * 
 * @example
 * // Show content only for users with 'manage:products' permission
 * <PermissionGate permission="manage:products">
 *   <AdminProductPanel />
 * </PermissionGate>
 * 
 * @example
 * // Show content only for admin users
 * <PermissionGate role={UserRole.ADMIN}>
 *   <AdminDashboard />
 * </PermissionGate>
 * 
 * @example
 * // Show different content based on permissions
 * <PermissionGate permission="manage:orders" fallback={<CustomerOrderView />}>
 *   <AdminOrderView />
 * </PermissionGate>
 */
export const PermissionGate = ({
  permission,
  role,
  children,
  fallback = null,
}: PermissionGateProps) => {
  const { can, is } = usePermissions();
  
  // Check if user has the required permission
  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }
  
  // Check if user has the required role
  if (role && !is(role)) {
    return <>{fallback}</>;
  }
  
  // User has the required permission/role
  return <>{children}</>;
};