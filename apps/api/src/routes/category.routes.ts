import { Router } from 'express';

const router = Router();

const categories = [
  { slug: 'clothing', name: 'Clothing & Apparel' },
  { slug: 'electronics', name: 'Electronics & Tech' },
  { slug: 'home-lifestyle', name: 'Home & Lifestyle' },
  { slug: 'accessories', name: 'Accessories' },
];

router.get('/', (_req, res) => {
  res.json(categories);
});

router.get('/:slug', (req, res) => {
  const cat = categories.find((c) => c.slug === req.params.slug);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json(cat);
});

export default router;
