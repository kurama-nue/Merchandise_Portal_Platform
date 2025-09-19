import { Request, Response } from 'express';

type CartItem = {
  productId: string;
  quantity: number;
};

function getCart(req: Request): CartItem[] {
  const anyReq = req as any;
  if (!anyReq.session) return [];
  if (!anyReq.session.cart) anyReq.session.cart = [] as CartItem[];
  return anyReq.session.cart as CartItem[];
}

export const getCartItems = (req: Request, res: Response) => {
  const cart = getCart(req);
  res.json({ items: cart });
};

export const addToCart = (req: Request, res: Response) => {
  const { productId, quantity } = req.body || {};
  if (!productId || !Number.isFinite(Number(quantity))) {
    return res.status(400).json({ message: 'productId and quantity are required' });
  }
  const qty = Math.max(1, Number(quantity));
  const cart = getCart(req);
  const existing = cart.find((i) => i.productId === productId);
  if (existing) existing.quantity += qty; else cart.push({ productId, quantity: qty });
  res.status(201).json({ items: cart });
};

export const updateCartItem = (req: Request, res: Response) => {
  const { productId } = req.params;
  const { quantity } = req.body || {};
  if (!Number.isFinite(Number(quantity))) {
    return res.status(400).json({ message: 'quantity is required' });
  }
  const qty = Math.max(0, Number(quantity));
  const cart = getCart(req);
  const idx = cart.findIndex((i) => i.productId === productId);
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });
  if (qty === 0) cart.splice(idx, 1); else cart[idx].quantity = qty;
  res.json({ items: cart });
};

export const removeCartItem = (req: Request, res: Response) => {
  const { productId } = req.params;
  const cart = getCart(req);
  const idx = cart.findIndex((i) => i.productId === productId);
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });
  cart.splice(idx, 1);
  res.json({ items: cart });
};
