import { Router } from 'express';
import { 
  createFAQ,
  getProductFAQs,
  updateFAQ,
  deleteFAQ 
} from '../controllers/faq.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), createFAQ);
router.get('/product/:productId', authenticate, getProductFAQs);
router.patch('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), updateFAQ);
router.delete('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), deleteFAQ);

export default router;