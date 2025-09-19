import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../AdminSidebar';

const AdminLayout = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;