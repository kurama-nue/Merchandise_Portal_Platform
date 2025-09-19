import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.post('/', authenticate, authorize(['ADMIN']), createProduct);
router.put('/:id', authenticate, authorize(['ADMIN']), updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteProduct);

export default router;