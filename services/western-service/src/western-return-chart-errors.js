/**
 * Western Astrology Return Chart Error Constants
 *
 * Centralized error definitions for the ZC3.8 Western Astrology Return Chart system.
 * Provides standardized error codes and messages for consistent error handling.
 *
 * @version 1.0.0
 * @since 2025-10-10
 */

const RETURN_CHART_ERRORS = {
    // Validation Errors
    INVALID_CHART_TYPE: {
        code: 'INVALID_CHART_TYPE',
        message: 'Invalid chart type specified. Must be "solar" or "lunar".'
    },
    INVALID_DATE: {
        code: 'INVALID_DATE',
        message: 'Invalid date provided. Must be a valid Date object.'
    },
    INVALID_LOCATION: {
        code: 'INVALID_LOCATION',
        message: 'Invalid location coordinates provided.'
    },
    INVALID_LATITUDE: {
        code: 'INVALID_LATITUDE',
        message: 'Latitude must be between -90 and 90 degrees.'
    },
    INVALID_LONGITUDE: {
        code: 'INVALID_LONGITUDE',
        message: 'Longitude must be between -180 and 180 degrees.'
    },

    // Calculation Errors
    CONVERGENCE_FAILURE: {
        code: 'CONVERGENCE_FAILURE',
        message: 'Return time calculation failed to converge.'
    },
    INVALID_PLANET: {
        code: 'INVALID_PLANET',
        message: 'Invalid planet specified for calculation.'
    },
    EPHEMERIS_ERROR: {
        code: 'EPHEMERIS_ERROR',
        message: 'Error calculating planetary positions.'
    },

    // System Errors
    MISSING_DEPENDENCY: {
        code: 'MISSING_DEPENDENCY',
        message: 'Required dependency module not found.'
    },
    CONFIGURATION_ERROR: {
        code: 'CONFIGURATION_ERROR',
        message: 'System configuration error.'
    },

    // Data Errors
    BIRTH_CHART_INVALID: {
        code: 'BIRTH_CHART_INVALID',
        message: 'Invalid birth chart data provided.'
    },
    VALIDATION_FAILED: {
        code: 'VALIDATION_FAILED',
        message: 'Return chart validation failed.'
    }
};

/**
 * Return Chart Error Class
 */
class ReturnChartError extends Error {
    constructor(errorKey, details = {}) {
        const errorInfo = RETURN_CHART_ERRORS[errorKey];
        if (!errorInfo) {
            super(`Unknown error: ${errorKey}`);
            this.code = 'UNKNOWN_ERROR';
        } else {
            super(errorInfo.message);
            this.code = errorInfo.code;
        }
        this.name = 'ReturnChartError';
        this.details = details;
    }
}

module.exports = {
    RETURN_CHART_ERRORS,
    ReturnChartError
};