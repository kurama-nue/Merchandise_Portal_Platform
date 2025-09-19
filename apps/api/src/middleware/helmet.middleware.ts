import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

/**
 * Configures Helmet middleware with security headers
 * 
 * Helmet helps secure Express apps by setting HTTP response headers:
 * - Content-Security-Policy: Prevents XSS attacks
 * - X-DNS-Prefetch-Control: Controls DNS prefetching
 * - Expect-CT: Certificate Transparency
 * - X-Frame-Options: Prevents clickjacking
 * - X-Powered-By: Removes X-Powered-By header
 * - HSTS: HTTP Strict Transport Security
 * - X-Download-Options: Prevents IE from executing downloads
 * - X-Content-Type-Options: Prevents MIME-sniffing
 * - Referrer-Policy: Controls the Referer header
 * - X-XSS-Protection: Provides XSS protection in older browsers
 * - Cross-Origin-*: Controls cross-origin policies
 */
export const helmetMiddleware = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Set to true in production if possible
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    dnsPrefetchControl: { allow: false },
    expectCt: { enforce: true, maxAge: 30 },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: {
      maxAge: 15552000, // 180 days in seconds
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true,
  });
};