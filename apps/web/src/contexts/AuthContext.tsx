import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { UserRole } from '../types/auth';
export type { UserRole as Role } from '../types/auth';

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
import { hasPermission } from '../utils/permissions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  
  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      // Fetch user data with timeout
      const timeoutId = setTimeout(() => {
        console.warn('API request timed out, proceeding without authentication');
        setIsLoading(false);
      }, 3000); // 3 second timeout

      api.get('/auth/me')
        .then(response => {
          clearTimeout(timeoutId);
          setUser(response.data.user);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.warn('Auth API failed:', error.message);
          // Token invalid or API unavailable, remove from storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
  };
  
  const register = async (userData: RegisterData) => {
    console.log('AuthContext register called with:', userData);
    console.log('API base URL:', import.meta.env.VITE_API_URL);
    
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Registration API response:', response.data);
      
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      
      console.log('User registered and logged in:', user);
    } catch (error: any) {
      console.error('API registration error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    
    // Call logout API
    api.post('/auth/logout').catch(() => {
      // Ignore errors on logout
    });
  };
  
  // Check if user has a specific permission
  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role as UserRole, permission);
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role as UserRole);
    }
    
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkPermission,
        hasRole,
      }}
    >
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