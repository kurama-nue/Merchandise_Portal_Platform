import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminSidebar = () => {
  const { user } = useAuth();
  
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-gray-400">Welcome, {user?.firstName}</p>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `block px-4 py-2 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `block px-4 py-2 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `block px-4 py-2 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `block px-4 py-2 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Reviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/distribution"
              className={({ isActive }) =>
                `block px-4 py-2 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Distribution
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block px-4 py-2 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
              }
            >
              Users
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;