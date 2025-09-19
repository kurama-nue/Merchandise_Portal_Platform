import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import session from 'express-session';

// Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import reviewRoutes from './routes/review.routes';
import paymentRoutes from './routes/payment.routes';
import distributionRoutes from './routes/distribution.routes';
import faqRoutes from './routes/faq.routes';
import statsRoutes from './routes/stats.routes';
import roleRoutes from './routes/role.routes';
import cartRoutes from './routes/cart.routes';
import categoryRoutes from './routes/category.routes';

// Middleware
import { helmetMiddleware } from './middleware/helmet.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { apiLimiter, authLimiter } from './middleware/rate-limit.middleware';
import { generateCsrfToken, validateCsrfToken } from './middleware/csrf.middleware';
import { httpsOnly } from './middleware/https.middleware';

// Other imports
import { swaggerSpec } from './swagger';
import { connectMongo } from './lib/mongo';
// Import all models to ensure they are registered
import './models';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Security middleware
app.use(httpsOnly); // Ensure HTTPS in production
app.use(helmetMiddleware()); // Security headers
app.use(corsMiddleware()); // CORS with allowlist
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Session configuration for CSRF protection
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure in production
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Apply rate limiting
app.use(apiLimiter); // General rate limiting

// API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Generate CSRF token for all routes
app.use(generateCsrfToken);

// Routes with specific middleware
app.use('/api/auth', authLimiter, authRoutes); // Stricter rate limiting for auth routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', validateCsrfToken, orderRoutes); // CSRF protection for orders
app.use('/api/reviews', validateCsrfToken, reviewRoutes); // CSRF protection for reviews
app.use('/api/payments', validateCsrfToken, paymentRoutes); // CSRF protection for payments
app.use('/api/distribution', validateCsrfToken, distributionRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/roles', validateCsrfToken, roleRoutes); // CSRF protection for role management

async function bootstrap() {
  try {
    await connectMongo(process.env.MONGODB_URI as string);

    app.get('/', (req, res) => {
      res.json({ message: 'Merchandise Portal API is running!' });
    });

    app.listen(port, () => {
      console.warn(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();