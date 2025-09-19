import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, paymentId } = location.state || {};
  
  useEffect(() => {
    if (!orderId || !paymentId) {
      navigate('/products');
    }
  }, [orderId, paymentId, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="glass-card-premium p-8 rounded-lg max-w-md mx-auto border-l-4 border-brand-teal">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        
  <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-teal-amber-gradient">ArtisanX Order Confirmed!</h1>
        
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. Your order is now being prepared.
        </p>
        
        <div className="glass-card-premium p-4 rounded-lg mb-6 border border-teal-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment ID:</span>
            <span className="font-medium">{paymentId}</span>
          </div>
        </div>
        
        <div className="space-x-4">
          <Link
            to="/products"
            className="inline-block bg-teal-amber-gradient text-white px-4 py-2 rounded-lg font-medium hover-glow-amber btn-modern"
          >
            Discover More
          </Link>
          
          <Link
            to="/orders"
            className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;