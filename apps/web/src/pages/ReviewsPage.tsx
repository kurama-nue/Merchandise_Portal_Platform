import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('open'); // 'open', 'closed', 'all'
  
  useEffect(() => {
    fetchReviews();
  }, [activeTab]);
  
  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params: Record<string, string> = {};
      
      if (activeTab !== 'all') {
        params.status = activeTab === 'open' ? 'OPEN' : 'CLOSED,REJECTED';
      }
      
      // If user is admin, fetch all reviews, otherwise fetch user's reviews
      const endpoint = user?.role === 'ADMIN' ? '/reviews/all' : '/reviews/user';
      
      const response = await api.get(endpoint, { params });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      await api.patch(`/reviews/${reviewId}/status`, { status: newStatus });
      fetchReviews();
    } catch (error) {
      console.error('Error updating review status:', error);
      setError('Failed to update review status. Please try again.');
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Reviews</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('open')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'open' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Open Reviews
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'closed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Closed Reviews
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            All Reviews
          </button>
        </nav>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews found.
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  {/* Product Image */}
                  <div className="flex-shrink-0 mr-4">
                    <Link to={`/products/${review.productId}`}>
                      <div className="h-16 w-16 rounded-md border border-gray-200 overflow-hidden">
                        {review.productImage ? (
                          <img
                            src={review.productImage}
                            alt={review.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                  
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        to={`/products/${review.productId}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {review.productName}
                      </Link>
                      
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(review.status)}`}>
                        {review.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        by {review.userName} on {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                    
                    {/* Admin Actions */}
                    {user?.role === 'ADMIN' && review.status === 'OPEN' && (
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(review.id, 'CLOSED')}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(review.id, 'REJECTED')}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                        >
                          Reject
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

export default ReviewsPage;