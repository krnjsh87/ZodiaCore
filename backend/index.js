// Main entry point for ZodiaCore astrology web application
// This file serves as the primary server for Render deployment
// It combines backend API functionality with frontend static file serving

require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('rate-limiter-flexible');
const winston = require('winston');
const path = require('path');

// Initialize Express application
const app = express();

// Configure Winston logger for centralized logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'zodiacore-main' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration for cross-origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Compression middleware for response optimization
app.use(compression());

// Rate limiting to prevent abuse
const rateLimiter = new rateLimit.RateLimiterMemory({
  keyPrefix: 'middleware',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

app.use((req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'zodiacore-main'
  });
});

// API routes placeholder - to be expanded with actual backend logic
app.get('/api/status', (req, res) => {
  res.json({
    message: 'ZodiaCore API is operational',
    version: '1.0.0',
    services: ['chinese', 'western', 'vedic', 'mundane']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Serve static files from frontend build directory
const frontendPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(frontendPath));

// Catch-all handler: send back index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Determine port from environment or default
const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`ZodiaCore server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Frontend served from: ${frontendPath}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = app; // Export for testing purposes