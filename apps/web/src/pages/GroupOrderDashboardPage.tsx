import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, Calendar, DollarSign, ArrowRight, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface GroupOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  participants: {
    id: string;
    userId: string;
    userName: string;
    status: string;
  }[];
}

const GroupOrderDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'completed', 'all'
  const [animateCards, setAnimateCards] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user?.role !== 'DEPT_HEAD') {
      navigate('/');
      return;
    }
    
    fetchGroupOrders();
  }, [user, navigate, activeTab]);
  
  useEffect(() => {
    // Trigger animations after data is loaded
    if (!loading && groupOrders.length > 0) {
      setTimeout(() => setAnimateCards(true), 300);
    }
    
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimateCards(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (dashboardRef.current) {
      observer.observe(dashboardRef.current);
    }
    
    return () => {
      if (dashboardRef.current) {
        observer.unobserve(dashboardRef.current);
      }
    };
  }, [loading, groupOrders.length]);
  
  const fetchGroupOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params: Record<string, string> = {};
      
      if (activeTab !== 'all') {
        params.status = activeTab === 'active' ? 'PENDING,IN_PROGRESS' : 'COMPLETED,CANCELLED';
      }
      
      const response = await api.get('/orders/group', { params });
      setGroupOrders(response.data);
    } catch (error) {
      console.error('Error fetching group orders:', error);
      setError('Failed to load group orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateGroupOrder = async () => {
    try {
      const response = await api.post('/orders/group/create');
      navigate(`/group-orders/${response.data.id}`);
    } catch (error) {
      console.error('Error creating group order:', error);
      setError('Failed to create group order. Please try again.');
    }
  };
  
  const handleFinalizeOrder = async (orderId: string) => {
    try {
      await api.post(`/orders/group/${orderId}/finalize`);
      fetchGroupOrders();
    } catch (error) {
      console.error('Error finalizing group order:', error);
      setError('Failed to finalize group order. Please try again.');
    }
  };
  
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this group order?')) {
      return;
    }
    
    try {
      await api.post(`/orders/group/${orderId}/cancel`);
      fetchGroupOrders();
    } catch (error) {
      console.error('Error cancelling group order:', error);
      setError('Failed to cancel group order. Please try again.');
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate progress percentage for participants
  const getParticipantProgress = (order: GroupOrder) => {
    if (order.participants.length === 0) return 0;
    const confirmedCount = order.participants.filter(p => p.status === 'CONFIRMED' || p.status === 'CONFIRMED').length;
    return Math.round((confirmedCount / order.participants.length) * 100);
  };
  
  return (
    <motion.div 
      ref={dashboardRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Group Order Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-500 mt-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Manage your department's group orders
          </motion.p>
        </div>
        
        <motion.button
          onClick={handleCreateGroupOrder}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 glass-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusCircle size={18} />
          <span>Create New Group Order</span>
        </motion.button>
      </motion.div>
      
      {/* Tabs */}
      <motion.div 
        className="border-b border-gray-200 mb-6 glass-card p-2 rounded-lg"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <nav className="-mb-px flex space-x-8">
          <motion.button
            onClick={() => setActiveTab('active')}
            className={cn(
              "py-4 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all",
              activeTab === 'active' 
                ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <Package size={16} />
              <span>Active Orders</span>
            </div>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('completed')}
            className={cn(
              "py-4 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all",
              activeTab === 'completed' 
                ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Completed Orders</span>
            </div>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('all')}
            className={cn(
              "py-4 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all",
              activeTab === 'all' 
                ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <DollarSign size={16} />
              <span>All Orders</span>
            </div>
          </motion.button>
        </nav>
      </motion.div>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="bg-red-100 text-red-700 p-3 rounded-lg mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-blue-600 font-medium">Loading group orders...</p>
          </motion.div>
        </div>
      ) : groupOrders.length === 0 ? (
        <motion.div 
          className="text-center py-12 glass-card rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-gray-100">
              <Package size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No group orders found.</p>
            <motion.button
              onClick={handleCreateGroupOrder}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle size={16} />
              <span>Create Your First Order</span>
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white shadow-md rounded-lg overflow-hidden glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {groupOrders.map((order, index) => (
                  <motion.tr 
                    key={order.id} 
                    className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={animateCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.6)" }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-blue-500" />
                        <div>
                          <div className="text-sm text-gray-900">{order.participants.length} participants</div>
                          <div className="text-xs text-gray-500">
                            {order.participants.filter(p => p.status === 'CONFIRMED').length} confirmed
                          </div>
                          
                          {/* Animated Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                            <motion.div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${getParticipantProgress(order)}%` }}
                              transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-xs text-right mt-0.5 text-gray-500">
                            {getParticipantProgress(order)}% complete
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <DollarSign size={16} className="text-green-500" />
                        <div className="text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-purple-500" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          onClick={() => navigate(`/group-order/${order.id}`)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-md"
                          whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>View</span>
                          <ArrowRight size={14} />
                        </motion.button>
                        
                        {order.status === 'PENDING' && (
                          <>
                            <motion.button
                              onClick={() => handleFinalizeOrder(order.id)}
                              className="text-green-600 hover:text-green-900 flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-md"
                              whileHover={{ scale: 1.05, backgroundColor: "#dcfce7" }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <CheckCircle size={14} />
                              <span>Finalize</span>
                            </motion.button>
                            
                            <motion.button
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-red-600 hover:text-red-900 flex items-center space-x-1 bg-red-50 px-2 py-1 rounded-md"
                              whileHover={{ scale: 1.05, backgroundColor: "#fee2e2" }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <XCircle size={14} />
                              <span>Cancel</span>
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GroupOrderDashboardPage;