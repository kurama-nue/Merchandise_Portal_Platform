import { Request, Response } from 'express';
import { z } from 'zod';

import FAQ from '../models/FAQ';
import Product from '../models/Product';

const faqSchema = z.object({
  productId: z.string(),
  question: z.string().min(5),
  answer: z.string().min(5),
  isPublished: z.boolean().default(true),
});

// Create FAQ
export const createFAQ = async (req: Request, res: Response) => {
  try {
    if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized. Only admins and managers can create FAQs' });
    }
    
    const validatedData = faqSchema.parse(req.body);
    
    // Check if product exists
    const product = await Product.findById(validatedData.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create FAQ
    const faq = await FAQ.create({
      product: validatedData.productId,
      question: validatedData.question,
      answer: validatedData.answer,
      isPublished: validatedData.isPublished,
    });
    
    res.status(201).json({
      message: 'FAQ created successfully',
      faq,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get product FAQs
export const getProductFAQs = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { includeUnpublished } = req.query as { includeUnpublished?: string };
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Build filter
    const filter: any = { product: productId };
    const shouldIncludeUnpublished =
      !!includeUnpublished && ['ADMIN', 'MANAGER'].includes(req.user?.role);
    if (!shouldIncludeUnpublished) {
      filter.isPublished = true;
    }
    
    const faqs = await FAQ.find(filter).sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update FAQ
export const updateFAQ = async (req: Request, res: Response) => {
  try {
    if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized. Only admins and managers can update FAQs' });
    }
    
    const { id } = req.params;
    const validatedData = faqSchema.partial().parse(req.body);
    
    // Check if FAQ exists
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    // If productId is being updated, ensure referenced product exists
    if (validatedData.productId) {
      const product = await Product.findById(validatedData.productId);
      if (!product) {
        return res.status(400).json({ message: 'Invalid productId' });
      }
    }
    
    // Update FAQ
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      {
        ...(validatedData.productId ? { product: validatedData.productId } : {}),
        ...(validatedData.question !== undefined ? { question: validatedData.question } : {}),
        ...(validatedData.answer !== undefined ? { answer: validatedData.answer } : {}),
        ...(validatedData.isPublished !== undefined ? { isPublished: validatedData.isPublished } : {}),
      },
      { new: true }
    );
    
    res.json({
      message: 'FAQ updated successfully',
      faq: updatedFAQ,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Delete FAQ
export const deleteFAQ = async (req: Request, res: Response) => {
  try {
    if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized. Only admins and managers can delete FAQs' });
    }
    
    const { id } = req.params;
    
    // Check if FAQ exists
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    // Delete FAQ
    await FAQ.findByIdAndDelete(id);
    
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};