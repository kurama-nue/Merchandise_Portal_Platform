// User roles enum
export enum UserRole {
  ADMIN = 'ADMIN',           // Full system access
  MANAGER = 'MANAGER',       // Product and order management
  DEPT_HEAD = 'DEPT_HEAD',   // Department head for group orders
  DISTRIBUTOR = 'DISTRIBUTOR', // Handles distribution
  CUSTOMER = 'CUSTOMER'      // Regular user
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId?: string;
}

// Authentication context interface
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

// Registration data interface
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  departmentId?: string;
}