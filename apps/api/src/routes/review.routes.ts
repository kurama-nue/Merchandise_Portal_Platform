import { Router } from 'express';
import { createReview, getProductReviews, updateReviewStatus } from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

// Public route
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', authenticate, createReview);
router.patch('/:reviewId/status', authenticate, authorize([UserRole.ADMIN]), updateReviewStatus);

export default router;