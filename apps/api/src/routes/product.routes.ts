import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.post('/', authenticate, authorize([UserRole.ADMIN]), createProduct);
router.put('/:id', authenticate, authorize([UserRole.ADMIN]), updateProduct);
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), deleteProduct);

export default router;