import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { handleFlip } = useOutletContext<{ handleFlip: () => void, isFlipped: boolean }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/products');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        // Server responded with error
        toast.error(error.response.data?.message || 'Server error occurred');
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        toast.error('Cannot reach the server. Please try again.');
        console.error('Network error:', error.request);
      } else {
        // Error setting up request
        toast.error('Something went wrong. Please try again.');
        console.error('Request error:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-flip-front">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-teal-500 to-amber-500 bg-clip-text text-transparent">Welcome to ArtisanX</h2>
            <p className="mt-2 text-sm text-gray-600">Premium Merchandise Platform</p>
          </motion.div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-amber-500 hover:from-teal-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </motion.div>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <button
              onClick={handleFlip}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Sign up
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
