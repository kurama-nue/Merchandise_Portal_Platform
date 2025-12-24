import { Router } from 'express';
import { 
  createFAQ,
  getProductFAQs,
  updateFAQ,
  deleteFAQ 
} from '../controllers/faq.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

// Protected routes
router.post('/', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), createFAQ);
router.get('/product/:productId', authenticate, getProductFAQs);
router.patch('/:id', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), updateFAQ);
router.delete('/:id', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), deleteFAQ);

export default router;