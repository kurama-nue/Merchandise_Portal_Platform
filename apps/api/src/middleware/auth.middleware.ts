import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import { hasPermission, hasAnyPermission } from '../lib/permissions';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Authentication middleware that supports both HttpOnly cookies and Bearer tokens
 * 
 * This middleware extracts JWT from either:
 * 1. Authorization header (Bearer token)
 * 2. HttpOnly cookie (access_token)
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;
    
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // If no token in header, check for cookie
    if (!token && req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }
    
    // If no token found in either place, return authentication error
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || 'access_secret'
    ) as { userId: string };

    // Find the user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach a normalized user object to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      departmentId: user.department ? user.department.toString() : undefined,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

// Multiple permissions authorization middleware (any permission)
export const requireAnyPermission = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!hasAnyPermission(req.user.role, permissions)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

/**
 * Helper functions for token management
 */

// Set JWT in HttpOnly cookie
export const setTokenCookie = (res: Response, token: string, name = 'access_token') => {
  // Cookie options for security
  const cookieOptions = {
    httpOnly: true,             // Prevents client-side JS from reading the cookie
    secure: process.env.NODE_ENV === 'production', // Cookie only sent over HTTPS in production
    sameSite: 'strict' as const,  // CSRF protection
    maxAge: name === 'access_token' ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 15 mins for access, 7 days for refresh
    path: '/',                 // Cookie available for entire site
  };
  
  res.cookie(name, token, cookieOptions);
};

// Clear JWT cookie
export const clearTokenCookie = (res: Response, name = 'access_token') => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
};