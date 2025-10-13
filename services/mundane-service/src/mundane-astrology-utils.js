/**
 * Mundane Astrology Utility Classes and Functions
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * This file contains utility classes for date handling, logging, validation,
 * and error handling used throughout the Mundane Astrology System.
 */

const { CONFIG, ERROR_CONSTANTS } = require('./mundane-astrology-constants');

/**
 * Date utilities for astronomical calculations
 */
class DateUtils {
    /**
     * Calculate Julian Day from Gregorian date
     * @param {number} year - Year
     * @param {number} month - Month (1-12)
     * @param {number} day - Day
     * @param {number} hour - Hour (0-23)
     * @param {number} minute - Minute (0-59)
     * @param {number} second - Second (0-59)
     * @returns {number} Julian Day
     */
    static calculateJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }

        const a = Math.floor(year / 100);
        const b = 2 - a + Math.floor(a / 4);
        const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524;

        const fraction = (hour + minute / 60 + second / 3600) / 24;
        return jd + fraction;
    }

    /**
     * Calculate Julian Day from date string
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {number} Julian Day
     */
    static calculateJulianDayFromDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return this.calculateJulianDay(year, month, day);
    }

    /**
     * Calculate elapsed years between two dates
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date (defaults to now)
     * @returns {number} Elapsed years
     */
    static calculateElapsedYears(startDate, endDate = new Date()) {
        const diffTime = Math.abs(endDate - startDate);
        return diffTime / (1000 * 60 * 60 * 24 * 365.25);
    }
}

/**
 * Centralized logging utility with correlation ID support
 */
class Logger {
    static generateCorrelationId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    static log(level, message, context = {}, correlationId = null) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            correlationId: correlationId || this.generateCorrelationId(),
            context
        };

        if (CONFIG.LOG_LEVEL === 'DEBUG' || level === 'error' || level === 'warn') {
            console[level === 'info' ? 'log' : level](JSON.stringify(logEntry));
        }

        return logEntry;
    }

    static info(message, context = {}, correlationId = null) {
        return this.log('info', message, context, correlationId);
    }

    static warn(message, context = {}, correlationId = null) {
        return this.log('warn', message, context, correlationId);
    }

    static error(message, context = {}, correlationId = null) {
        return this.log('error', message, context, correlationId);
    }

    static debug(message, context = {}, correlationId = null) {
        return this.log('debug', message, context, correlationId);
    }
}

/**
 * Validation utilities
 */
class ValidationUtils {
    static validateCoordinates(latitude, longitude) {
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            throw new MundaneAstrologyError('INVALID_COORDINATES', { latitude, longitude });
        }

        if (latitude < -90 || latitude > 90) {
            throw new MundaneAstrologyError('INVALID_COORDINATES', { latitude, reason: 'Latitude out of range' });
        }

        if (longitude < -180 || longitude > 180) {
            throw new MundaneAstrologyError('INVALID_COORDINATES', { longitude, reason: 'Longitude out of range' });
        }

        return true;
    }

    static validateNationalData(nationalData) {
        const required = ['countryName', 'foundingYear', 'foundingMonth', 'foundingDay'];

        for (const field of required) {
            if (!nationalData[field]) {
                throw new MundaneAstrologyError('MISSING_NATIONAL_DATA', { missingField: field });
            }
        }

        // Validate date
        const date = new Date(nationalData.foundingYear, nationalData.foundingMonth - 1, nationalData.foundingDay);
        if (isNaN(date.getTime())) {
            throw new MundaneAstrologyError('INVALID_DATE', { date: nationalData });
        }

        return true;
    }

    static validateAnalysisRequest(request) {
        if (!request.region || !request.region.name) {
            throw new MundaneAstrologyError('MISSING_NATIONAL_DATA', { missingField: 'region' });
        }

        // Sanitize string inputs
        if (request.region.name) {
            request.region.name = this.sanitizeString(request.region.name);
        }

        if (request.region.latitude !== undefined && request.region.longitude !== undefined) {
            this.validateCoordinates(request.region.latitude, request.region.longitude);
        }

        if (request.nationalData) {
            this.validateNationalData(request.nationalData);
        }

        return true;
    }

    /**
     * Sanitize string inputs to prevent injection
     * @param {string} input - Input string
     * @returns {string} Sanitized string
     */
    static sanitizeString(input) {
        if (typeof input !== 'string') return '';
        // Remove potentially dangerous characters and trim
        return input.replace(/[<>\"'&]/g, '').trim().substring(0, 100); // Limit length
    }
}

/**
 * Standardized Error class for Mundane Astrology operations
 */
class MundaneAstrologyError extends Error {
    constructor(errorCode, details = {}, cause = null) {
        const errorInfo = ERROR_CONSTANTS[errorCode];
        if (!errorInfo) {
            throw new Error(`Unknown error code: ${errorCode}`);
        }

        super(errorInfo.message);
        this.name = 'MundaneAstrologyError';
        this.code = errorInfo.code;
        this.severity = errorInfo.severity;
        this.details = details;
        this.timestamp = new Date();
        this.cause = cause;

        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, MundaneAstrologyError);
        }
    }

    /**
     * Convert error to structured log format
     */
    toLogFormat() {
        return {
            timestamp: this.timestamp,
            error: {
                name: this.name,
                code: this.code,
                message: this.message,
                severity: this.severity,
                details: this.details
            },
            cause: this.cause?.message
        };
    }

    /**
     * Convert error to user-friendly message
     */
    toUserMessage() {
        const userMessages = {
            'CALC_001': 'Unable to perform astronomical calculations. Please check input data.',
            'COORD_001': 'Invalid location coordinates provided.',
            'DATA_001': 'National founding information is incomplete.',
            'DATE_001': 'Invalid date provided for analysis.',
            'POS_001': 'Unable to determine planetary positions.',
            'MCP_001': 'Connection to analysis network failed.',
            'AUTH_001': 'Authentication failed. Please check credentials.',
            'HIST_001': 'Historical data not available for validation.'
        };

        return userMessages[this.code] || 'An unexpected error occurred.';
    }
}

