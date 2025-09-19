import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types/auth';
import api from '../../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export const UserRoleManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data.users);
        setError(null);
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      setLoading(true);
      await api.put(`/users/${selectedUser}/role`, { role: selectedRole });
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === selectedUser ? { ...user, role: selectedRole } : user
      ));
      
      setUpdateStatus({ success: true, message: 'User role updated successfully' });
      
      // Reset selection
      setSelectedUser(null);
      setSelectedRole(null);
    } catch (err) {
      setUpdateStatus({ success: false, message: 'Failed to update user role' });
      console.error('Error updating user role:', err);
    } finally {
      setLoading(false);
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {updateStatus && (
        <div className={`p-3 rounded ${updateStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {updateStatus.message}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' :
                    user.role === UserRole.MANAGER ? 'bg-blue-100 text-blue-800' :
                    user.role === UserRole.DEPT_HEAD ? 'bg-green-100 text-green-800' :
                    user.role === UserRole.DISTRIBUTOR ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedUser(user.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Change User Role</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Role
              </label>
              <select
                value={selectedRole || ''}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>Select a role</option>
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedRole(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                disabled={!selectedRole}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  selectedRole
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-400 cursor-not-allowed'
                }`}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};