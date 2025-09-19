import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Only admins and managers can access dashboard stats
    if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized. Only admins and managers can access dashboard statistics' });
    }
    
    // Get total users count
    const totalUsers = await prisma.user.count();
    
    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
    });
    
    // Get total products count
    const totalProducts = await prisma.product.count();
    
    // Get products with low stock (less than 10)
    const lowStockProducts = await prisma.product.count({
      where: {
        stock: {
          lt: 10,
        },
      },
    });
    
    // Get total orders count
    const totalOrders = await prisma.order.count();
    
    // Get orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });
    
    // Get total revenue
    const totalRevenue = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });
    
    // Get revenue for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRevenue = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _sum: {
        amount: true,
      },
    });
    
    // Get recent orders (last 10)
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payments: {
          where: {
            status: 'COMPLETED',
          },
        },
      },
    });
    
    // Get top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });
    
    // Get product details for top products
    const topProductDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            images: true,
          },
        });
        
        return {
          ...product,
          totalSold: item._sum.quantity,
        };
      })
    );
    
    res.json({
      users: {
        total: totalUsers,
        byRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.id,
        })),
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
      },
      orders: {
        total: totalOrders,
        byStatus: ordersByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
        recent: recentOrders,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        recent: recentRevenue._sum.amount || 0,
      },
      topProducts: topProductDetails,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sales report
export const getSalesReport = async (req: Request, res: Response) => {
  try {
    // Only admins and managers can access sales reports
    if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized. Only admins and managers can access sales reports' });
    }
    
    const { startDate, endDate } = req.query;
    
    let start = new Date();
    start.setMonth(start.getMonth() - 1); // Default to last month
    
    let end = new Date();
    
    if (startDate) {
      start = new Date(startDate as string);
    }
    
    if (endDate) {
      end = new Date(endDate as string);
    }
    
    // Get completed payments in date range
    const payments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        order: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Calculate total revenue
    const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    
    // Group sales by product
    const productSales = {};
    
    payments.forEach(payment => {
      payment.order.orderItems.forEach(item => {
        const productId = item.productId;
        
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            name: item.product.name,
            quantity: 0,
            revenue: 0,
          };
        }
        
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += Number(item.totalPrice);
      });
    });
    
    res.json({
      startDate: start,
      endDate: end,
      totalRevenue,
      totalOrders: payments.length,
      payments,
      productSales: Object.values(productSales),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};