import { Router } from 'express';
import { register, login, refreshToken, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { corsMiddleware } from '../middleware/cors.middleware';

const router = Router();

// Apply CORS specifically for auth routes
router.use(corsMiddleware());

// Remove CSRF validation for auth routes temporarily
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;