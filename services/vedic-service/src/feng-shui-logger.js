/**
 * Feng Shui Logger
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * Centralized logging utility with correlation IDs for request tracing.
 */

const crypto = require('crypto');

class FengShuiLogger {
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.correlationId = options.correlationId || this.generateCorrelationId();
        this.service = 'feng-shui-engine';
    }

    /**
     * Generate a unique correlation ID
     * @returns {string} Correlation ID
     */
    generateCorrelationId() {
        return crypto.randomUUID();
    }

    /**
     * Set correlation ID for current request
     * @param {string} id - Correlation ID
     */
    setCorrelationId(id) {
        this.correlationId = id;
    }

    /**
     * Create log entry with structured data
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {object} data - Additional data
     * @returns {object} Structured log entry
     */
    createLogEntry(level, message, data = {}) {
        return {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            service: this.service,
            correlationId: this.correlationId,
            message: message,
            data: data
        };
    }

    /**
     * Log error message
     * @param {string} message - Error message
     * @param {object} data - Additional error data
     */
    error(message, data = {}) {
        if (this.shouldLog('error')) {
            const entry = this.createLogEntry('error', message, data);
            console.error(JSON.stringify(entry));
        }
    }

    /**
     * Log warning message
     * @param {string} message - Warning message
     * @param {object} data - Additional data
     */
    warn(message, data = {}) {
        if (this.shouldLog('warn')) {
            const entry = this.createLogEntry('warn', message, data);
            console.warn(JSON.stringify(entry));
        }
    }

    /**
     * Log info message
     * @param {string} message - Info message
     * @param {object} data - Additional data
     */
    info(message, data = {}) {
        if (this.shouldLog('info')) {
            const entry = this.createLogEntry('info', message, data);
            console.log(JSON.stringify(entry));
        }
    }

    /**
     * Log debug message
     * @param {string} message - Debug message
     * @param {object} data - Additional data
     */
    debug(message, data = {}) {
        if (this.shouldLog('debug')) {
            const entry = this.createLogEntry('debug', message, data);
            console.debug(JSON.stringify(entry));
        }
    }

    /**
     * Check if message should be logged based on level
     * @param {string} level - Log level
     * @returns {boolean} Should log
     */
    shouldLog(level) {
        const levels = { error: 0, warn: 1, info: 2, debug: 3 };
        return levels[level] <= levels[this.level];
    }

    /**
     * Log API request
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {number} responseTime - Response time in ms
     */
    logRequest(req, res, responseTime) {
        this.info('API Request', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: responseTime,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        });
    }

    /**
     * Log engine operation
     * @param {string} operation - Operation name
     * @param {object} params - Operation parameters
     * @param {number} duration - Operation duration in ms
     */
    logOperation(operation, params, duration) {
        this.info('Engine Operation', {
            operation: operation,
            duration: duration,
            params: this.sanitizeParams(params)
        });
    }

    /**
     * Sanitize parameters for logging (remove sensitive data)
     * @param {object} params - Parameters to sanitize
     * @returns {object} Sanitized parameters
     */
    sanitizeParams(params) {
        if (!params) return params;

        const sanitized = { ...params };

        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'secret', 'key'];
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });

        return sanitized;
    }
}

module.exports = FengShuiLogger;