import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';

const stats = [
  {
    title: 'Total Revenue',
    value: '$54,230.50',
    change: '+12.5%',
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: 'Active Orders',
    value: '245',
    change: '+8.2%',
    isPositive: true,
    icon: Package,
  },
  {
    title: 'Department Usage',
    value: '18/20',
    change: '-2.4%',
    isPositive: false,
    icon: Users,
  },
  {
    title: 'Growth Rate',
    value: '23.5%',
    change: '+4.1%',
    isPositive: true,
    icon: TrendingUp,
  },
];

const recentOrders = [
  {
    id: 'ORD001',
    department: 'Marketing',
    items: 12,
    total: '$1,234.56',
    status: 'Pending',
  },
  {
    id: 'ORD002',
    department: 'Sales',
    items: 8,
    total: '$876.50',
    status: 'Processing',
  },
  {
    id: 'ORD003',
    department: 'Engineering',
    items: 15,
    total: '$2,345.00',
    status: 'Shipped',
  },
];

const topProducts = [
  {
    name: 'Custom Logo T-Shirt',
    sales: 1234,
    revenue: '$12,340.00',
    growth: '+15%',
  },
  {
    name: 'Corporate Hoodie',
    sales: 987,
    revenue: '$29,610.00',
    growth: '+8%',
  },
  {
    name: 'Branded Notebook',
    sales: 876,
    revenue: '$4,380.00',
    growth: '+12%',
  },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your merchandise portal.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <stat.icon className="h-6 w-6 text-blue-600" />
                <span
                  className={`text-sm font-medium flex items-center ${
                    stat.isPositive
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
                <Link
                  to="/dashboard/orders"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.id}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.department} • {order.items} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.total}
                      </p>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          order.status === 'Shipped'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : order.status === 'Processing'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Top Products
                </h2>
                <Link
                  to="/dashboard/products"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {topProducts.map((product) => (
                  <div
                    key={product.name}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.sales.toLocaleString()} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.revenue}
                      </p>
                      <span className="text-sm text-green-600">
                        {product.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
