import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      // Focus management
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4'
  };

  const variantStyles = {
    default: {
      header: 'bg-gradient-to-r from-purple-600 to-pink-600',
      icon: <Heart className="w-6 h-6" />,
      iconColor: 'text-white'
    },
    success: {
      header: 'bg-gradient-to-r from-green-500 to-emerald-600',
      icon: <CheckCircle className="w-6 h-6" />,
      iconColor: 'text-white'
    },
    error: {
      header: 'bg-gradient-to-r from-red-500 to-pink-600',
      icon: <AlertCircle className="w-6 h-6" />,
      iconColor: 'text-white'
    },
    warning: {
      header: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      icon: <AlertTriangle className="w-6 h-6" />,
      iconColor: 'text-white'
    },
    info: {
      header: 'bg-gradient-to-r from-blue-500 to-purple-600',
      icon: <Info className="w-6 h-6" />,
      iconColor: 'text-white'
    }
  };

  const currentVariant = variantStyles[variant];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`bg-white rounded-3xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={`${currentVariant.header} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  {title && (
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={currentVariant.iconColor}
                      >
                        {currentVariant.icon}
                      </motion.div>
                      <h2 className="text-2xl font-black">{title}</h2>
                    </div>
                  )}
                  
                  {showCloseButton && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Confirmation Modal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'success';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false
}) => {
  const variantStyles = {
    default: {
      confirmClass: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      modalVariant: 'default' as const
    },
    danger: {
      confirmClass: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      modalVariant: 'error' as const
    },
    success: {
      confirmClass: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      modalVariant: 'success' as const
    }
  };

  const currentStyle = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant={currentStyle.modalVariant}
      closeOnBackdropClick={!isLoading}
    >
      <div className="space-y-6">
        <p className="text-gray-700 text-center leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-bold rounded-2xl transition-all duration-300"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button
              onClick={onConfirm}
              className={`w-full h-12 ${currentStyle.confirmClass} text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </Modal>
  );
};

// Success Modal
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = '🎉 Success!',
  message,
  actionText = 'Continue',
  onAction
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant="success"
    >
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
          className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        
        <p className="text-gray-700 leading-relaxed">
          {message}
        </p>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onAction || onClose}
            className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {actionText}
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default Modal;