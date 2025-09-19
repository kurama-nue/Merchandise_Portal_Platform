import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

interface AuthGuardProps {
  redirectTo?: string;
}

/**
 * Protects routes that require authentication
 */
export const AuthGuard = ({ redirectTo = '/login' }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};

interface RoleGuardProps {
  roles: UserRole[];
  redirectTo?: string;
}

/**
 * Protects routes that require specific roles
 */
export const RoleGuard = ({ roles, redirectTo = '/' }: RoleGuardProps) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasRole(roles)) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};

interface PermissionGuardProps {
  permission: string;
  redirectTo?: string;
}

/**
 * Protects routes that require specific permissions
 */
export const PermissionGuard = ({ permission, redirectTo = '/' }: PermissionGuardProps) => {
  const { isAuthenticated, isLoading, checkPermission } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!checkPermission(permission)) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};

interface GuestGuardProps {
  redirectTo?: string;
}

/**
 * Prevents authenticated users from accessing guest-only routes (like login/register)
 */
export const GuestGuard = ({ redirectTo = '/' }: GuestGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};