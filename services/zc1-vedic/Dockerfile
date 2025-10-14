# Multi-stage Dockerfile for ZodiaCore ZC1 Vedic Astrology Service
# Uses Node.js 18 Alpine for smaller image size and security

# Build stage
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S zc1-vedic -u 1001

# Set working directory
WORKDIR /app

# Copy built dependencies from builder stage
COPY --from=builder --chown=zc1-vedic:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=zc1-vedic:nodejs . .

# Create logs directory with proper permissions
RUN mkdir -p logs && chown -R zc1-vedic:nodejs logs

# Switch to non-root user
USER zc1-vedic

# Expose port
EXPOSE 3006

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3006/health || exit 1

# Start the application
CMD ["node", "server.js"]