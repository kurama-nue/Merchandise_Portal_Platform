import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

/**
 * Custom hook for checking user permissions and roles
 */
export const usePermissions = () => {
  const { user, checkPermission, hasRole } = useAuth();

  /**
   * Check if the current user can perform a specific action
   * @param permission - The permission to check
   */
  const can = (permission: string): boolean => {
    return checkPermission(permission);
  };

  /**
   * Check if the current user has any of the specified roles
   * @param roles - The roles to check
   */
  const is = (roles: UserRole | UserRole[]): boolean => {
    return hasRole(roles);
  };

  /**
   * Check if the current user is an admin
   */
  const isAdmin = (): boolean => {
    return hasRole(UserRole.ADMIN);
  };

  /**
   * Check if the current user is a manager
   */
  const isManager = (): boolean => {
    return hasRole([UserRole.ADMIN, UserRole.MANAGER]);
  };

  /**
   * Check if the current user is a department head
   */
  const isDeptHead = (): boolean => {
    return hasRole(UserRole.DEPT_HEAD);
  };

  /**
   * Check if the current user is a distributor
   */
  const isDistributor = (): boolean => {
    return hasRole(UserRole.DISTRIBUTOR);
  };

  /**
   * Check if the current user is a regular customer
   */
  const isCustomer = (): boolean => {
    return hasRole(UserRole.CUSTOMER);
  };

  return {
    user,
    can,
    is,
    isAdmin,
    isManager,
    isDeptHead,
    isDistributor,
    isCustomer,
  };
};