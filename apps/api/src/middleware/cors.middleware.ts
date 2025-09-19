import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

/**
 * CORS middleware with allowlist configuration
 * 
 * This middleware restricts which domains can access the API
 * by implementing a whitelist approach for Cross-Origin Resource Sharing.
 */
export const corsMiddleware = () => {
  // Define allowed origins
  const allowlist = [
    'http://localhost:3000',  // Local development frontend
    'http://localhost:5173',  // Vite default port
    'https://merchandise-portal.example.com', // Production frontend (replace with actual domain)
  ];

  // CORS options with origin validation
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl requests, etc)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in allowlist
      if (allowlist.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['X-CSRF-Token'],
    maxAge: 86400, // Cache preflight requests for 24 hours
  };

  return cors(corsOptions);
};