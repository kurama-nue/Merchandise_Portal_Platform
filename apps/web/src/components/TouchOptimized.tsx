import React from 'react';
import { motion } from 'framer-motion';
import { useBreakpoint } from '../utils/responsive';

interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
}

export const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false
}) => {
  const { isMobile } = useBreakpoint();

  const baseClasses = `
    inline-flex items-center justify-center font-bold rounded-full 
    transition-all duration-200 active:scale-95 select-none
    ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${isMobile ? 'min-h-[44px] min-w-[44px]' : 'min-h-[40px] min-w-[40px]'}
  `;

  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };

  const sizeClasses = {
    sm: isMobile ? 'px-4 py-2 text-sm' : 'px-3 py-2 text-sm',
    md: isMobile ? 'px-6 py-3 text-base' : 'px-4 py-2 text-base',
    lg: isMobile ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={disabled || isLoading ? undefined : onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

interface TouchOptimizedInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const TouchOptimizedInput: React.FC<TouchOptimizedInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  disabled = false
}) => {
  const { isMobile } = useBreakpoint();

  const baseClasses = `
    w-full rounded-xl border border-gray-300 px-4 bg-white 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
    ${isMobile ? 'py-4 text-base min-h-[44px]' : 'py-3 text-base min-h-[40px]'}
  `;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`${baseClasses} ${className}`}
      required={required}
      disabled={disabled}
      style={{
        fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
      }}
    />
  );
};

interface TouchOptimizedCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export const TouchOptimizedCard: React.FC<TouchOptimizedCardProps> = ({
  children,
  onClick,
  className = '',
  hoverable = true
}) => {
  const { isMobile } = useBreakpoint();

  const baseClasses = `
    bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300
    ${onClick ? 'cursor-pointer select-none' : ''}
    ${isMobile ? 'min-h-[44px]' : 'min-h-[40px]'}
  `;

  const hoverClasses = hoverable ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <motion.div
      whileHover={hoverable && onClick ? { scale: 1.02, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

interface MobileOptimizedGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MobileOptimizedGrid: React.FC<MobileOptimizedGridProps> = ({
  children,
  columns = { mobile: 2, tablet: 3, desktop: 4 },
  gap = 'md',
  className = ''
}) => {
  const { isMobile, isTablet } = useBreakpoint();

  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-6',
    lg: 'gap-4 sm:gap-6 lg:gap-8'
  };

  const getGridCols = () => {
    if (isMobile) return `grid-cols-${columns.mobile || 2}`;
    if (isTablet) return `grid-cols-${columns.tablet || 3}`;
    return `grid-cols-${columns.desktop || 4}`;
  };

  return (
    <div className={`grid ${getGridCols()} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default {
  TouchOptimizedButton,
  TouchOptimizedInput,
  TouchOptimizedCard,
  MobileOptimizedGrid
};