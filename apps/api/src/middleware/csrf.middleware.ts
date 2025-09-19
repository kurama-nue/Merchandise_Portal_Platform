import { Request, Response, NextFunction } from 'express';
import Tokens from 'csrf';

/**
 * CSRF Protection Middleware
 * 
 * This middleware provides Cross-Site Request Forgery protection for cookie-based authentication.
 * It generates and validates CSRF tokens to ensure that requests come from the legitimate source.
 */

// Create a new CSRF token generator
const tokens = new Tokens();

// Generate a new CSRF token and set it in the response
export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  // Only generate tokens for authenticated users
  if (!req.user) {
    return next();
  }
  
  // Generate a new secret if one doesn't exist in the session
  if (!req.session) {
    req.session = {};
  }
  
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = tokens.secretSync();
  }
  
  // Create a token from the secret
  const token = tokens.create(req.session.csrfSecret);
  
  // Set the token in the response headers
  res.setHeader('X-CSRF-Token', token);
  
  // Also make it available in the response locals for templates
  res.locals.csrfToken = token;
  
  next();
};

// Validate CSRF token in requests that modify state
export const validateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  // Skip validation for non-state-changing methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Skip CSRF validation if not using cookie authentication
  // This assumes that cookie-based auth sets a flag or can be detected
  const usingCookieAuth = req.cookies && req.cookies.access_token;
  if (!usingCookieAuth) {
    return next();
  }
  
  // Get the token from either the request body, query, or headers
  const token = req.body._csrf || req.query._csrf || req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
  
  // If no token or no secret, reject the request
  if (!token || !req.session || !req.session.csrfSecret) {
    return res.status(403).json({ message: 'CSRF token validation failed' });
  }
  
  // Verify the token against the secret
  if (!tokens.verify(req.session.csrfSecret, token as string)) {
    return res.status(403).json({ message: 'CSRF token validation failed' });
  }
  
  next();
};

// Middleware to apply both generation and validation
export const csrfProtection = [
  generateCsrfToken,
  validateCsrfToken
];