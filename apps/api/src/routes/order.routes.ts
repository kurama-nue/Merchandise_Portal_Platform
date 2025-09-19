import { Router } from 'express';
import { 
  createIndividualOrder, 
  createGroupOrder, 
  joinGroupOrder, 
  finalizeGroupOrder, 
  cancelGroupOrder,
  inviteParticipant,
  getUserOrders 
} from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected routes
router.get('/user', authenticate, getUserOrders);
router.post('/individual', authenticate, createIndividualOrder);
router.post('/group', authenticate, createGroupOrder);
router.post('/group/:groupOrderId/join', authenticate, joinGroupOrder);
router.post('/group/:groupOrderId/finalize', authenticate, finalizeGroupOrder);
router.post('/group/:groupOrderId/cancel', authenticate, cancelGroupOrder);
router.post('/group/:groupOrderId/invite', authenticate, inviteParticipant);

export default router;