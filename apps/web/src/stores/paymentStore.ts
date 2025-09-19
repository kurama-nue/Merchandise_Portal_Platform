import { create } from 'zustand';

interface PaymentState {
  // Payment information
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  isProcessing: boolean;
  paymentError: string | null;
  paymentSuccess: boolean;
  
  // Actions
  setOrderDetails: (orderId: string, razorpayOrderId: string, amount: number) => void;
  startPaymentProcess: () => void;
  completePaymentProcess: (success: boolean, error?: string) => void;
  resetPayment: () => void;
}

const usePaymentStore = create<PaymentState>((set) => ({
  // Initial state
  orderId: '',
  razorpayOrderId: '',
  amount: 0,
  currency: 'INR',
  isProcessing: false,
  paymentError: null,
  paymentSuccess: false,
  
  // Actions
  setOrderDetails: (orderId, razorpayOrderId, amount) => set({
    orderId,
    razorpayOrderId,
    amount,
    paymentError: null,
    paymentSuccess: false,
  }),
  
  startPaymentProcess: () => set({
    isProcessing: true,
    paymentError: null,
  }),
  
  completePaymentProcess: (success, error) => set({
    isProcessing: false,
    paymentSuccess: success,
    paymentError: error || null,
  }),
  
  resetPayment: () => set({
    orderId: '',
    razorpayOrderId: '',
    amount: 0,
    isProcessing: false,
    paymentError: null,
    paymentSuccess: false,
  }),
}));

export default usePaymentStore;