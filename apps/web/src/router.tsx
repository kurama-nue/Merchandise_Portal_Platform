
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard, RoleGuard, GuestGuard } from './components/guards/RouteGuards';
import { UserRole } from './types/auth';

// Import pages
import Home from './pages/Home';
import EnhancedHome from './pages/EnhancedHome_clean';
import SafeHome from './pages/SafeHome';
import Simple3DTest from './pages/Simple3DTest';
import RouteOverview from './pages/RouteOverview';
import TestPage from './pages/TestPage';
import SimplePage from './pages/SimplePage';
import DebugPage from './pages/DebugPage';
import ProductListingPage from './pages/ProductListingPage';
import { lazy } from 'react';
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';

// Import new pages (to be created)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import UserOrdersPage from './pages/UserOrdersPage';
import GroupOrderDashboardPage from './pages/GroupOrderDashboardPage';
import GroupOrderCreatePage from './pages/GroupOrderCreatePage';
import GroupOrderDetailPage from './pages/GroupOrderDetailPage';
import ReviewsPage from './pages/ReviewsPage';
import DistributionTrackerPage from './pages/DistributionTrackerPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminDistributionPage from './pages/AdminDistributionPage';
import AdminUsersPage from './pages/AdminUsersPage';
import ProductShowcasePage from './pages/ProductShowcasePage';
import CategoryPage from './pages/CategoryPage';
import ProductsIndexPage from './pages/ProductsIndexPage';

// Layout components
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Route configuration with enhanced guards

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
  { index: true, element: <ProductsIndexPage /> },
      { path: 'overview', element: <RouteOverview /> },
      { path: 'safe', element: <SafeHome /> },
      { path: '3d-test', element: <Simple3DTest /> },
      { path: 'enhanced', element: <EnhancedHome /> },
      { path: 'debug', element: <DebugPage /> },
      { path: 'simple', element: <SimplePage /> },
      { path: 'test', element: <TestPage /> },
      { path: 'classic', element: <Home /> },
      { path: 'products', element: <ProductsIndexPage /> },
      { path: 'products-old', element: <ProductListingPage /> },
  { path: 'products/:productId', element: <ProductDetailPage /> },
  { path: 'product/:productId', element: <ProductDetailPage /> },
      { path: 'showcase', element: <ProductShowcasePage /> },
  { path: 'category/:category', element: <CategoryPage /> },
  { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'payment/success', element: <PaymentSuccessPage /> },
      { path: 'payment/failure', element: <PaymentFailurePage /> },
      {
        element: <AuthGuard />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'orders', element: <UserOrdersPage /> },
          { path: 'wishlist', element: <WishlistPage /> },
          { path: 'reviews', element: <ReviewsPage /> },
        ],
      },
      {
        element: <RoleGuard roles={[UserRole.DISTRIBUTOR, UserRole.ADMIN]} />,
        children: [
          { path: 'distribution', element: <DistributionTrackerPage /> },
        ],
      },
      {
        element: <RoleGuard roles={[UserRole.DEPT_HEAD, UserRole.ADMIN]} />,
        children: [
          { path: 'group-orders', element: <GroupOrderDashboardPage /> },
          { path: 'group-order/create', element: <GroupOrderCreatePage /> },
          { path: 'group-order/:groupOrderId', element: <GroupOrderDetailPage /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <GuestGuard />,
    children: [
      {
        path: '',
        element: <AuthLayout />,
        children: [
          { index: true, element: <LoginPage /> },
        ],
      },
    ],
  },
  {
    path: '/register', 
    element: <GuestGuard />,
    children: [
      {
        path: '',
        element: <AuthLayout />,
        children: [
          { index: true, element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        element: <RoleGuard roles={[UserRole.ADMIN]} />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'reviews', element: <AdminReviewsPage /> },
          { path: 'distribution', element: <AdminDistributionPage /> },
          { path: 'users', element: <AdminUsersPage /> },
        ],
      },
    ],
  },
]);

export default router;