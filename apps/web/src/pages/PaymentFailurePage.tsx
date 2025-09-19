import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const PaymentFailurePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, error } = location.state || {};
  
  useEffect(() => {
    if (!orderId) {
      navigate('/products');
    }
  }, [orderId, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="glass-card-premium p-8 rounded-lg max-w-md mx-auto border-l-4 border-red-400">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h1>
        
        <p className="text-gray-600 mb-6">
          {error || 'Your payment could not be processed. Please try again or choose a different payment method.'}
        </p>
        
        {orderId && (
          <div className="glass-card-premium p-4 rounded-lg mb-6 border border-red-200">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{orderId}</span>
            </div>
          </div>
        )}
        
        <div className="space-x-4">
          <Link
            to="/checkout"
            className="inline-block bg-teal-amber-gradient text-white px-4 py-2 rounded-lg font-medium hover-glow-amber btn-modern"
          >
            Try Again
          </Link>
          
          <Link
            to="/products"
            className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Discover More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;