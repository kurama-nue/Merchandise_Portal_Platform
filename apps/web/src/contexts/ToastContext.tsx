import React, { createContext, useContext } from 'react';
import { toast, Toaster } from 'sonner';

type ToastType = 'default' | 'destructive' | 'success';

interface ToastMessage {
  title?: string;
  description: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: ToastMessage) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const addToast = ({ title, description, type, duration = 5000 }: ToastMessage) => {
    const message = title ? `${title}: ${description}` : description;
    
    switch (type) {
      case 'success':
        toast.success(message, {
          duration,
          style: {
            background: '#22c55e',
            color: 'white',
            border: '1px solid #16a34a'
          }
        });
        break;
      case 'destructive':
        toast.error(message, {
          duration,
          style: {
            background: '#ef4444',
            color: 'white',
            border: '1px solid #dc2626'
          }
        });
        break;
      default:
        toast(message, {
          duration,
          style: {
            background: '#1f2937',
            color: 'white',
            border: '1px solid #374151'
          }
        });
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <Toaster 
        position="top-right"
        closeButton
        richColors
        toastOptions={{
          style: {
            color: 'white'
          }
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastContextProvider');
  }
  return context;
}