/**
 * ZodiaCore - Centralized Logger Utility
 *
 * Provides structured logging with correlation IDs, log levels, and performance tracking.
 * Supports different output formats and filtering.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Log levels enumeration
 */
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

/**
 * Current log level (can be set via environment variable)
 */
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL] || LOG_LEVELS.INFO;

/**
 * Logger class for structured logging
 */
class Logger {
    constructor(context = 'ZodiaCore') {
        this.context = context;
        this.correlationId = null;
    }

    /**
     * Set correlation ID for request tracing
     * @param {string} id - Correlation ID
     */
    setCorrelationId(id) {
        this.correlationId = id;
    }

    /**
     * Generate new correlation ID
     * @returns {string} New correlation ID
     */
    generateCorrelationId() {
        this.correlationId = uuidv4();
        return this.correlationId;
    }

    /**
     * Create log entry with metadata
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} meta - Additional metadata
     * @returns {Object} Formatted log entry
     */
    createLogEntry(level, message, meta = {}) {
        return {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            context: this.context,
            correlationId: this.correlationId,
            message: message,
            ...meta
        };
    }

    /**
     * Log error message
     * @param {string} message - Error message
     * @param {Error|Object} error - Error object or metadata
     */
    error(message, error = {}) {
        if (CURRENT_LEVEL >= LOG_LEVELS.ERROR) {
            const logEntry = this.createLogEntry('error', message, {
                error: error.message || error,
                stack: error.stack,
                ...error
            });
            console.error(JSON.stringify(logEntry));
        }
    }

    /**
     * Log warning message
     * @param {string} message - Warning message
     * @param {Object} meta - Additional metadata
     */
    warn(message, meta = {}) {
        if (CURRENT_LEVEL >= LOG_LEVELS.WARN) {
            const logEntry = this.createLogEntry('warn', message, meta);
            console.warn(JSON.stringify(logEntry));
        }
    }

    /**
     * Log info message
     * @param {string} message - Info message
     * @param {Object} meta - Additional metadata
     */
    info(message, meta = {}) {
        if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
            const logEntry = this.createLogEntry('info', message, meta);
            console.log(JSON.stringify(logEntry));
        }
    }

    /**
     * Log debug message
     * @param {string} message - Debug message
     * @param {Object} meta - Additional metadata
     */
    debug(message, meta = {}) {
        if (CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
            const logEntry = this.createLogEntry('debug', message, meta);
            console.debug(JSON.stringify(logEntry));
        }
    }

    /**
     * Create performance timer
     * @param {string} operation - Operation name
     * @returns {Object} Timer object with end method
     */
    startTimer(operation) {
        const startTime = Date.now();
        const correlationId = this.correlationId;

        return {
            end: (additionalMeta = {}) => {
                const duration = Date.now() - startTime;
                this.info(`Operation completed: ${operation}`, {
                    operation,
                    duration,
                    durationUnit: 'ms',
                    ...additionalMeta
                });
                return duration;
            }
        };
    }
}

/**
 * Create logger instance for astrology services
 */
const astrologyLogger = new Logger('AstrologyService');

/**
 * Performance monitoring decorator
 * @param {Function} fn - Function to decorate
 * @param {string} operationName - Name for the operation
 * @returns {Function} Decorated function
 */
function withPerformanceMonitoring(fn, operationName) {
    return async function(...args) {
        const timer = astrologyLogger.startTimer(operationName || fn.name);
        try {
            const result = await fn.apply(this, args);
            timer.end({ success: true });
            return result;
        } catch (error) {
            timer.end({ success: false, error: error.message });
            throw error;
        }
    };
}

/**
 * Request tracing middleware
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
function requestTracing(req, res, next) {
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    astrologyLogger.setCorrelationId(correlationId);
    res.setHeader('x-correlation-id', correlationId);

    astrologyLogger.info('Request started', {
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        ip: req.ip
    });

    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        astrologyLogger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration,
            durationUnit: 'ms'
        });
    });

    next();
}

module.exports = {
    Logger,
    astrologyLogger,
    withPerformanceMonitoring,
    requestTracing,
    LOG_LEVELS
};