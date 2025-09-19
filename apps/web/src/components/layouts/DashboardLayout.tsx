import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getDisplayName, getInitials } from '@/utils/user';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Products',
    icon: Package,
    path: '/dashboard/products',
  },
  {
    title: 'Departments',
    icon: Users,
    path: '/dashboard/departments',
  },
  {
    title: 'Orders',
    icon: FileText,
    path: '/dashboard/orders',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/dashboard/settings',
  },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? '280px' : '80px',
          transition: { duration: 0.3 },
        }}
        className={`fixed left-0 top-0 bottom-0 z-40 hidden md:block bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={`h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 ${
              isSidebarOpen ? 'justify-between' : 'justify-center'
            }`}
          >
            {isSidebarOpen ? (
              <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            ) : (
              <img src="/logo-icon.svg" alt="Logo" className="h-8 w-8" />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={isSidebarOpen ? '' : 'hidden'}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : ''
                }`}
              >
                <item.icon className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">{item.title}</span>}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {isSidebarOpen ? (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user ? getInitials(user) : ''}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user ? getDisplayName(user) : ''}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user ? getInitials(user) : ''}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-16 px-4">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 md:hidden bg-white dark:bg-gray-800"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      location.pathname === item.path
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </nav>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {user ? getInitials(user) : ''}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user ? getDisplayName(user) : ''}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'md:pl-[280px]' : 'md:pl-20'
        } pt-16 md:pt-0`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
