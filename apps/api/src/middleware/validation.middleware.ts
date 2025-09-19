import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Zod validation middleware
 * 
 * This middleware validates request data (body, query, params) against Zod schemas
 * to ensure data integrity and security before processing requests.
 */

/**
 * Create a validation middleware for a specific schema
 * 
 * @param schema - The Zod schema to validate against
 * @param source - The request property to validate (body, query, params)
 * @returns Express middleware function
 */
export const validate = (
  schema: AnyZodObject,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request data against the schema
      const data = await schema.parseAsync(req[source]);
      
      // Replace the request data with the validated data
      req[source] = data;
      
      next();
    } catch (error) {
      // If validation fails, return a 400 Bad Request with detailed errors
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      // For other errors, pass to the next error handler
      next(error);
    }
  };
};

/**
 * Validate multiple sources in a single middleware
 * 
 * @param schemas - Object containing schemas for different request properties
 * @returns Express middleware function
 */
export const validateAll = (schemas: {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate each provided schema against its corresponding request property
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      
      next();
    } catch (error) {
      // If validation fails, return a 400 Bad Request with detailed errors
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      // For other errors, pass to the next error handler
      next(error);
    }
  };
};