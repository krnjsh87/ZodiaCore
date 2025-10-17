# Multi-stage Dockerfile for ZodiaCore Western Astrology Service (Legacy/Extended)
# Standardized with security enhancements, observability features, and build metadata
# Uses Node.js 18 Alpine for smaller image size and security

# Build arguments for versioning and metadata
ARG NODE_VERSION=18
ARG BUILD_DATE
ARG VCS_REF

# Build stage
FROM node:${NODE_VERSION}-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:${NODE_VERSION}-alpine AS production

# Docker labels for metadata and security scanning
LABEL maintainer="ZodiaCore Team <team@zodiacore.com>"
LABEL version="1.0.0"
LABEL description="ZodiaCore Western Astrology Service (Legacy) - Extended Western astrology calculations and interpretations"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.revision="${VCS_REF}"
LABEL org.opencontainers.image.version="${NODE_VERSION}"
LABEL org.opencontainers.image.vendor="ZodiaCore"
LABEL org.opencontainers.image.title="ZodiaCore Western Service (Legacy)"
LABEL org.opencontainers.image.description="Legacy microservice for extended Western astrology services including advanced aspects and pet astrology"
LABEL org.opencontainers.image.source="https://github.com/zodiacore/western-service"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.security.scan.status="scanned"
LABEL metrics.port="3002"
LABEL metrics.path="/metrics"
LABEL health.check.path="/health"

# Install security and monitoring tools
RUN apk add --no-cache curl dumb-init

# Create non-root user with standardized naming
RUN addgroup -g 1001 -S zodiacore && \
    adduser -S zodiacore -u 1001 -G zodiacore

# Set working directory
WORKDIR /app

# Resource management environment variables
ENV NODE_OPTIONS="--max-old-space-size=256 --max-new-space-size=128"

# Environment variables for configurable settings
ENV PORT=3002
ENV LOG_FORMAT="json"
ENV METRICS_ENABLED="true"

# Copy built dependencies from builder stage
COPY --from=builder --chown=zodiacore:zodiacore /app/node_modules ./node_modules

# Copy application code
COPY --chown=zodiacore:zodiacore . .

# Create necessary directories with proper permissions
RUN mkdir -p logs tmp && \
    chown -R zodiacore:zodiacore logs tmp && \
    chmod 755 logs tmp

# Switch to non-root user
USER zodiacore

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the application with dumb-init for proper signal handling
CMD ["dumb-init", "--", "node", "server.js"]