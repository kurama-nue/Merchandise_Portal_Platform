// Import all models to ensure they are registered with Mongoose
import './Department';
import './Product';
import './Review';
import './FAQ';

// Export models for convenience
export { default as Department } from './Department';
export { default as Product } from './Product';
export { default as Review } from './Review';
export { default as FAQ } from './FAQ';