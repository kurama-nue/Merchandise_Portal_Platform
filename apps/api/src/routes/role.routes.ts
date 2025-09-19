import express from 'express';
import { getRoles, updateUserRole } from '../controllers/role.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = express.Router();

// Get all available roles (admin only)
router.get('/roles', authenticate, authorize([UserRole.ADMIN]), getRoles);

// Update a user's role (admin only)
router.put('/users/:userId/role', authenticate, authorize([UserRole.ADMIN]), updateUserRole);

export default router;