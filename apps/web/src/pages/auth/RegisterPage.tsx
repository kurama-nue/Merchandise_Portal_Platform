import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, LogIn, Sparkles, UserCheck, Building2, Phone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

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
    confirmPassword: '',
    departmentId: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    departmentId: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = [
    { id: '1', name: 'Human Resources' },
    { id: '2', name: 'Information Technology' },
    { id: '3', name: 'Marketing' },
    { id: '4', name: 'Sales' },
    { id: '5', name: 'Finance' },
    { id: '6', name: 'Operations' }
  ];

  const validateForm = () => {
    const newErrors: typeof errors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      departmentId: ''
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Please select your department';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Registering user with data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        departmentId: formData.departmentId
      });
      
      // Test toast first
      addToast({ 
        title: 'Testing Toast', 
        description: 'This is a test toast to verify visibility', 
        type: 'success' 
      });
      
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : 0
      };
      
      console.log('Calling register function with:', registrationData);
      await register(registrationData);
      
      console.log('Registration successful');
      addToast({ 
        title: 'Welcome to ArtisanX!', 
        description: 'Your account has been created successfully!', 
        type: 'success' 
      });
      
      // Delay navigation to see the toast
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      let message = 'Failed to create account. Please try again.';
      
      if (error && typeof error === 'object') {
        if (error.message) {
          message = error.message;
        } else if (error.response?.data?.message) {
          message = error.response.data.message;
        } else if (error.response?.status) {
          message = `Registration failed with status: ${error.response.status}`;
        }
      } else if (typeof error === 'string') {
        message = error;
      }
      
      console.log('Showing error toast with message:', message);
      addToast({ 
        title: 'Registration Failed', 
        description: message, 
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

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, departmentId: value }));
    if (errors.departmentId) {
      setErrors(prev => ({ ...prev, departmentId: '' }));
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="relative pb-2">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.1),transparent)] opacity-60" />
          
          <motion.div 
            variants={itemVariants}
            className="relative text-center space-y-2"
          >
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg mb-4"
            >
              <UserCheck className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Join ArtisanX
            </h1>
            <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              Create your account to start shopping
            </p>
          </motion.div>
        </CardHeader>

        <CardContent className="relative p-8 pt-4">
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-5"
            variants={containerVariants}
          >
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  First Name
                </label>
                <div className="relative group">
                  <Input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className={`pl-10 h-11 bg-white/50 dark:bg-gray-800/50 border-2 transition-all duration-300 focus:scale-[1.02] ${
                      errors.firstName 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-purple-500'
                    }`}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  {errors.firstName && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.firstName}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Last Name Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Last Name
                </label>
                <div className="relative group">
                  <Input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={`pl-10 h-11 bg-white/50 dark:bg-gray-800/50 border-2 transition-all duration-300 focus:scale-[1.02] ${
                      errors.lastName 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-purple-500'
                    }`}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  {errors.lastName && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.lastName}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Email Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative group">
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  className={`pl-10 h-11 bg-white/50 dark:bg-gray-800/50 border-2 transition-all duration-300 focus:scale-[1.02] ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-purple-500'
                  }`}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <div className="relative group">
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className={`pl-10 h-11 bg-white/50 dark:bg-gray-800/50 border-2 transition-all duration-300 focus:scale-[1.02] ${
                    errors.phone 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-purple-500'
                  }`}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                {errors.phone && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Department Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Department
              </label>
              <select 
                value={formData.departmentId} 
                onChange={(e) => handleSelectChange(e.target.value)}
                className={`w-full h-11 bg-white/50 dark:bg-gray-800/50 border-2 rounded-md px-3 transition-all duration-300 focus:scale-[1.02] ${
                  errors.departmentId 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 dark:border-gray-700 focus:border-purple-500'
                }`}
              >
                <option value="">Select your department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.departmentId}
                </motion.p>
              )}
            </motion.div>

            {/* Password Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative group">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create password"
                    className={`pl-10 pr-12 h-11 bg-white/50 dark:bg-gray-800/50 border-2 transition-all duration-300 focus:scale-[1.02] ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-purple-500'
                    }`}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </label>
                <div className="relative group">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className={`pl-10 pr-12 h-11 bg-white/50 dark:bg-gray-800/50 border-2 transition-all duration-300 focus:scale-[1.02] ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-purple-500'
                    }`}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400">
                  Already have an account?
                </span>
              </div>
            </motion.div>

            {/* Login Link */}
            <motion.div variants={itemVariants} className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/login')}
                className="w-full h-12 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In to Your Account
              </Button>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterPage;
