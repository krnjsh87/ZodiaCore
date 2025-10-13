/**
 * Standardized Error Handler for Astrology Services
 * Provides structured error handling with consistent codes and messages
 */

class AstrologyError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'AstrologyError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Error codes for consistent error handling
 */
const ERROR_CODES = {
    // Validation errors
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
    INVALID_DATE: 'INVALID_DATE',
    INVALID_COORDINATES: 'INVALID_COORDINATES',

    // Calculation errors
    CALCULATION_FAILED: 'CALCULATION_FAILED',
    PLANETARY_POSITION_ERROR: 'PLANETARY_POSITION_ERROR',
    HOUSE_CALCULATION_ERROR: 'HOUSE_CALCULATION_ERROR',

    // Data errors
    SPECIES_NOT_FOUND: 'SPECIES_NOT_FOUND',
    BREED_NOT_FOUND: 'BREED_NOT_FOUND',
    INVALID_PLANET: 'INVALID_PLANET',

    // System errors
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',

    // General errors
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Standardized Error Handler
 */
class AstrologyErrorHandler {
    /**
     * Create a validation error
     */
    static validationError(field, value, reason) {
        return new AstrologyError(
            ERROR_CODES.INVALID_INPUT,
            `Validation failed for field '${field}': ${reason}`,
            { field, value, reason }
        );
    }

    /**
     * Create a missing field error
     */
    static missingFieldError(field) {
        return new AstrologyError(
            ERROR_CODES.MISSING_REQUIRED_FIELD,
            `Required field '${field}' is missing`,
            { field }
        );
    }

    /**
     * Create a calculation error
     */
    static calculationError(operation, details) {
        return new AstrologyError(
            ERROR_CODES.CALCULATION_FAILED,
            `Calculation failed during ${operation}`,
            { operation, details }
        );
    }

    /**
     * Create a data not found error
     */
    static notFoundError(type, identifier) {
        const code = type === 'species' ? ERROR_CODES.SPECIES_NOT_FOUND :
                    type === 'breed' ? ERROR_CODES.BREED_NOT_FOUND :
                    ERROR_CODES.INVALID_PLANET;

        return new AstrologyError(
            code,
            `${type} '${identifier}' not found`,
            { type, identifier }
        );
    }

    /**
     * Handle errors with logging and standardized response
     */
    static handle(error, context = {}) {
        // Log error with correlation ID
        const correlationId = context.correlationId || this.generateCorrelationId();
        console.error(`[${correlationId}] Error in ${context.service || 'unknown'}:`, {
            code: error.code || 'UNKNOWN',
            message: error.message,
            details: error.details,
            stack: error.stack,
            context
        });

        // Return standardized error response
        return {
            success: false,
            error: {
                code: error.code || ERROR_CODES.UNKNOWN_ERROR,
                message: error.message,
                correlationId,
                timestamp: error.timestamp || new Date().toISOString()
            }
        };
    }

    /**
     * Wrap async function with error handling
     */
    static async withErrorHandling(fn, context = {}) {
        try {
            return await fn();
        } catch (error) {
            return this.handle(error, context);
        }
    }

    /**
     * Generate correlation ID for request tracking
     */
    static generateCorrelationId() {
        return `ast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Validate required fields
     */
    static validateRequired(data, requiredFields) {
        for (const field of requiredFields) {
            if (!data[field]) {
                throw this.missingFieldError(field);
            }
        }
    }

    /**
     * Validate date range
     */
    static validateDateRange(year, minYear = 1900, maxYear = new Date().getFullYear() + 1) {
        if (year < minYear || year > maxYear) {
            throw this.validationError('birthYear', year, `must be between ${minYear} and ${maxYear}`);
        }
    }

    /**
     * Validate coordinates
     */
    static validateCoordinates(latitude, longitude) {
        if (latitude < -90 || latitude > 90) {
            throw this.validationError('birthLatitude', latitude, 'must be between -90 and 90');
        }
        if (longitude < -180 || longitude > 180) {
            throw this.validationError('birthLongitude', longitude, 'must be between -180 and 180');
        }
    }
}

module.exports = {
    AstrologyError,
    AstrologyErrorHandler,
    ERROR_CODES
};