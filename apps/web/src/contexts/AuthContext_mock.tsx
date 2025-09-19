import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '../types/auth';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  departmentId: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Set to false initially to prevent hanging
  
  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call when backend is ready
    console.log('Mock login:', email, 'password length:', password.length);
    setUser({
      id: '1',
      email,
      firstName: 'Demo',
      lastName: 'User',
      role: UserRole.CUSTOMER,
    });
  };

  const register = async (data: RegisterData) => {
    // Mock register - replace with actual API call when backend is ready
    console.log('Mock register:', data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const checkPermission = (permission: string): boolean => {
    // Mock permission check - implement actual logic when needed
    console.log('Checking permission:', permission);
    return true;
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // Remove the API call that was causing the hang
  useEffect(() => {
    // Check if user is already logged in from localStorage
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // For now, just set a mock user
      setUser({
        id: '1',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        role: UserRole.CUSTOMER,
      });
    }
    setIsLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
