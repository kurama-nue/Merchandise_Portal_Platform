import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  User, 
  ShoppingBag, 
  Star, 
  CreditCard, 
  Settings, 
  Shield, 
  HelpCircle, 
  ChevronRight, 
  LogOut,
  MapPin,
  Bell
} from 'lucide-react';

interface NavigationItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isAuthenticated: boolean;
  totalItems: number;
  onLogout: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  user,
  isAuthenticated,
  totalItems,
  onLogout
}) => {
  // Add swipe gesture to close navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const diffX = startX - currentX;
      
      // If swiping left with sufficient distance, close navigation
      if (diffX > 50) {
        onClose();
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  };

  const navigationItems: NavigationItem[] = [
    { 
      to: '/products', 
      label: 'Products', 
      icon: <ShoppingBag className="w-5 h-5" />,
      description: 'Browse our collection' 
    },
    { 
      to: '/showcase', 
      label: 'Collections', 
      icon: <Star className="w-5 h-5" />,
      description: 'Curated favorites' 
    },
  ];

  const userMenuItems: NavigationItem[] = isAuthenticated ? [
    { 
      to: '/orders', 
      label: 'My Orders', 
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Track your purchases' 
    },
    { 
      to: '/wishlist', 
      label: 'Wishlist', 
      icon: <Heart className="w-5 h-5" />,
      description: 'Saved items' 
    },
    ...(user?.role === 'DEPT_HEAD' ? [{
      to: '/group-orders',
      label: 'Group Orders',
      icon: <Settings className="w-5 h-5" />,
      description: 'Manage team orders'
    }] : []),
    ...(user?.role === 'ADMIN' ? [{
      to: '/admin',
      label: 'Admin Panel',
      icon: <Shield className="w-5 h-5" />,
      description: 'System management'
    }] : []),
  ] : [];

  const supportItems = [
    {
      label: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      description: 'Get assistance',
      action: () => {
        // Handle support action
        console.log('Support clicked');
      }
    },
    {
      label: 'ArtisianX Locator',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Find nearby locations',
      action: () => {
        // Handle location finder
        console.log('ArtisianX locator clicked');
      }
    },
    {
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      description: 'Manage alerts',
      action: () => {
        // Handle notifications
        console.log('Notifications clicked');
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Side Navigation Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            onTouchStart={handleTouchStart}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-black">ArtisianX</span>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* User Info */}
              {isAuthenticated ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-lg">Hi, {user?.firstName}!</p>
                      <p className="text-white/80 text-sm">{user?.email}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <p className="text-white/90 mb-4">Join ArtisianX family!</p>
                  <div className="flex gap-2">
                    <Link 
                      to="/login"
                      onClick={onClose}
                      className="flex-1 py-2 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-center rounded-xl transition-all"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register"
                      onClick={onClose}
                      className="flex-1 py-2 px-4 bg-white text-purple-600 font-bold text-center rounded-xl hover:bg-gray-100 transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation Content */}
            <div className="p-6">
              {/* Main Navigation */}
              <div className="space-y-2 mb-8">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">
                  Explore
                </h3>
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                  >
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-purple-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 group-hover:bg-purple-100 rounded-xl flex items-center justify-center transition-all">
                          <div className="text-gray-600 group-hover:text-purple-600 transition-colors">
                            {item.icon}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* User Menu */}
              {isAuthenticated && userMenuItems.length > 0 && (
                <div className="space-y-2 mb-8">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">
                    My Account
                  </h3>
                  {userMenuItems.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                    >
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all">
                            <div className="text-gray-600 transition-colors">
                              {item.icon}
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 transition-colors">
                              {item.label}
                            </p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-2 mb-8">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">
                  Quick Actions
                </h3>
                
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-all">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                      {totalItems > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          {totalItems}
                        </motion.span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        Shopping Cart
                      </p>
                      <p className="text-sm text-gray-500">
                        {totalItems > 0 ? `${totalItems} items` : 'Empty cart'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              {/* Support & Info */}
              <div className="space-y-2 border-t border-gray-200 pt-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">
                  Support & More
                </h3>
                
                {supportItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    className="flex items-center justify-between w-full p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all">
                        <div className="text-gray-600">
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>

              {/* Logout Button */}
              {isAuthenticated && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-2xl transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </motion.button>
                </div>
              )}

              {/* App Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500 mb-2">ArtisianX App</p>
                <p className="text-xs text-gray-400">Version 2.0.0</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;