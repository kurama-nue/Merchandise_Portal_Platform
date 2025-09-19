import { Router } from 'express';
import {
  createDistributionSchedule,
  getDistributionSchedules,
  getDistributionScheduleById,
  updateDistributionStatus,
  assignUserToDistributionItem,
} from '../controllers/distribution.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// List schedules (authenticated)
router.get('/schedules', authenticate, getDistributionSchedules);

// Get a schedule by id (authenticated)
router.get('/schedules/:id', authenticate, getDistributionScheduleById);

// Create a schedule (admins/managers)
router.post(
  '/schedules',
  authenticate,
  authorize(['ADMIN', 'MANAGER']),
  createDistributionSchedule
);

// Update schedule status (admins/managers)
router.patch(
  '/schedules/:id/status',
  authenticate,
  authorize(['ADMIN', 'MANAGER']),
  updateDistributionStatus
);

// Assign a user to a distribution item (admins/managers)
router.post(
  '/items/:itemId/assign',
  authenticate,
  authorize(['ADMIN', 'MANAGER']),
  assignUserToDistributionItem
);

export default router;