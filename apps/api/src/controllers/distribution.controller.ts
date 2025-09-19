import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const distributionItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

const distributionScheduleSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  scheduledDate: z.string().transform(val => new Date(val)),
  items: z.array(distributionItemSchema).min(1),
});

// Create distribution schedule
export const createDistributionSchedule = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const validatedData = distributionScheduleSchema.parse(req.body);
    
    // Check if user is admin or manager
    if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized. Only admins and managers can create distribution schedules' });
    }
    
    // Validate products exist and have sufficient stock
    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}` 
        });
      }
    }
    
    // Create distribution schedule with transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create distribution schedule
      const schedule = await prisma.distributionSchedule.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          scheduledDate: validatedData.scheduledDate,
          status: 'PENDING',
          items: {
            create: validatedData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              notes: item.notes,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      
      return schedule;
    });
    
    res.status(201).json({
      message: 'Distribution schedule created successfully',
      schedule: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all distribution schedules
export const getDistributionSchedules = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    // Build filter
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    const schedules = await prisma.distributionSchedule.findMany({
      where: filter,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    });
    
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get distribution schedule by ID
export const getDistributionScheduleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const schedule = await prisma.distributionSchedule.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    if (!schedule) {
      return res.status(404).json({ message: 'Distribution schedule not found' });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update distribution schedule status
export const updateDistributionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!status || !['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be PENDING, IN_PROGRESS, COMPLETED, or CANCELLED' 
      });
    }
    
    // Check if user is admin or manager
    if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Unauthorized. Only admins and managers can update distribution status' 
      });
    }
    
    // Update schedule status
    const schedule = await prisma.distributionSchedule.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });
    
    // If status is COMPLETED, update product stock
    if (status === 'COMPLETED') {
      await Promise.all(
        schedule.items.map(async (item) => {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        })
      );
    }
    
    res.json({
      message: 'Distribution schedule status updated successfully',
      schedule,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign user to distribution item
export const assignUserToDistributionItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.body;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if distribution item exists
    const item = await prisma.distributionItem.findUnique({
      where: { id: itemId },
      include: {
        distributionSchedule: true,
      },
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Distribution item not found' });
    }
    
    // Check if schedule is in progress
    if (item.distributionSchedule.status !== 'IN_PROGRESS') {
      return res.status(400).json({ 
        message: 'Distribution must be in progress to assign users' 
      });
    }
    
    // Update distribution item with assigned user
    const updatedItem = await prisma.distributionItem.update({
      where: { id: itemId },
      data: {
        notes: `Assigned to ${user.firstName} ${user.lastName} (${user.email})`,
      },
    });
    
    res.json({
      message: 'User assigned to distribution item successfully',
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};