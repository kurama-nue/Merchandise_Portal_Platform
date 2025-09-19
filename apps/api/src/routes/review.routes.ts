import { Router } from 'express';
import { createReview, getProductReviews, updateReviewStatus } from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public route
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', authenticate, createReview);
router.patch('/:reviewId/status', authenticate, authorize(['ADMIN']), updateReviewStatus);

export default router;