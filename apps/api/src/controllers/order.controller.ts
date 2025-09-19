import { Request, Response } from 'express';
import { z } from 'zod';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import IndividualOrder from '../models/IndividualOrder';
import GroupOrder from '../models/GroupOrder';
import GroupOrderMember from '../models/GroupOrderMember';
import Product from '../models/Product';
import mongoose from 'mongoose';

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

const groupOrderSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  deadline: z.string().transform(val => new Date(val)),
  departmentId: z.string(),
  items: z.array(orderItemSchema).min(1),
});

// Helper to generate order number
const generateOrderNumber = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

// Create individual order
export const createIndividualOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const validatedData = orderSchema.parse(req.body);
    
    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItemsData = [];
    
    for (const item of validatedData.items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}` 
        });
      }
      
      const unitPrice = product.discountPrice || product.price;
      const itemTotal = unitPrice * item.quantity;
      
      totalAmount += itemTotal;
      
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice
      });
    }
    
    // Create main order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      user: userId,
      status: 'PENDING',
      totalAmount,
      shippingAddress: validatedData.shippingAddress,
      notes: validatedData.notes
    });
    
    await order.save({ session });
    
    // Create order items
    const orderItems = [];
    for (const itemData of orderItemsData) {
      const orderItem = new OrderItem({
        order: order._id,
        product: itemData.productId,
        quantity: itemData.quantity,
        unitPrice: itemData.unitPrice
      });
      await orderItem.save({ session });
      orderItems.push(orderItem);
    }
    
    // Create individual order
    const individualOrder = new IndividualOrder({
      order: order._id,
      user: userId
    });
    
    await individualOrder.save({ session });
    
    // Update product stock
    for (const item of validatedData.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      message: 'Order created successfully',
      order: order.toJSON(),
      individualOrder: individualOrder.toJSON(),
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create group order
export const createGroupOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const creatorId = req.user.id;
    const validatedData = groupOrderSchema.parse(req.body);
    
    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItemsData = [];
    
    for (const item of validatedData.items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      const unitPrice = product.discountPrice || product.price;
      const itemTotal = unitPrice * item.quantity;
      
      totalAmount += itemTotal;
      
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice
      });
    }
    
    // Create main order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      user: creatorId,
      status: 'PENDING',
      totalAmount
    });
    
    await order.save({ session });
    
    // Create order items
    for (const itemData of orderItemsData) {
      const orderItem = new OrderItem({
        order: order._id,
        product: itemData.productId,
        quantity: itemData.quantity,
        unitPrice: itemData.unitPrice
      });
      await orderItem.save({ session });
    }
    
    // Create group order
    const groupOrder = new GroupOrder({
      order: order._id,
      creator: creatorId,
      name: validatedData.name,
      description: validatedData.description,
      deadline: validatedData.deadline,
      status: 'OPEN'
    });
    
    await groupOrder.save({ session });
    
    // Add creator as first member
    const groupOrderMember = new GroupOrderMember({
      groupOrder: groupOrder._id,
      user: creatorId,
      joinedAt: new Date()
    });
    
    await groupOrderMember.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      message: 'Group order created successfully',
      order: order.toJSON(),
      groupOrder: groupOrder.toJSON(),
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join group order
export const joinGroupOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { groupOrderId } = req.params;
    
    // Check if group order exists and is open
    const groupOrder = await GroupOrder.findById(groupOrderId);
    
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    if (groupOrder.status !== 'OPEN') {
      return res.status(400).json({ message: 'Group order is not open for joining' });
    }
    
    // Check if user is already a member
    const existingMember = await GroupOrderMember.findOne({
      groupOrder: groupOrderId,
      user: userId
    });
    
    if (existingMember) {
      return res.status(400).json({ message: 'You are already a member of this group order' });
    }
    
    // Add user to group order
    const member = new GroupOrderMember({
      groupOrder: groupOrderId,
      user: userId,
      joinedAt: new Date()
    });
    
    await member.save();
    
    res.status(201).json({
      message: 'Joined group order successfully',
      member: member.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Finalize group order
export const finalizeGroupOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { groupOrderId } = req.params;
    
    // Check if group order exists and is open
    const groupOrder = await GroupOrder.findById(groupOrderId).populate('order');
    
    if (!groupOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    if (groupOrder.status !== 'OPEN') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Group order is already finalized or cancelled' });
    }
    
    // Check if user is the creator
    if (groupOrder.creator.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Only the creator can finalize the group order' });
    }
    
    // Update group order status
    groupOrder.status = 'CLOSED';
    await groupOrder.save({ session });
    
    // Update main order status
    await Order.findByIdAndUpdate(
      groupOrder.order._id,
      { status: 'PROCESSING' },
      { session }
    );
    
    // Update product stock
    const orderItems = await OrderItem.find({ order: groupOrder.order._id });
    
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({
      message: 'Group order finalized successfully',
      groupOrder: groupOrder.toJSON(),
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel group order
export const cancelGroupOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { groupOrderId } = req.params;
    
    // Check if group order exists and is open
    const groupOrder = await GroupOrder.findById(groupOrderId).populate('order');
    
    if (!groupOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    if (groupOrder.status !== 'OPEN') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Group order is already finalized or cancelled' });
    }
    
    // Check if user is the creator
    if (groupOrder.creator.toString() !== userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Only the creator can cancel the group order' });
    }
    
    // Update group order status
    groupOrder.status = 'CANCELLED';
    await groupOrder.save({ session });
    
    // Update main order status
    await Order.findByIdAndUpdate(
      groupOrder.order._id,
      { status: 'CANCELLED' },
      { session }
    );
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({
      message: 'Group order cancelled successfully',
      groupOrder: groupOrder.toJSON(),
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Invite participant to group order
export const inviteParticipant = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { groupOrderId } = req.params;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if group order exists and is open
    const groupOrder = await GroupOrder.findById(groupOrderId);
    
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    if (groupOrder.status !== 'OPEN') {
      return res.status(400).json({ message: 'Group order is not open for invitations' });
    }
    
    // Check if user is the creator
    if (groupOrder.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Only the creator can invite participants' });
    }
    
    // Find user by email
    const User = mongoose.model('User');
    const invitedUser = await User.findOne({ email });
    
    if (!invitedUser) {
      return res.status(404).json({ message: 'User with this email not found' });
    }
    
    // Check if user is already a member
    const existingMember = await GroupOrderMember.findOne({
      groupOrder: groupOrderId,
      user: invitedUser._id
    });
    
    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this group order' });
    }
    
    // Add user to group order as invited
    const member = new GroupOrderMember({
      groupOrder: groupOrderId,
      user: invitedUser._id,
      status: 'INVITED',
      joinedAt: new Date()
    });
    
    await member.save();
    
    res.status(201).json({
      message: 'Invitation sent successfully',
      member: {
        id: member._id,
        userId: invitedUser._id,
        userName: `${invitedUser.firstName} ${invitedUser.lastName}`,
        status: member.status,
        joinedAt: member.joinedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get individual orders
    const individualOrders = await IndividualOrder.find({ user: userId })
      .populate({
        path: 'order',
        populate: [
          {
            path: 'orderItems',
            populate: {
              path: 'product'
            }
          },
          {
            path: 'payments'
          }
        ]
      });
    
    // Get group orders where user is a member
    const groupOrderMembers = await GroupOrderMember.find({ user: userId })
      .populate({
        path: 'groupOrder',
        populate: [
          {
            path: 'order',
            populate: [
              {
                path: 'orderItems',
                populate: {
                  path: 'product'
                }
              },
              {
                path: 'payments'
              }
            ]
          },
          {
            path: 'members',
            populate: {
              path: 'user',
              select: 'id firstName lastName'
            }
          }
        ]
      });
    
    const groupOrders = groupOrderMembers.map(member => member.groupOrder);
    
    res.json({
      individualOrders,
      groupOrders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};