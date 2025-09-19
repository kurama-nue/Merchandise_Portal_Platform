const request = require('supertest');
const express = require('express');
import productRoutes from '../routes/product.routes';
import { authenticate, authorize } from '../middleware/auth.middleware';

// Mock middleware
jest.mock('../middleware/auth.middleware', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = {
      id: 'test-user-id',
      role: 'ADMIN',
    };
    next();
  }),
  authorize: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => next()),
}));

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('Product API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all products', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ];

    const prisma = new (require('@prisma/client').PrismaClient)();
    prisma.product.findMany.mockResolvedValue(mockProducts);

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(mockProducts));
    expect(prisma.product.findMany).toHaveBeenCalled();
  });

  it('should get a product by ID', async () => {
    const mockProduct = {
      id: '1',
      name: 'Product 1',
      price: 100,
      reviews: [],
      department: { name: 'Test Department' },
    };

    const prisma = new (require('@prisma/client').PrismaClient)();
    prisma.product.findUnique.mockResolvedValue(mockProduct);

    const response = await request(app).get('/api/products/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      id: '1',
      name: 'Product 1',
      averageRating: 0,
      reviewCount: 0,
    }));
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: expect.any(Object),
    });
  });

  // Add more tests for create, update, delete
});