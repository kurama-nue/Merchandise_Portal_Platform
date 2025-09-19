import { Router } from 'express';
import { addToCart, getCartItems, removeCartItem, updateCartItem } from '../controllers/cart.controller';

const router = Router();

router.get('/', getCartItems);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeCartItem);

export default router;
