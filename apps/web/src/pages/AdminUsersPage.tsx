import React, { useState, useEffect } from 'react';
import { UserRoleManager } from '../components/admin/UserRoleManager';
import { usePermissions } from '../hooks/usePermissions';

const AdminUsersPage: React.FC = () => {
  const { isAdmin } = usePermissions();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      {isAdmin() ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Role Management</h2>
          <UserRoleManager />
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>You do not have permission to access this feature.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;