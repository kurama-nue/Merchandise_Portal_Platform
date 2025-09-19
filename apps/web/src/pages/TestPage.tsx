import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Test Page - Routes Working!</h1>
      <p className="text-xl mb-8">If you can see this, the routing system is working correctly.</p>
      <div className="space-x-4">
        <Link 
          to="/" 
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
        >
          Back to Home
        </Link>
        <Link 
          to="/products" 
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
        >
          View Products
        </Link>
      </div>
    </div>
  );
};

export default TestPage;
