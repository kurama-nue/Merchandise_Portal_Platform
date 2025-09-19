import { Request, Response } from 'express';
import Product from '../models/Product';
import Review from '../models/Review';
import FAQ from '../models/FAQ';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string()).optional(),
  departmentId: z.string(),
});

// Get all products with filtering
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { departmentId, minPrice, maxPrice, q, inStock, onSale, sort, limit } = req.query as Record<string, string>;

    const filters: any = {};
    if (departmentId) {
      filters.department = departmentId;
    }
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice as string);
    }
    if (q && q.trim()) {
      const rx = new RegExp(q.trim(), 'i');
      filters.$or = [{ name: rx }, { description: rx }];
    }
    if (inStock === 'true') {
      filters.stock = { $gt: 0 };
    }
    if (onSale === 'true') {
      filters.discountPrice = { $ne: null };
    }

    let queryExec = Product.find(filters).populate('department');
    // sort options: price_asc, price_desc, newest
    if (sort === 'price_asc') queryExec = queryExec.sort({ price: 1 });
    if (sort === 'price_desc') queryExec = queryExec.sort({ price: -1 });
    if (sort === 'newest') queryExec = queryExec.sort({ createdAt: -1 });

    if (limit && !Number.isNaN(Number(limit))) {
      queryExec = queryExec.limit(Number(limit));
    }

    const products = await queryExec.lean();

    const results = await Promise.all(
      products.map(async (p: any) => {
        const reviews = await Review.find({ product: p._id, status: 'OPEN' })
          .populate('user', 'firstName lastName')
          .lean();

        const totalRating = reviews.reduce((sum, r: any) => sum + (r.rating || 0), 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        return {
          ...p,
          reviews: reviews.map((r: any) => ({
            id: r._id?.toString(),
            rating: r.rating,
            comment: r.comment,
            user: r.user
              ? {
                  id: r.user._id?.toString(),
                  firstName: r.user.firstName,
                  lastName: r.user.lastName,
                }
              : undefined,
            createdAt: r.createdAt,
          })),
          averageRating,
          reviewCount: reviews.length,
        };
      })
    );

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('department').lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: product._id, status: 'OPEN' })
      .populate('user', 'firstName lastName')
      .lean();

    const faqs = await FAQ.find({ product: product._id, isPublished: true }).lean();

    const totalRating = reviews.reduce((sum, r: any) => sum + (r.rating || 0), 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.json({
      ...product,
      reviews: reviews.map((r: any) => ({
        id: r._id?.toString(),
        rating: r.rating,
        comment: r.comment,
        user: r.user
          ? {
              id: r.user._id?.toString(),
              firstName: r.user.firstName,
              lastName: r.user.lastName,
            }
          : undefined,
        createdAt: r.createdAt,
      })),
      faqs: faqs.map((f: any) => ({
        id: f._id?.toString(),
        question: f.question,
        answer: f.answer,
        isPublished: f.isPublished,
      })),
      averageRating,
      reviewCount: reviews.length,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create product (Admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = productSchema.parse(req.body);

    const product = await Product.create({
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      discountPrice: validatedData.discountPrice,
      stock: validatedData.stock,
      images: validatedData.images || [],
      department: validatedData.departmentId,
    });

    res.status(201).json(product.toJSON());
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product (Admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = productSchema.partial().parse(req.body);

    const update: any = { ...validatedData };
    if (validatedData.departmentId) {
      update.department = validatedData.departmentId;
      delete update.departmentId;
    }

    const product = await Product.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};