import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useGroupOrderStore from '../stores/groupOrderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Package, Calendar, DollarSign, CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';

const GroupOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentGroupOrder, 
    isLoading, 
    error, 
    fetchGroupOrderById, 
    finalizeGroupOrder,
    cancelGroupOrder,
    inviteParticipant,
    setError,
    clearCurrentGroupOrder
  } = useGroupOrderStore();
  
  useEffect(() => {
    // Check if user is department head
    if (user?.role !== 'DEPT_HEAD') {
      navigate('/');
      return;
    }
    
    // Fetch group order details
    if (id) {
      fetchGroupOrderById(id);
    }
    
    // Cleanup on unmount
    return () => {
      clearCurrentGroupOrder();
    };
  }, [id, user, navigate, fetchGroupOrderById, clearCurrentGroupOrder]);
  
  useEffect(() => {
    // Trigger animations after data is loaded
    if (!isLoading && currentGroupOrder) {
      setTimeout(() => setAnimateElements(true), 300);
    }
    
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimateElements(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (pageRef.current) {
      observer.observe(pageRef.current);
    }
    
    return () => {
      if (pageRef.current) {
        observer.unobserve(pageRef.current);
      }
    };
  }, [isLoading, currentGroupOrder]);
  
  const handleFinalizeOrder = async () => {
    try {
      if (id) {
        await finalizeGroupOrder(id);
        // Refresh data
        fetchGroupOrderById(id);
      }
    } catch (error) {
      console.error('Error finalizing group order:', error);
    }
  };
  
  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this group order?')) {
      return;
    }
    
    try {
      if (id) {
        await cancelGroupOrder(id);
        // Refresh data
        fetchGroupOrderById(id);
      }
    } catch (error) {
      console.error('Error cancelling group order:', error);
    }
  };
  
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail.trim()) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      if (id) {
        await inviteParticipant(id, inviteEmail);
        setInviteEmail('');
        setShowInviteForm(false);
      }
    } catch (error) {
      console.error('Error inviting participant:', error);
    }
  };
  
  // Calculate progress percentage for participants
  const getParticipantProgress = () => {
    if (!currentGroupOrder || currentGroupOrder.participants.length === 0) return 0;
    const confirmedCount = currentGroupOrder.participants.filter(p => p.status === 'CONFIRMED').length;
    return Math.round((confirmedCount / currentGroupOrder.participants.length) * 100);
  };
  
  if (isLoading) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-8">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-blue-600 font-medium">Loading group order details...</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  if (!currentGroupOrder) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-red-100 text-red-700 p-6 rounded-lg mb-4 glass-card"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <XCircle className="text-red-500" size={24} />
            <p className="font-medium">Group order not found or you don't have permission to view it.</p>
          </div>
        </motion.div>
        <motion.button
          onClick={() => navigate('/group-orders')}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </motion.button>
      </motion.div>
    );
  }
  
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <motion.div 
      ref={pageRef}
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
            Group Order Details
          </motion.h1>
          <motion.p 
            className="text-gray-500 mt-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {currentGroupOrder.orderNumber}
          </motion.p>
        </div>
        
        <motion.button
          onClick={() => navigate('/group-orders')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 glass-card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </motion.button>
      </motion.div>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 glass-card"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center space-x-2">
              <XCircle size={18} />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Order Header */}
      <motion.div 
        className="bg-white shadow-md rounded-lg overflow-hidden mb-6 p-6 glass-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <p className="text-sm text-gray-500">Details and progress</p>
              </div>
            </motion.div>
            
            <div className="space-y-4">
              <motion.div 
                className="flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span className="text-gray-500 w-32">Status:</span>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(currentGroupOrder.status)}`}>
                  {currentGroupOrder.status}
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="text-gray-500 w-32">Created:</span>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-purple-500" />
                  <span>{formatDate(currentGroupOrder.createdAt)}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="text-gray-500 w-32">Total Amount:</span>
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-green-500" />
                  <span className="font-semibold">₹{currentGroupOrder.totalAmount.toFixed(2)}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Participant Confirmation</span>
                  <span className="text-sm font-medium">{getParticipantProgress()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getParticipantProgress()}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {currentGroupOrder.participants.filter(p => p.status === 'CONFIRMED').length} of {currentGroupOrder.participants.length} participants confirmed
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="flex flex-col justify-end items-end space-y-3">
            {currentGroupOrder.status === 'PENDING' && (
              <>
                <motion.button
                  onClick={() => setShowInviteForm(!showInviteForm)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all w-full md:w-auto flex items-center justify-center space-x-2 glass-card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Mail size={18} />
                  <span>Invite Participant</span>
                </motion.button>
                
                <motion.button
                  onClick={handleFinalizeOrder}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all w-full md:w-auto flex items-center justify-center space-x-2 glass-card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <CheckCircle size={18} />
                  <span>Finalize Order</span>
                </motion.button>
                
                <motion.button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all w-full md:w-auto flex items-center justify-center space-x-2 glass-card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <XCircle size={18} />
                  <span>Cancel Order</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
        
        {/* Invite Form */}
        <AnimatePresence>
          {showInviteForm && (
            <motion.div 
              className="mt-6 p-6 border border-gray-200 rounded-lg glass-card bg-blue-50/30 dark:bg-blue-900/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3 
                className="text-lg font-medium mb-3 flex items-center space-x-2"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Mail size={18} className="text-blue-500" />
                <span>Invite Participant</span>
              </motion.h3>
              <motion.form 
                onSubmit={handleInviteSubmit} 
                className="flex flex-col md:flex-row gap-3"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Invitation
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Participants */}
      <motion.div 
        className="bg-white shadow-md rounded-lg overflow-hidden mb-6 glass-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center space-x-3">
            <Users className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold">Participants ({currentGroupOrder.participants.length})</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentGroupOrder.participants.map((participant, index) => (
                <motion.tr 
                  key={participant.id}
                  className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={animateElements ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 + 0.5 }}
                  whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.6)" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{participant.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(participant.status)}`}>
                      {participant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-purple-500" />
                      <span>{participant.joinedAt ? formatDate(participant.joinedAt) : 'N/A'}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Order Items */}
      <motion.div 
        className="bg-white shadow-md rounded-lg overflow-hidden glass-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center space-x-3">
            <Package className="text-purple-500" size={20} />
            <h2 className="text-lg font-semibold">Order Items</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentGroupOrder.items.map((item, index) => (
                <motion.tr 
                  key={item.id}
                  className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={animateElements ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 + 0.7 }}
                  whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.6)" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>
                </motion.tr>
              ))}
              <motion.tr 
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  ₹{currentGroupOrder.totalAmount.toFixed(2)}
                </td>
              </motion.tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GroupOrderDetailPage;