import { Router } from 'express';
import { createRazorpayOrder, verifyRazorpayPayment, handleRazorpayWebhook } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.post('/razorpay/create', authenticate, createRazorpayOrder);
router.post('/razorpay/verify', authenticate, verifyRazorpayPayment);

// Webhook route (no authentication)
router.post('/razorpay/webhook', handleRazorpayWebhook);

export default router;