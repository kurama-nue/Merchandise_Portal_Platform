# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY packages ./packages
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/api ./apps/api

# Generate Prisma client
RUN cd apps/api && npm run prisma:generate

# Build the application
RUN cd apps/api && npm run build

# Stage 2: Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy package files
COPY --from=builder /app/apps/api/package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy built application
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma

# Generate Prisma client in production
RUN npm run prisma:generate

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "start"]