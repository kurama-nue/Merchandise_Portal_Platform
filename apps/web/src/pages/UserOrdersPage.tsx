import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Package, Calendar, DollarSign, ShoppingBag, Users, Star, Heart, Zap, Gift } from 'lucide-react';
import { cn } from '../lib/utils';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payments: Payment[];
}

interface IndividualOrder {
  id: string;
  order: Order;
  user: string;
}

interface GroupOrderMember {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  status: string;
}

interface GroupOrder {
  id: string;
  name: string;
  description?: string;
  status: string;
  deadline: string;
  order: Order;
  members: GroupOrderMember[];
}

const UserOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [individualOrders, setIndividualOrders] = useState<IndividualOrder[]>([]);
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('individual');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    fetchUserOrders();
  }, [user, navigate]);

  const fetchUserOrders = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get('/orders/user');
      setIndividualOrders(response.data.individualOrders || []);
      setGroupOrders(response.data.groupOrders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300 font-black';
      case 'PROCESSING':
        return 'text-blue-700 bg-blue-100 border-blue-300 font-black';
      case 'SHIPPED':
        return 'text-purple-700 bg-purple-100 border-purple-300 font-black';
      case 'DELIVERED':
        return 'text-green-700 bg-green-100 border-green-300 font-black';
      case 'CANCELLED':
        return 'text-red-700 bg-red-100 border-red-300 font-black';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300 font-black';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderOrderItems = (items: OrderItem[]) => {
    return (
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-gray-200">
              {item.product?.images?.[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <Package className="h-8 w-8 text-purple-500" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h4 className="text-lg font-black text-gray-900">
                {item.product?.name || item.productName}
              </h4>
              <p className="text-sm text-gray-600 font-medium">
                Qty: {item.quantity} × ₹{item.price.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-purple-600">
                ₹{(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderIndividualOrders = () => {
    if (individualOrders.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 mb-6">
            <ShoppingBag className="h-10 w-10 text-purple-500" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Orders Yet!</h3>
          <p className="text-gray-600 font-medium mb-6">Ready to discover something awesome?</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <Star className="w-5 h-5" />
            START SHOPPING
            <Zap className="w-5 h-5" />
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {individualOrders.map((individualOrder) => {
          const order = individualOrder.order;
          return (
            <motion.div
              key={individualOrder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      Order #{order.orderNumber}
                    </h3>
                    <div className="flex items-center text-gray-600 space-x-6">
                      <span className="flex items-center gap-2 font-medium">
                        <Calendar className="w-5 h-5" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="flex items-center gap-2 font-black text-purple-600">
                        <DollarSign className="w-5 h-5" />
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'px-4 py-2 rounded-2xl text-sm border-2',
                      getStatusColor(order.status)
                    )}
                  >
                    {order.status.toUpperCase()}
                  </div>
                </div>

                <div className="border-t-2 border-gray-100 pt-6">
                  {renderOrderItems(order.orderItems)}
                </div>

                {order.payments && order.payments.length > 0 && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                    <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Payment Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-black text-gray-900">Method:</span>
                        <p className="text-gray-600 font-medium">{order.payments[0].paymentMethod}</p>
                      </div>
                      <div>
                        <span className="font-black text-gray-900">Status:</span>
                        <p className="text-gray-600 font-medium">{order.payments[0].status}</p>
                      </div>
                      <div>
                        <span className="font-black text-gray-900">Date:</span>
                        <p className="text-gray-600 font-medium">{formatDate(order.payments[0].createdAt)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderGroupOrders = () => {
    if (groupOrders.length === 0) {
      return (
        <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 mb-6">
            <Users className="h-10 w-10 text-purple-500" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Group Orders Yet!</h3>
          <p className="text-gray-600 font-medium mb-6">Team up for exclusive deals!</p>
          {user?.role === 'DEPT_HEAD' && (
            <button
              onClick={() => navigate('/group-order/create')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <Users className="w-5 h-5" />
              CREATE GROUP ORDER
              <Zap className="w-5 h-5" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {groupOrders.map((groupOrder) => (
          <motion.div
            key={groupOrder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/group-order/${groupOrder.id}`)}
          >
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{groupOrder.name}</h3>
                  <div className="flex items-center text-gray-600 space-x-6">
                    <span className="flex items-center gap-2 font-medium">
                      <Calendar className="w-5 h-5" />
                      Deadline: {formatDate(groupOrder.deadline)}
                    </span>
                    <span className="flex items-center gap-2 font-medium">
                      <Users className="w-5 h-5" />
                      {groupOrder.members.length} participants
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    'px-4 py-2 rounded-2xl text-sm border-2',
                    getStatusColor(groupOrder.status)
                  )}
                >
                  {groupOrder.status.toUpperCase()}
                </div>
              </div>

              {groupOrder.description && (
                <p className="text-gray-600 font-medium mb-6 p-4 bg-gray-50 rounded-2xl">{groupOrder.description}</p>
              )}

              {groupOrder.order && (
                <div className="border-t-2 border-gray-100 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Details
                    </h4>
                    <span className="text-lg font-black text-purple-600">
                      Total: ₹{groupOrder.order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  {renderOrderItems(groupOrder.order.orderItems)}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
            />
          </div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Heart className="w-12 h-12 text-purple-600" />
            Your Orders
            <Star className="w-12 h-12 text-pink-600" />
          </h1>
          <p className="text-xl text-gray-600 font-medium">Track all your awesome purchases!</p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            <button
              className={cn(
                'px-8 py-4 font-black text-lg rounded-2xl transition-all duration-300',
                activeTab === 'individual'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              )}
              onClick={() => setActiveTab('individual')}
            >
              Individual Orders
            </button>
            <button
              className={cn(
                'px-8 py-4 font-black text-lg rounded-2xl transition-all duration-300 ml-2',
                activeTab === 'group'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              )}
              onClick={() => setActiveTab('group')}
            >
              Group Orders
            </button>
          </div>
        </div>

        {activeTab === 'individual' ? renderIndividualOrders() : renderGroupOrders()}
      </div>
    </div>
  );
};

export default UserOrdersPage;