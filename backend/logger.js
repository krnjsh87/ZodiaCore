// Centralized logging module with correlation ID support
// Provides structured JSON logging and configurable log levels for all microservices

const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

// Log levels configuration
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Log colors for console output
const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Custom log format with correlation ID
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(
    ({ timestamp, level, message, correlationId, service, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        correlationId: correlationId || 'unknown',
        service: service || 'unknown',
        ...meta,
      });
    }
  )
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    ({ timestamp, level, message, correlationId, service }) => {
      const cid = correlationId
        ? `[${correlationId.slice(0, 8)}]`
        : '[unknown]';
      const svc = service ? `[${service}]` : '';
      return `${timestamp} ${level} ${svc} ${cid} ${message}`;
    }
  )
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: LOG_LEVELS,
  format: customFormat,
  defaultMeta: { service: 'zodiacore' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      filename: process.env.LOG_ERROR_FILE || 'logs/error.log',
      level: 'error',
      format: customFormat,
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({
      filename: process.env.LOG_COMBINED_FILE || 'logs/combined.log',
      format: customFormat,
    }),
  ],
});

// Add console transport for production logging (JSON format for Render aggregation)
// In production, log to console in JSON format for centralized aggregation
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.Console({
      format: customFormat, // Use JSON format for production
    })
  );
} else {
  // Development: log to console with colors
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Add colors to winston
winston.addColors(LOG_COLORS);

// Correlation ID utilities
const CORRELATION_ID_HEADER = 'x-correlation-id';

/**
 * Generate a new correlation ID
 * @returns {string} UUID v4 correlation ID
 */
function generateCorrelationId() {
  return uuidv4();
}

/**
 * Get correlation ID from request headers or generate new one
 * @param {Object} req - Express request object
 * @returns {string} Correlation ID
 */
function getCorrelationId(req) {
  return req.headers[CORRELATION_ID_HEADER] || generateCorrelationId();
}

/**
 * Create a child logger with correlation ID context
 * @param {string} correlationId - Correlation ID
 * @param {string} service - Service name
 * @returns {Object} Child logger instance
 */
function createChildLogger(correlationId, service = 'unknown') {
  return logger.child({
    correlationId,
    service,
  });
}

/**
 * Express middleware to handle correlation ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function correlationIdMiddleware(req, res, next) {
  const correlationId = getCorrelationId(req);

  // Set correlation ID in response headers
  res.set(CORRELATION_ID_HEADER, correlationId);

  // Attach correlation ID to request for use in routes
  req.correlationId = correlationId;

  // Create child logger for this request
  req.logger = createChildLogger(correlationId, 'zodiacore-main');

  next();
}

/**
 * Get logger instance with optional correlation ID
 * @param {string} correlationId - Optional correlation ID
 * @param {string} service - Optional service name
 * @returns {Object} Logger instance
 */
function getLogger(correlationId = null, service = 'zodiacore') {
  if (correlationId) {
    return createChildLogger(correlationId, service);
  }
  return logger.child({ service });
}

module.exports = {
  logger,
  generateCorrelationId,
  getCorrelationId,
  createChildLogger,
  correlationIdMiddleware,
  getLogger,
  CORRELATION_ID_HEADER,
};
