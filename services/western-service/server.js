// Western Astrology Service Server
// Provides REST API endpoints for Western astrology calculations
// Includes health check endpoint for monitoring

require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('rate-limiter-flexible');

// Import centralized logger (assuming shared logger exists)
let logger;
try {
  const { getLogger } = require('../../backend/logger');
  logger = getLogger(null, 'western-service');
} catch (error) {
  // Fallback logger if backend logger not available
  logger = {
    info: console.log,
    error: console.error,
    debug: console.debug,
    warn: console.warn,
  };
}

// Initialize Express application
const app = express();

// Add correlation ID middleware if available
let correlationIdMiddleware = (req, res, next) => next();
try {
  correlationIdMiddleware =
    require('../../backend/logger').correlationIdMiddleware;
} catch (error) {
  // Use fallback if not available
}
app.use(correlationIdMiddleware);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Compression middleware
app.use(compression());

// Rate limiting
const rateLimiter = new rateLimit.RateLimiterMemory({
  keyPrefix: 'western-service',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
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

// Store service start time for uptime calculation
const serviceStartTime = new Date();

// Health check endpoint
app.get('/health', (req, res) => {
  const uptime = Math.floor((new Date() - serviceStartTime) / 1000); // uptime in seconds
  const memoryUsage = process.memoryUsage();

  req.logger?.info('Health check requested') ||
    logger.info('Health check requested');

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'western-service',
    version: '1.0.0',
    uptime: uptime,
    uptimeFormatted: formatUptime(uptime),
    system: {
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      },
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
    },
    correlationId: req.correlationId,
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  req.logger?.info('API status requested') ||
    logger.info('API status requested');
  res.json({
    message: 'Western Astrology Service is operational',
    version: '1.0.0',
    features: [
      'Western Birth Chart Generation',
      'Aspect Calculations',
      'House Systems',
      'Planetary Positions',
      'Compatibility Analysis',
      'Predictive Astrology',
      'Pet Astrology',
      'Medical Astrology',
    ],
    correlationId: req.correlationId,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  (req.logger?.error || logger.error)('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
    correlationId: req.correlationId,
  });
});

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let formatted = '';
  if (days > 0) formatted += `${days}d `;
  if (hours > 0) formatted += `${hours}h `;
  if (minutes > 0) formatted += `${minutes}m `;
  formatted += `${secs}s`;

  return formatted.trim();
}

// Determine port from environment or default
const PORT = process.env.PORT || 3003;

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Western Astrology Service is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Western Astrology Service terminated');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Western Astrology Service terminated');
  });
});

module.exports = app;
