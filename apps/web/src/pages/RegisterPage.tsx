import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, LogIn, Star, Zap, Gift } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and a number';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        departmentId: 1 // Default department ID
      });
      
      addToast({ 
        title: 'Welcome to ArtisianX!', 
        description: 'Your account has been created successfully.', 
        type: 'success' 
      });
      navigate('/');
    } catch (error: any) {
      addToast({ 
        title: 'Registration Failed', 
        description: error.message || 'Something went wrong. Please try again.', 
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
                    rotate: [0, -2, 2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl mb-6"
                >
                  <Gift className="w-10 h-10 text-white" />
                </motion.div>
                
                <h1 className="text-4xl font-black text-gray-900">
                  Join The Club!
                </h1>
                <p className="text-gray-600 font-medium flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Create your ArtisianX account
                  <Star className="w-4 h-4 text-yellow-500" />
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-5"
                variants={containerVariants}
              >
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-sm font-black text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className={`h-12 bg-gray-50 border-2 rounded-2xl font-medium text-gray-900 placeholder-gray-500 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${
                        errors.firstName 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-purple-500'
                      }`}
                    />
                    {errors.firstName && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs font-medium"
                      >
                        {errors.firstName}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-sm font-black text-gray-900">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className={`h-12 bg-gray-50 border-2 rounded-2xl font-medium text-gray-900 placeholder-gray-500 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${
                        errors.lastName 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-purple-500'
                      }`}
                    />
                    {errors.lastName && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs font-medium"
                      >
                        {errors.lastName}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Email Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={`h-12 bg-gray-50 border-2 rounded-2xl font-medium text-gray-900 placeholder-gray-500 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${
                      errors.email 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-gray-200 focus:border-purple-500'
                    }`}
                  />
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* Phone Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className={`h-12 bg-gray-50 border-2 rounded-2xl font-medium text-gray-900 placeholder-gray-500 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${
                      errors.phone 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-gray-200 focus:border-purple-500'
                    }`}
                  />
                  {errors.phone && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      {errors.phone}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Fields */}
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
                      placeholder="Create a strong password"
                      className={`h-12 bg-gray-50 border-2 rounded-2xl font-medium text-gray-900 placeholder-gray-500 pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${
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
                  </div>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-sm font-black text-gray-900">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className={`h-12 bg-gray-50 border-2 rounded-2xl font-medium text-gray-900 placeholder-gray-500 pr-12 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg ${
                        errors.confirmPassword 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-purple-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
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
                        CREATE ACCOUNT
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
                      Already have an account?
                    </span>
                  </div>
                </motion.div>

                {/* Login Link */}
                <motion.div variants={itemVariants}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="w-full h-14 border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-black text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <LogIn className="mr-3 h-5 w-5" />
                    SIGN IN
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

export default RegisterPage;