import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import axios from 'axios';

const prisma = new PrismaClient();

// Validation schemas
const paymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('INR'),
  notes: z.record(z.string()).optional(),
});

const verifyPaymentSchema = z.object({
  razorpayPaymentId: z.string(),
  razorpayOrderId: z.string(),
  razorpaySignature: z.string(),
});

// Create Razorpay order
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const validatedData = paymentSchema.parse(req.body);
    
    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      include: {
        payments: true,
      },
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }
    
    // Check if payment is already completed
    const completedPayment = order.payments.find(payment => payment.status === 'COMPLETED');
    if (completedPayment) {
      return res.status(400).json({ message: 'Payment already completed for this order' });
    }
    
    // Create Razorpay order
    const razorpayData = {
      amount: Math.round(validatedData.amount * 100), // Convert to smallest currency unit (paise)
      currency: validatedData.currency,
      receipt: `receipt_${order.orderNumber}`,
      notes: validatedData.notes || {
        orderId: validatedData.orderId,
      },
    };
    
    // In a real implementation, we would use the Razorpay SDK
    // For now, we'll simulate the API call
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET,
    // });
    // const razorpayOrder = await razorpay.orders.create(razorpayData);
    
    // Simulate Razorpay order creation response
    const razorpayOrder = {
      id: `razorpay_order_${Date.now()}`,
      entity: 'order',
      amount: razorpayData.amount,
      amount_paid: 0,
      amount_due: razorpayData.amount,
      currency: razorpayData.currency,
      receipt: razorpayData.receipt,
      status: 'created',
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000),
    };
    
    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        orderId: validatedData.orderId,
        userId,
        amount: validatedData.amount,
        paymentMethod: 'RAZORPAY',
        razorpayId: razorpayOrder.id,
        status: 'PENDING',
      },
    });
    
    res.status(201).json({
      message: 'Razorpay order created successfully',
      payment,
      razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key_id', // For frontend integration
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const validatedData = verifyPaymentSchema.parse(req.body);
    
    // Find payment by Razorpay order ID
    const payment = await prisma.payment.findFirst({
      where: { razorpayId: validatedData.razorpayOrderId },
      include: {
        order: true,
      },
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if payment belongs to user
    if (payment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this payment' });
    }
    
    // Verify signature
    const text = `${validatedData.razorpayOrderId}|${validatedData.razorpayPaymentId}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'razorpay_test_secret';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');
    
    const isSignatureValid = generatedSignature === validatedData.razorpaySignature;
    
    if (!isSignatureValid) {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          transactionId: validatedData.razorpayPaymentId,
        },
      });
      
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    
    // Update payment and order status
    const updatedPayment = await prisma.$transaction(async (prisma) => {
      // Update payment status
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          transactionId: validatedData.razorpayPaymentId,
        },
      });
      
      // Update order status
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: 'PROCESSING',
        },
      });
      
      return updatedPayment;
    });
    
    res.json({
      message: 'Payment verified successfully',
      payment: updatedPayment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Handle Razorpay webhook
export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  try {
    // Verify webhook signature
    const webhookSignature = req.headers['x-razorpay-signature'] as string;
    
    if (!webhookSignature) {
      return res.status(400).json({ message: 'Missing webhook signature' });
    }
    
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (generatedSignature !== webhookSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }
    
    // Process webhook event
    const event = req.body;
    
    switch (event.event) {
      case 'payment.authorized':
        // Payment authorized, update payment status
        await handlePaymentAuthorized(event.payload.payment.entity);
        break;
      
      case 'payment.failed':
        // Payment failed, update payment status
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      
      case 'refund.created':
        // Refund created, update payment status
        await handleRefundCreated(event.payload.refund.entity);
        break;
      
      default:
        // Ignore other events
        break;
    }
    
    res.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper functions for webhook handling
async function handlePaymentAuthorized(payment: any) {
  const razorpayOrderId = payment.order_id;
  
  // Find payment by Razorpay order ID
  const dbPayment = await prisma.payment.findFirst({
    where: { razorpayId: razorpayOrderId },
  });
  
  if (!dbPayment) {
    console.error(`Payment not found for Razorpay order ID: ${razorpayOrderId}`);
    return;
  }
  
  // Update payment and order status
  await prisma.$transaction(async (prisma) => {
    // Update payment status
    await prisma.payment.update({
      where: { id: dbPayment.id },
      data: {
        status: 'COMPLETED',
        transactionId: payment.id,
      },
    });
    
    // Update order status
    await prisma.order.update({
      where: { id: dbPayment.orderId },
      data: {
        status: 'PROCESSING',
      },
    });
  });
}

async function handlePaymentFailed(payment: any) {
  const razorpayOrderId = payment.order_id;
  
  // Find payment by Razorpay order ID
  const dbPayment = await prisma.payment.findFirst({
    where: { razorpayId: razorpayOrderId },
  });
  
  if (!dbPayment) {
    console.error(`Payment not found for Razorpay order ID: ${razorpayOrderId}`);
    return;
  }
  
  // Update payment status
  await prisma.payment.update({
    where: { id: dbPayment.id },
    data: {
      status: 'FAILED',
      transactionId: payment.id,
    },
  });
}

async function handleRefundCreated(refund: any) {
  const razorpayPaymentId = refund.payment_id;
  
  // Find payment by transaction ID (Razorpay payment ID)
  const dbPayment = await prisma.payment.findFirst({
    where: { transactionId: razorpayPaymentId },
  });
  
  if (!dbPayment) {
    console.error(`Payment not found for Razorpay payment ID: ${razorpayPaymentId}`);
    return;
  }
  
  // Update payment status
  await prisma.payment.update({
    where: { id: dbPayment.id },
    data: {
      status: 'REFUNDED',
    },
  });
}