/**
 * Error handling utilities
 */
class ErrorHandler {
    static handleError(error, context = {}, correlationId = null) {
        // Log error with correlation ID
        Logger.error('Mundane Astrology Error', {
            error: error.toLogFormat(),
            context
        }, correlationId);

        // Determine recovery strategy based on error type
        const recoveryStrategy = this.getRecoveryStrategy(error.code);

        // Attempt recovery if possible
        if (recoveryStrategy.canRecover) {
            Logger.info('Attempting error recovery', { strategy: recoveryStrategy.fallback }, correlationId);
            return this.attemptRecovery(error, recoveryStrategy, context, correlationId);
        }

        // Return user-friendly error response
        return {
            success: false,
            error: {
                code: error.code,
                message: error.toUserMessage(),
                severity: error.severity
            },
            context: context,
            correlationId
        };
    }

    static getRecoveryStrategy(errorCode) {
        const strategies = {
            'CALC_001': { canRecover: true, fallback: 'simplified_calculation' },
            'COORD_001': { canRecover: true, fallback: 'default_coordinates' },
            'DATA_001': { canRecover: true, fallback: 'generic_analysis' },
            'DATE_001': { canRecover: false },
            'POS_001': { canRecover: true, fallback: 'cached_positions' },
            'MCP_001': { canRecover: true, fallback: 'local_analysis' },
            'AUTH_001': { canRecover: false },
            'HIST_001': { canRecover: true, fallback: 'skip_validation' }
        };

        return strategies[errorCode] || { canRecover: false };
    }

    static async attemptRecovery(error, strategy, context) {
        try {
            switch (strategy.fallback) {
                case 'simplified_calculation':
                    return await this.performSimplifiedCalculation(context);
                case 'default_coordinates':
                    return await this.useDefaultCoordinates(context);
                case 'generic_analysis':
                    return await this.performGenericAnalysis(context);
                case 'cached_positions':
                    return await this.useCachedPositions(context);
                case 'local_analysis':
                    return await this.performLocalAnalysis(context);
                case 'skip_validation':
                    return await this.skipValidation(context);
                default:
                    throw new Error('No recovery strategy available');
            }
        } catch (recoveryError) {
            // Recovery failed, return original error
            return this.handleError(error, context);
        }
    }

    // Recovery implementation methods (simplified)
    static async performSimplifiedCalculation(context) {
        // Implement simplified calculation logic
        return { success: true, data: {}, method: 'simplified' };
    }

    static async useDefaultCoordinates(context) {
        // Use default coordinates for analysis
        return { success: true, coordinates: { lat: 0, lon: 0 } };
    }

    static async performGenericAnalysis(context) {
        // Perform generic analysis without specific data
        return { success: true, analysis: {}, type: 'generic' };
    }

    static async useCachedPositions(context) {
        // Use cached planetary positions
        return { success: true, positions: {}, source: 'cache' };
    }

    static async performLocalAnalysis(context) {
        // Perform analysis without MCP collaboration
        return { success: true, analysis: {}, mode: 'local' };
    }

    static async skipValidation(context) {
        // Skip historical validation
        return { success: true, validation: null, skipped: true };
    }
}

module.exports = {
    DateUtils,
    Logger,
    ValidationUtils,
    MundaneAstrologyError,
    ErrorHandler
};