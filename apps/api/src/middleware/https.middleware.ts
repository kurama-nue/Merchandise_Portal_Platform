import { Request, Response, NextFunction } from 'express';

/**
 * HTTPS-only middleware for production environments
 * 
 * This middleware ensures that all requests in production use HTTPS
 * by redirecting HTTP requests to their HTTPS equivalent.
 */
export const httpsOnly = (req: Request, res: Response, next: NextFunction) => {
  // Skip in development environment
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Check if request is already secure or is using the HTTP protocol
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';

  if (!isSecure) {
    // Redirect to HTTPS
    const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
    return res.redirect(301, httpsUrl);
  }

  next();
};