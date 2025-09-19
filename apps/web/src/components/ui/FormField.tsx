import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, Search, Mail, Lock, User, Phone } from 'lucide-react';
import { Input } from './input';

interface FormFieldProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'search' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  autoIcon?: boolean;
  showPasswordToggle?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  id?: string;
  name?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  required = false,
  disabled = false,
  icon,
  autoIcon = true,
  showPasswordToggle = true,
  className = '',
  inputClassName = '',
  labelClassName = '',
  id,
  name,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Auto icon selection
  const getAutoIcon = () => {
    if (!autoIcon) return null;
    
    switch (type) {
      case 'email':
        return <Mail className="w-5 h-5 text-gray-400" />;
      case 'password':
        return <Lock className="w-5 h-5 text-gray-400" />;
      case 'search':
        return <Search className="w-5 h-5 text-gray-400" />;
      case 'tel':
        return <Phone className="w-5 h-5 text-gray-400" />;
      default:
        return <User className="w-5 h-5 text-gray-400" />;
    }
  };

  const leftIcon = icon || getAutoIcon();
  
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={id}
          className={`block text-sm font-bold text-gray-700 ${labelClassName}`}
          animate={{
            color: hasError ? '#dc2626' : hasSuccess ? '#059669' : isFocused ? '#9333ea' : '#374151'
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <motion.div
              animate={{
                color: hasError ? '#dc2626' : hasSuccess ? '#059669' : isFocused ? '#9333ea' : '#9ca3af'
              }}
              transition={{ duration: 0.2 }}
            >
              {leftIcon}
            </motion.div>
          </div>
        )}

        {/* Input Field */}
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <Input
            ref={ref}
            id={id}
            name={name}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onFocus={() => setIsFocused(true)}
            disabled={disabled}
            className={`
              h-12 rounded-2xl border-2 font-medium transition-all duration-300
              ${leftIcon ? 'pl-12' : 'pl-4'}
              ${(type === 'password' && showPasswordToggle) || hasError || hasSuccess ? 'pr-12' : 'pr-4'}
              ${hasError 
                ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-200' 
                : hasSuccess 
                ? 'border-green-500 bg-green-50 text-green-900 placeholder-green-400 focus:border-green-500 focus:ring-green-200'
                : isFocused
                ? 'border-purple-500 bg-purple-50 focus:border-purple-500 focus:ring-purple-200'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${inputClassName}
            `}
            {...props}
          />
        </motion.div>

        {/* Right Icons */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {/* Success/Error Icon */}
          {(hasError || hasSuccess) && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {hasError ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </motion.div>
          )}

          {/* Password Toggle */}
          {type === 'password' && showPasswordToggle && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Error/Success Message */}
      <AnimatePresence mode="wait">
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 text-sm font-medium ${
              hasError ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {hasError ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FormField.displayName = 'FormField';

// Textarea variant
interface TextareaFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  textareaClassName?: string;
  labelClassName?: string;
  id?: string;
  name?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  textareaClassName = '',
  labelClassName = '',
  id,
  name,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={id}
          className={`block text-sm font-bold text-gray-700 ${labelClassName}`}
          animate={{
            color: hasError ? '#dc2626' : hasSuccess ? '#059669' : isFocused ? '#9333ea' : '#374151'
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Textarea Container */}
      <motion.div
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <textarea
          ref={ref}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          rows={rows}
          className={`
            w-full px-4 py-3 rounded-2xl border-2 font-medium resize-none transition-all duration-300
            ${hasError 
              ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-200' 
              : hasSuccess 
              ? 'border-green-500 bg-green-50 text-green-900 placeholder-green-400 focus:border-green-500 focus:ring-green-200'
              : isFocused
              ? 'border-purple-500 bg-purple-50 focus:border-purple-500 focus:ring-purple-200'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-purple-500 focus:ring-purple-200'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${textareaClassName}
          `}
          {...props}
        />
      </motion.div>

      {/* Error/Success Message */}
      <AnimatePresence mode="wait">
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 text-sm font-medium ${
              hasError ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {hasError ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

TextareaField.displayName = 'TextareaField';

export default FormField;