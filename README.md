# 🛒 Merchandise Portal Platform

A comprehensive e-commerce platform built with modern web technologies for managing merchandise, orders, and user authentication.

## 🌟 Features

### 🔐 Authentication System
- User registration and login with toast notifications
- Role-based access control (Admin, Manager, Department Head, Customer)
- JWT token-based authentication
- Password hashing with bcrypt

### 🛍️ E-commerce Functionality
- Product catalog with categories
- Shopping cart with persistence
- Order management
- Payment integration (Razorpay)
- Product reviews and ratings

### 👥 User Management
- Multi-role user system
- Department-based organization
- Group orders for departments
- User permissions and access control

### 📱 Modern UI/UX
- Responsive design with Tailwind CSS
- Interactive 3D product showcase
- Toast notifications with Sonner
- Smooth animations with Framer Motion
- Dark/Light theme support

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kurama-nue/Merchandise_Portal_Platform.git
   cd Merchandise_Portal_Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   **Backend (.env in apps/api/)**
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/merch_portal
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   PORT=3001
   NODE_ENV=development
   ```

   **Frontend (.env in apps/web/)**
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Start the development servers**

   **Backend API:**
   ```bash
   cd apps/api
   npm run dev
   ```

   **Frontend Web:**
   ```bash
   cd apps/web
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:5174
   - API: http://localhost:3001

## 🔑 Default Login Credentials

For testing purposes, you can use these credentials:

- **Admin:** admin@demo.com / Admin@123
- **Regular User:** user@demo.com / User@123  
- **Department Head:** dept@demo.com / Dept@123

## 🛠️ Technology Stack

### Backend
- **Framework:** Express.js with TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens with bcrypt
- **API Documentation:** Swagger/OpenAPI
- **Testing:** Jest
- **Security:** Helmet, CORS, Rate limiting

### Frontend  
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Animations:** Framer Motion
- **3D Graphics:** Three.js with React Three Fiber
- **State Management:** React Context + Custom hooks
- **Notifications:** Sonner
- **Build Tool:** Vite

## Project Structure

This project uses a monorepo structure with npm workspaces:

```
├── apps/
│   ├── api/         # Backend Express API
│   └── web/         # Frontend React application
├── packages/
│   ├── eslint-config/  # Shared ESLint configuration
│   └── tsconfig/      # Shared TypeScript configuration
├── docker-compose.yml
└── package.json
```

## Development Setup

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Docker and Docker Compose

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/merchandise-portal-platform.git
   cd merchandise-portal-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment with Docker:
   ```bash
   docker-compose up -d
   ```

4. Access the applications:
   - API: http://localhost:3001
   - Web: http://localhost:3000
   - Prisma Studio: http://localhost:5555 (after running `npm run prisma:studio` in the api directory)

## Deployment Guide

### Prerequisites

- Docker and Docker Compose installed on the server
- Domain name (for production deployment)
- SSL certificate (for production deployment)

### Local Deployment with Docker

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/your-username/merchandise-portal-platform.git
   cd merchandise-portal-platform
   ```

2. Create necessary environment files:
   - Create `.env` file in the `apps/api` directory (see [Environment Variables](#environment-variables))
   - Create `.env.local` file in the `apps/web` directory

3. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Run database migrations:
   ```bash
   docker-compose exec api npm run prisma:migrate
   ```

5. Seed the database (optional):
   ```bash
   docker-compose exec api npm run prisma:seed
   ```

### Production Deployment

#### Option 1: Docker Compose on a VPS

1. Clone the repository on your server:
   ```bash
   git clone https://github.com/your-username/merchandise-portal-platform.git
   cd merchandise-portal-platform
   ```

2. Create production environment files with secure credentials

3. Build and start the containers:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

4. Set up a reverse proxy (like Nginx) to handle SSL termination and domain routing

#### Option 2: Kubernetes Deployment

1. Build and push Docker images to a container registry:
   ```bash
   docker build -t your-registry/merch-portal-api:latest -f apps/api/Dockerfile .
   docker build -t your-registry/merch-portal-web:latest -f apps/web/Dockerfile .
   
   docker push your-registry/merch-portal-api:latest
   docker push your-registry/merch-portal-web:latest
   ```

2. Apply Kubernetes manifests (not included in this repository):
   ```bash
   kubectl apply -f k8s/
   ```

#### Option 3: Cloud Platform Deployment

The application can be deployed to cloud platforms like AWS, Azure, or Google Cloud using their container services:

- AWS: ECS or EKS
- Azure: AKS or Container Apps
- Google Cloud: GKE

Follow the specific documentation for your chosen cloud provider for detailed deployment steps.

## Environment Variables

### API (.env)

```
# Database
DATABASE_URL="postgresql://postgres:password@postgres:5432/merch_portal?schema=public"
MONGODB_URI=mongodb://mongodb:27017/merch_portal

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Server
PORT=3001
NODE_ENV=production
```

### Web (.env.local)

```
VITE_API_URL=http://api-domain.com/api
```

## API Documentation

API documentation is available at `/api/docs` when the API server is running.

## Data Enrichment: Focused Crawler (Optional)

This repo includes a lightweight crawler under `apps/crawler` to discover and extract public product metadata (titles, prices, image URLs) from external sites for research/inspiration. It obeys robots.txt and does not copy proprietary content or assets.

Workflow:

1. Generate products JSON
    - PowerShell:
       - `cd apps/crawler`
       - `npm install`
       - `npm run extract` (outputs `products.json` in `apps/crawler`)

2. Import a subset into MongoDB (as demo data)
    - Ensure `apps/api/.env` has `MONGODB_URI`
    - PowerShell:
       - `cd ../api`
       - `npm run import:external -- ../crawler/products.json`

Notes:
- Imported items go into the `Accessories` department (created if missing).
- Only minimal fields are imported (name, price, images, description_short).
- This is optional and meant to enrich local development data only.

### Postgres upsert (optional)
- Create `apps/crawler/.env` with `DATABASE_URL` pointing to a Postgres instance, e.g.:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/merch_portal?schema=public
```
- Then run:
```
cd apps/crawler
npm run build
node dist/cli.js --start-url "https://www.thesouledstore.com/sitemap.xml" --rate 1 --limit 50 --output products.json --upsert
```

### Troubleshooting
- `Error: DATABASE_URL is not set` when using `--upsert`: create `apps/crawler/.env` with `DATABASE_URL` or export it in your shell.
- Empty results: increase `--limit`, or inspect `apps/crawler/products.urls.json` and `snapshots.txt` for hints.
- Respect licensing: images are kept as `source_image_url` only; replace them with your own assets before production.