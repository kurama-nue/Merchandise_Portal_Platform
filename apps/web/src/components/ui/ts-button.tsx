import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface TSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animate?: boolean;
  gradient?: boolean;
}

const TSButton = forwardRef<HTMLButtonElement, TSButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon,
    iconPosition = 'left',
    animate = true,
    gradient = true,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-black text-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: gradient 
        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500'
        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-md hover:shadow-lg focus:ring-gray-400',
      outline: 'border-2 border-purple-600 hover:border-purple-700 text-purple-600 hover:text-purple-700 hover:bg-purple-50 focus:ring-purple-500',
      ghost: 'text-gray-700 hover:text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
      destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl h-9',
      md: 'px-6 py-3 text-base rounded-2xl h-12',
      lg: 'px-8 py-4 text-lg rounded-2xl h-14',
      xl: 'px-12 py-5 text-xl rounded-2xl h-16'
    };

    const MotionButton = animate ? motion.button : 'button';
    const motionProps = animate ? {
      whileHover: { scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
      whileTap: { scale: 0.95 },
      transition: { type: 'spring' as const, stiffness: 400, damping: 17 }
    } : {};

    // Separate motion conflicting props from HTML button props
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, onAnimationIteration, ...buttonProps } = props;

    return (
      <MotionButton
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          'transform hover:scale-105',
          className
        )}
        disabled={disabled || isLoading}
        {...motionProps}
        {...buttonProps}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
        
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </MotionButton>
    );
  }
);

TSButton.displayName = 'TSButton';

export default TSButton;