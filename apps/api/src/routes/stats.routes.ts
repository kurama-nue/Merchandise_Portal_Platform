import { Router } from 'express';
import { 
  getDashboardStats,
  getSalesReport 
} from '../controllers/stats.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

// Protected routes (admin/manager only)
router.get('/dashboard', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), getDashboardStats);
router.get('/sales', authenticate, authorize([UserRole.ADMIN, UserRole.MANAGER]), getSalesReport);

export default router;