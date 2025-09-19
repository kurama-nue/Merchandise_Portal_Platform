import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, UserPlus, Star, Heart, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      addToast({ 
        title: 'Welcome back!', 
        description: 'You have been successfully logged in.', 
        type: 'success' 
      });
      navigate('/');
    } catch (error) {
      addToast({ 
        title: 'Login Failed', 
        description: 'Invalid email or password. Please try again.', 
        type: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <Card className="bg-white shadow-2xl rounded-2xl overflow-hidden border-0">
            <CardHeader className="relative pb-8 pt-8">
              {/* ArtisianX-inspired header */}
              <div className="text-center space-y-4">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl mb-6"
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>
                
                <h1 className="text-4xl font-black text-gray-900">
                  Welcome Back!
                </h1>
                <p className="text-gray-600 font-medium flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Sign in to your ArtisianX account
                  <Star className="w-4 h-4 text-yellow-500" />
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                variants={containerVariants}
              >
                {/* Email Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className={`h-14 bg-gray-50 border-2 rounded-2xl font-medium text-gray-900 placeholder-gray-500 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${
                        errors.email 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-purple-500'
                      }`}
                    />
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm font-medium mt-2"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`h-14 bg-gray-50 border-2 rounded-2xl font-medium text-gray-900 placeholder-gray-500 pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${
                        errors.password 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-purple-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.password && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm font-medium mt-2"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Zap className="w-5 h-5" />
                        SIGN IN
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-6 text-gray-500 font-medium">
                      New to ArtisianX?
                    </span>
                  </div>
                </motion.div>

                {/* Register Link */}
                <motion.div variants={itemVariants}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/register')}
                    className="w-full h-14 border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-black text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <UserPlus className="mr-3 h-5 w-5" />
                    CREATE ACCOUNT
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;