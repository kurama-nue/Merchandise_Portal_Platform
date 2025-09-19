import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import Review from '../models/Review';
import Product from '../models/Product';

const prisma = new PrismaClient();

// zod schema remains unchanged
const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// Create review
export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const validatedData = reviewSchema.parse(req.body);
    
    // Check if product exists
    const product = await Product.findById(validatedData.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: validatedData.productId,
      user: userId,
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    // Create review
    const review = await Review.create({
      product: validatedData.productId,
      user: userId,
      rating: validatedData.rating,
      comment: validatedData.comment,
      status: 'OPEN',
    });
    
    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get product reviews
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { status } = req.query as { status?: string };
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Build filter
    const filter: any = { product: productId };
    if (status && req.user?.role === 'ADMIN') {
      filter.status = status;
    } else {
      filter.status = 'OPEN';
    }
    
    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update review status (Admin only)
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body as { status?: 'OPEN' | 'CLOSED' };
    
    if (!status || !['OPEN', 'CLOSED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be OPEN or CLOSED' });
    }
    
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({
      message: 'Review status updated successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};