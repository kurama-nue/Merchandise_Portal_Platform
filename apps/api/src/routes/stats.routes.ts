import { Router } from 'express';
import { 
  getDashboardStats,
  getSalesReport 
} from '../controllers/stats.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (admin/manager only)
router.get('/dashboard', authenticate, authorize(['ADMIN', 'MANAGER']), getDashboardStats);
router.get('/sales', authenticate, authorize(['ADMIN', 'MANAGER']), getSalesReport);

export default router;