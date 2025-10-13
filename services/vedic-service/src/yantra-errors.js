/**
 * ZC1.27 Yantra Custom Error Classes
 * Standardized error handling for Yantra sacred geometry services
 */

class YantraError extends Error {
    constructor(message, code = 'YANTRA_ERROR', statusCode = 500, details = {}) {
        super(message);
        this.name = 'YantraError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.timestamp = new Date().toISOString();

        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, YantraError);
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            details: this.details,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

class ValidationError extends YantraError {
    constructor(message, field = null, value = null) {
        super(message, 'VALIDATION_ERROR', 400, { field, value });
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends YantraError {
    constructor(message = 'Authentication required') {
        super(message, 'AUTHENTICATION_ERROR', 401);
        this.name = 'AuthenticationError';
    }
}

class AuthorizationError extends YantraError {
    constructor(message = 'Insufficient permissions') {
        super(message, 'AUTHORIZATION_ERROR', 403);
        this.name = 'AuthorizationError';
    }
}

class NotFoundError extends YantraError {
    constructor(resource = 'Resource', identifier = null) {
        const message = identifier ? `${resource} with identifier '${identifier}' not found` : `${resource} not found`;
        super(message, 'NOT_FOUND_ERROR', 404, { resource, identifier });
        this.name = 'NotFoundError';
    }
}

class RateLimitError extends YantraError {
    constructor(message = 'Rate limit exceeded', resetTime = null) {
        super(message, 'RATE_LIMIT_ERROR', 429, { resetTime });
        this.name = 'RateLimitError';
    }
}

class GeometryError extends YantraError {
    constructor(message, yantraType = null, operation = null) {
        super(message, 'GEOMETRY_ERROR', 500, { yantraType, operation });
        this.name = 'GeometryError';
    }
}

class EncryptionError extends YantraError {
    constructor(message, operation = null) {
        super(message, 'ENCRYPTION_ERROR', 500, { operation });
        this.name = 'EncryptionError';
    }
}

class CacheError extends YantraError {
    constructor(message, operation = null, key = null) {
        super(message, 'CACHE_ERROR', 500, { operation, key });
        this.name = 'CacheError';
    }
}

class ServiceUnavailableError extends YantraError {
    constructor(message = 'Service temporarily unavailable', service = null) {
        super(message, 'SERVICE_UNAVAILABLE_ERROR', 503, { service });
        this.name = 'ServiceUnavailableError';
    }
}

class ConfigurationError extends YantraError {
    constructor(message, configKey = null) {
        super(message, 'CONFIGURATION_ERROR', 500, { configKey });
        this.name = 'ConfigurationError';
    }
}

/**
 * Error handler utility for consistent error processing
 */
class YantraErrorHandler {
    static handle(error, context = {}) {
        // Log error with context
        console.error('Yantra Error:', {
            error: error.toJSON ? error.toJSON() : error.message,
            context,
            timestamp: new Date().toISOString()
        });

        // If it's already a YantraError, return as-is
        if (error instanceof YantraError) {
            return error;
        }

        // Wrap unknown errors
        return new YantraError(
            error.message || 'An unexpected error occurred',
            'UNKNOWN_ERROR',
            500,
            { originalError: error.name, context }
        );
    }

    static isOperationalError(error) {
        // Operational errors are errors that we expect and can handle
        return error instanceof YantraError &&
               [400, 401, 403, 404, 429].includes(error.statusCode);
    }

    static isSystemError(error) {
        // System errors are unexpected and should be investigated
        return !this.isOperationalError(error);
    }
}

module.exports = {
    YantraError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    RateLimitError,
    GeometryError,
    EncryptionError,
    CacheError,
    ServiceUnavailableError,
    ConfigurationError,
    YantraErrorHandler
};