/**
 * Feng Shui Custom Error Classes
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * This file defines custom error classes for Feng Shui calculations,
 * providing structured error handling and meaningful error messages.
 */

/**
 * Base Feng Shui Error Class
 * Extends the built-in Error class with additional properties for Feng Shui specific errors.
 */
class FengShuiError extends Error {
    /**
     * Create a Feng Shui error
     * @param {string} message - Error message
     * @param {string} code - Error code for categorization
     * @param {object} details - Additional error details
     */
    constructor(message, code = 'FENG_SHUI_ERROR', details = {}) {
        super(message);
        this.name = 'FengShuiError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FengShuiError);
        }
    }

    /**
     * Convert error to JSON format
     * @returns {object} JSON representation of the error
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            details: this.details,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

/**
 * Validation Error Class
 * Used for input validation failures in Feng Shui calculations.
 */
class ValidationError extends FengShuiError {
    /**
     * Create a validation error
     * @param {string} message - Validation error message
     * @param {string} field - Field that failed validation
     * @param {any} value - Invalid value that was provided
     */
    constructor(message, field = null, value = null) {
        super(message, 'VALIDATION_ERROR', { field, value });
        this.name = 'ValidationError';
    }
}

/**
 * Calculation Error Class
 * Used for errors during Feng Shui mathematical calculations.
 */
class CalculationError extends FengShuiError {
    /**
     * Create a calculation error
     * @param {string} message - Calculation error message
     * @param {string} calculation - Type of calculation that failed
     * @param {object} parameters - Parameters used in the calculation
     */
    constructor(message, calculation = null, parameters = {}) {
        super(message, 'CALCULATION_ERROR', { calculation, parameters });
        this.name = 'CalculationError';
    }
}

/**
 * Data Error Class
 * Used for errors related to data retrieval or processing.
 */
class DataError extends FengShuiError {
    /**
     * Create a data error
     * @param {string} message - Data error message
     * @param {string} dataType - Type of data that caused the error
     * @param {string} operation - Operation being performed
     */
    constructor(message, dataType = null, operation = null) {
        super(message, 'DATA_ERROR', { dataType, operation });
        this.name = 'DataError';
    }
}

/**
 * Configuration Error Class
 * Used for configuration-related errors.
 */
class ConfigurationError extends FengShuiError {
    /**
     * Create a configuration error
     * @param {string} message - Configuration error message
     * @param {string} configKey - Configuration key that caused the error
     * @param {any} configValue - Invalid configuration value
     */
    constructor(message, configKey = null, configValue = null) {
        super(message, 'CONFIGURATION_ERROR', { configKey, configValue });
        this.name = 'ConfigurationError';
    }
}

/**
 * Timeout Error Class
 * Used for operations that exceed time limits.
 */
class TimeoutError extends FengShuiError {
    /**
     * Create a timeout error
     * @param {string} message - Timeout error message
     * @param {number} timeout - Timeout duration in milliseconds
     * @param {string} operation - Operation that timed out
     */
    constructor(message, timeout = null, operation = null) {
        super(message, 'TIMEOUT_ERROR', { timeout, operation });
        this.name = 'TimeoutError';
    }
}

/**
 * External Service Error Class
 * Used for errors from external services or APIs.
 */
class ExternalServiceError extends FengShuiError {
    /**
     * Create an external service error
     * @param {string} message - External service error message
     * @param {string} service - Name of the external service
     * @param {number} statusCode - HTTP status code if applicable
     * @param {object} response - Response from the external service
     */
    constructor(message, service = null, statusCode = null, response = {}) {
        super(message, 'EXTERNAL_SERVICE_ERROR', { service, statusCode, response });
        this.name = 'ExternalServiceError';
    }
}

module.exports = {
    FengShuiError,
    ValidationError,
    CalculationError,
    DataError,
    ConfigurationError,
    TimeoutError,
    ExternalServiceError
};