import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'hearts' | 'pulse' | 'bounce' | 'gradient';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerSizes = {
    sm: 'gap-2 text-sm',
    md: 'gap-3 text-base',
    lg: 'gap-4 text-lg',
    xl: 'gap-5 text-xl'
  };

  if (variant === 'hearts') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <div className="relative">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <Heart className={`${sizeClasses[size]} text-pink-500 fill-current`} />
            </motion.div>
          ))}
        </div>
        {text && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-bold text-pink-600 mt-4"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-600 to-pink-600`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {text && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="font-bold text-gray-700 mt-4"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="font-bold text-gray-700 mt-4"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-4 border-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-border`}
          style={{
            background: 'conic-gradient(from 0deg, #9333ea, #e91e63, #9333ea)',
            borderRadius: '50%',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-full h-full bg-white rounded-full scale-75" />
        </motion.div>
        {text && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-4"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-purple-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-bold text-gray-700 mt-4"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Full page loading component
export const PageLoader: React.FC<{ text?: string }> = ({ text = "Loading awesome content..." }) => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative mx-auto w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-gray-200"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-pink-600"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-white fill-current" />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black text-gray-900 mb-4"
          >
            ArtisianX
          </motion.h3>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 font-medium"
          >
            {text}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex justify-center gap-2"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Component loading placeholder
export const ComponentLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size="lg" variant="gradient" text="Loading..." />
    </div>
  );
};

export default LoadingSpinner;