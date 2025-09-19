import { Request, Response } from 'express';
import { z } from 'zod';
import User, { UserRole } from '../models/User';

// Validation schema for role update
const updateRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

/**
 * Get all available roles
 */
export const getRoles = async (_req: Request, res: Response) => {
  try {
    const roles = Object.values(UserRole);
    res.status(200).json({ roles });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * Update a user's role (admin only)
 */
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = updateRoleSchema.parse(req.body);
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update the role
    user.role = role;
    await user.save();
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};