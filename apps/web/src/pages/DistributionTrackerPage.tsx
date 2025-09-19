import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface DistributionItem {
  id: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  status: string;
  assignedTo: string | null;
  assignedToName: string | null;
  scheduledDate: string | null;
  distributedDate: string | null;
}

const DistributionTrackerPage = () => {
  const { user } = useAuth();
  const [distributions, setDistributions] = useState<DistributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'scheduled', 'completed', 'all'
  
  useEffect(() => {
    fetchDistributions();
  }, [activeTab]);
  
  const fetchDistributions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params: Record<string, string> = {};
      
      if (activeTab !== 'all') {
        switch (activeTab) {
          case 'pending':
            params.status = 'PENDING';
            break;
          case 'scheduled':
            params.status = 'SCHEDULED';
            break;
          case 'completed':
            params.status = 'DISTRIBUTED,CANCELLED';
            break;
        }
      }
      
      // If user is admin, fetch all distributions, otherwise fetch user's distributions
      const endpoint = user?.role === 'ADMIN' ? '/distributions/all' : '/distributions/user';
      
      const response = await api.get(endpoint, { params });
      setDistributions(response.data);
    } catch (error) {
      console.error('Error fetching distributions:', error);
      setError('Failed to load distribution data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmReceipt = async (distributionId: string) => {
    try {
      await api.post(`/distributions/${distributionId}/confirm`);
      fetchDistributions();
    } catch (error) {
      console.error('Error confirming receipt:', error);
      setError('Failed to confirm receipt. Please try again.');
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'DISTRIBUTED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusStepClass = (currentStatus: string, stepStatus: string) => {
    const statusOrder = ['PENDING', 'SCHEDULED', 'DISTRIBUTED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (currentStatus === 'CANCELLED') {
      return stepStatus === 'PENDING' ? 'bg-red-500' : 'bg-gray-300';
    }
    
    if (stepIndex < currentIndex || stepStatus === currentStatus) {
      return 'bg-green-500';
    }
    
    return 'bg-gray-300';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Distribution Tracker</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'scheduled' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'completed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            All
          </button>
        </nav>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {/* Distributions List */}
      {loading ? (
        <div className="text-center py-8">Loading distribution data...</div>
      ) : distributions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No distribution items found.
        </div>
      ) : (
        <div className="space-y-6">
          {distributions.map(item => (
            <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  {/* Product Image */}
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-20 w-20 rounded-md border border-gray-200 overflow-hidden">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Distribution Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Order: {item.orderNumber}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div>
                        {item.assignedTo && (
                          <p className="text-sm text-gray-600">Assigned to: {item.assignedToName}</p>
                        )}
                        {item.scheduledDate && (
                          <p className="text-sm text-gray-600">Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}</p>
                        )}
                        {item.distributedDate && (
                          <p className="text-sm text-gray-600">Distributed: {new Date(item.distributedDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Steps */}
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                          Progress
                        </div>
                      </div>
                      <div className="flex mb-2">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${getStatusStepClass(item.status, 'PENDING')}`}></div>
                            <div className="flex-1 ml-2 text-xs">Pending</div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${getStatusStepClass(item.status, 'SCHEDULED')}`}></div>
                            <div className="flex-1 ml-2 text-xs">Scheduled</div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${getStatusStepClass(item.status, 'DISTRIBUTED')}`}></div>
                            <div className="flex-1 ml-2 text-xs">Distributed</div>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div
                          style={{
                            width: item.status === 'PENDING' ? '33%' :
                                  item.status === 'SCHEDULED' ? '66%' :
                                  item.status === 'DISTRIBUTED' ? '100%' : '0%'
                          }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            item.status === 'CANCELLED' ? 'bg-red-500' : 'bg-green-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                    
                    {/* User Actions */}
                    {item.status === 'SCHEDULED' && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleConfirmReceipt(item.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Confirm Receipt
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DistributionTrackerPage;