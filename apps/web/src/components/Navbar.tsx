import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, LogOut, Menu, X, Heart, User, Star, Zap, Settings, CreditCard, Shield, HelpCircle, ChevronRight, Bell, ChevronDown, UserCircle, Package } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import SearchAutosuggest from './SearchAutosuggest';
import { Button } from './ui/button';
import ArtisianXLogo from './ui/ArtisianXLogo';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Mock notifications data
  const notifications = [
    { id: 1, message: "Your order #12345 has been shipped!", type: "order", time: "2 hours ago", unread: true },
    { id: 2, message: "New arrivals in your favorite category!", type: "promotion", time: "1 day ago", unread: true },
    { id: 3, message: "Your wishlist item is now on sale!", type: "sale", time: "2 days ago", unread: false },
  ];

  const unreadNotifications = notifications.filter(n => n.unread).length;

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    // Show toast based on notification type
    switch (notification.type) {
      case 'order':
        toast.success('Order Notification', {
          description: notification.message,
          action: {
            label: 'View Order',
            onClick: () => console.log('Navigate to order details'),
          },
        });
        break;
      case 'promotion':
        toast.info('Promotion Alert', {
          description: notification.message,
          action: {
            label: 'Shop Now',
            onClick: () => console.log('Navigate to products'),
          },
        });
        break;
      case 'sale':
        toast('Sale Alert', {
          description: notification.message,
          action: {
            label: 'View Sale',
            onClick: () => console.log('Navigate to sale items'),
          },
        });
        break;
      default:
        toast(notification.message);
    }
    
    // Close notification dropdown
    setNotificationDropdownOpen(false);
  };

  // User dropdown menu items based on role
  const getUserDropdownItems = () => {
    const baseItems = [
      { 
        to: '/profile', 
        label: 'My Profile', 
        icon: <UserCircle className="w-4 h-4" />,
        description: 'Personal information' 
      },
      { 
        to: '/orders', 
        label: 'My Orders', 
        icon: <Package className="w-4 h-4" />,
        description: 'Order history & tracking' 
      },
      { 
        to: '/wishlist', 
        label: 'Wishlist', 
        icon: <Heart className="w-4 h-4" />,
        description: 'Saved items' 
      },
    ];

    const roleSpecificItems = [];
    
    if (user?.role === 'ADMIN') {
      roleSpecificItems.push({
        to: '/admin',
        label: 'Admin Dashboard',
        icon: <Shield className="w-4 h-4" />,
        description: 'System management'
      });
    }
    
    if (user?.role === 'DEPT_HEAD') {
      roleSpecificItems.push({
        to: '/group-orders',
        label: 'Group Orders',
        icon: <Settings className="w-4 h-4" />,
        description: 'Manage team orders'
      });
    }

    return [...baseItems, ...roleSpecificItems];
  };

  const navigationItems = [
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

  const userMenuItems = isAuthenticated ? [
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
  
  return (
    <motion.nav 
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-center py-2 px-4">
        <motion.p 
          className="text-sm font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ✨ FREE SHIPPING on orders over ₹999 | Premium Quality Guaranteed ✨
        </motion.p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link to="/">
              <ArtisianXLogo size="lg" animate={true} />
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <motion.div className="flex items-center space-x-8">
              <Link 
                to="/category/men" 
                className="text-gray-700 hover:text-purple-600 font-bold text-lg transition-all duration-300 relative group px-2 py-1"
              >
                Men's
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link 
                to="/category/women" 
                className="text-gray-700 hover:text-purple-600 font-bold text-lg transition-all duration-300 relative group px-2 py-1"
              >
                Women's
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link 
                to="/category/accessories" 
                className="text-gray-700 hover:text-purple-600 font-bold text-lg transition-all duration-300 relative group px-2 py-1"
              >
                Accessories
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-purple-600 font-bold text-lg transition-all duration-300 relative group px-2 py-1"
              >
                All Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            {isAuthenticated && (
              <>
                {user?.role === 'DEPT_HEAD' && (
                  <Link 
                    to="/group-orders" 
                    className="text-gray-700 hover:text-purple-600 font-bold text-lg transition-all duration-300 relative group px-2 py-1"
                  >
                    Group Orders
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                
                {user?.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-purple-600 font-bold text-lg transition-all duration-300 relative group px-2 py-1"
                  >
                    Admin
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
            {/* Enhanced Search */}
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <SearchAutosuggest />
              </motion.div>
            </div>

            {/* Notification Bell with Dropdown */}
            {isAuthenticated && (
              <div className="relative" ref={notificationDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="p-3 bg-gray-100 hover:bg-purple-100 rounded-2xl transition-all duration-300 relative"
                >
                  <Bell className="h-5 w-5 text-gray-700" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </motion.button>

                {/* Notification Dropdown */}
                <AnimatePresence>
                  {notificationDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-500">{unreadNotifications} unread messages</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                              notification.unread ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100 space-y-2">
                        <button 
                          onClick={() => {
                            toast.info('Notifications', {
                              description: 'All notifications feature coming soon!',
                            });
                            setNotificationDropdownOpen(false);
                          }}
                          className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium py-2"
                        >
                          View All Notifications
                        </button>
                        <button 
                          onClick={() => {
                            toast.success('Test Notification', {
                              description: 'This is a test notification to verify the system is working!',
                              action: {
                                label: 'OK',
                                onClick: () => console.log('Test notification acknowledged'),
                              },
                            });
                            setNotificationDropdownOpen(false);
                          }}
                          className="w-full text-center text-xs bg-green-100 text-green-600 hover:bg-green-200 font-medium py-2 rounded-lg"
                        >
                          Test Notification System
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist">
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-gray-100 hover:bg-red-100 rounded-2xl transition-all duration-300"
                >
                  <Heart className="h-5 w-5 text-gray-700 hover:text-red-600" />
                </motion.div>
              </Link>
            )}
            
            {/* Enhanced Cart */}
            <Link to="/cart">
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="relative p-3 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-2xl transition-all duration-300 shadow-lg"
              >
                <ShoppingBag className="h-6 w-6 text-purple-700" />
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black rounded-full h-7 w-7 flex items-center justify-center shadow-lg ring-2 ring-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
            </Link>
            
            {/* Enhanced User Account with Dropdown */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center space-x-4">
                <div className="relative" ref={userDropdownRef}>
                  <motion.button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-2xl shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-gray-900 text-sm">Hi, {user?.firstName}!</p>
                      <p className="text-xs text-purple-600 font-semibold">{user?.role}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                              <p className="text-sm text-gray-500">{user?.email}</p>
                              <p className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full inline-block mt-1">{user?.role}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          {getUserDropdownItems().map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                {item.icon}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                          ))}
                        </div>
                        
                        <div className="border-t border-gray-100 p-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/login">
                  <Button 
                    variant="outline"
                    className="h-12 px-6 border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-black rounded-2xl transition-all duration-300 shadow-lg"
                  >
                    LOGIN
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="h-12 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    JOIN ARTISIANX
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Enhanced Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative p-3 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-2xl transition-all duration-300 shadow-lg"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6 text-purple-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6 text-purple-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Mobile Search */}
        <motion.div 
          className="md:hidden mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SearchAutosuggest />
        </motion.div>
        
        {/* Mobile Side Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={closeMobileMenu}
              />

              {/* Side Navigation Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
              >
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <ArtisianXLogo size="md" showText={false} />
                      <span className="text-xl font-black">ArtisianX</span>
                    </motion.div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeMobileMenu}
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
                          onClick={closeMobileMenu}
                          className="flex-1 py-2 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-center rounded-xl transition-all"
                        >
                          Login
                        </Link>
                        <Link 
                          to="/register"
                          onClick={closeMobileMenu}
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
                          onClick={closeMobileMenu}
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
                            onClick={closeMobileMenu}
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
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-all">
                          <ShoppingBag className="w-5 h-5 text-blue-600" />
                          {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {totalItems}
                            </span>
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
                      Support
                    </h3>
                    
                    <button className="flex items-center justify-between w-full p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 group text-left">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all">
                          <HelpCircle className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Help & Support</p>
                          <p className="text-sm text-gray-500">Get assistance</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 transform group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  {/* Logout Button */}
                  {isAuthenticated && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-2xl transition-all duration-300"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;