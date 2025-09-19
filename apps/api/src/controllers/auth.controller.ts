import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { hashPassword, comparePassword } from '../middleware/bcrypt.middleware';

// Removed Prisma; using Mongoose models instead
import User, { UserRole } from '../models/User';
import Department from '../models/Department';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Generate tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET || 'access_secret',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password with 12 rounds of salt (configured in bcrypt middleware)
    const hashedPassword = await hashPassword(validatedData.password);

    // Optionally validate department exists if provided
    // if (validatedData.departmentId) {
    //   const deptExists = await Department.exists({ _id: validatedData.departmentId });
    //   if (!deptExists) {
    //     return res.status(400).json({ message: 'Invalid departmentId' });
    //   }
    // }

    // Check if role is being set and if the requester has permission
    let role = UserRole.CUSTOMER; // Default role
    
    if (validatedData.role) {
      // Only admins can set roles other than CUSTOMER
      if (req.user && req.user.role === UserRole.ADMIN) {
        role = validatedData.role;
      } else if (validatedData.role === UserRole.DEPT_HEAD && req.user && req.user.role === UserRole.MANAGER) {
        // Managers can create department heads
        role = UserRole.DEPT_HEAD;
      } else {
        // If not admin or manager trying to create dept head, ignore the role request
        // We don't return an error to avoid revealing role information
      }
    }
    
    // Create user
    const user = await User.create({
      email: validatedData.email,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      role,
      phone: validatedData.phone,
      department: validatedData.departmentId, // will be cast to ObjectId if provided
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login attempt:', req.body);
    const validatedData = z.object({
      email: z.string().email(),
      password: z.string(),
    }).parse(req.body);

    // Find user
    console.log('Looking for user with email:', validatedData.email);
    const user = await User.findOne({ email: validatedData.email.toLowerCase() });
    
    if (!user) {
      console.log('User not found:', validatedData.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User found:', user.email, 'with role:', user.role);

    // Verify password using secure comparison
    const isPasswordValid = await comparePassword(validatedData.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'refresh_secret'
    ) as { userId: string };

    // Generate new tokens
    const tokens = generateTokens(decoded.userId);

    res.json({
      message: 'Token refreshed successfully',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Logout
export const logout = (req: Request, res: Response) => {
  // In a real implementation, you might want to invalidate the refresh token
  // by storing it in a blacklist or database
  res.json({ message: 'Logged out successfully' });
};

// Get current user information
export const getMe = (req: Request, res: Response) => {
  const user = req.user;
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      departmentId: user.departmentId,
    }
  });
};