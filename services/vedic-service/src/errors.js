/**
 * Standardized Error Classes for Transit Analysis System
 * ZC1.26 Transit Analysis and Alerts Implementation
 */

/**
 * Base Astrology Error Class
 */
class AstrologyError extends Error {
    constructor(code, message, data = {}) {
        super(message);
        this.code = code;
        this.data = data;
        this.name = 'AstrologyError';
        this.timestamp = new Date().toISOString();

        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AstrologyError);
        }
    }

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

/**
 * Validation Error - for input validation failures
 */
class ValidationError extends AstrologyError {
    constructor(message, field = null, value = null) {
        super('VALIDATION_ERROR', message, { field, value });
        this.name = 'ValidationError';
    }
}

/**
 * Calculation Error - for astronomical/mathematical calculation failures
 */
class CalculationError extends AstrologyError {
    constructor(message, operation = null, parameters = {}) {
        super('CALCULATION_ERROR', message, { operation, parameters });
        this.name = 'CalculationError';
    }
}

/**
 * Configuration Error - for configuration-related issues
 */
class ConfigurationError extends AstrologyError {
    constructor(message, configKey = null, expectedType = null) {
        super('CONFIGURATION_ERROR', message, { configKey, expectedType });
        this.name = 'ConfigurationError';
    }
}

/**
 * Data Error - for data integrity or format issues
 */
class DataError extends AstrologyError {
    constructor(message, dataType = null, issues = []) {
        super('DATA_ERROR', message, { dataType, issues });
        this.name = 'DataError';
    }
}

/**
 * Notification Error - for alert/notification system failures
 */
class NotificationError extends AstrologyError {
    constructor(message, channel = null, recipient = null) {
        super('NOTIFICATION_ERROR', message, { channel, recipient });
        this.name = 'NotificationError';
    }
}

/**
 * Cache Error - for caching system failures
 */
class CacheError extends AstrologyError {
    constructor(message, operation = null, key = null) {
        super('CACHE_ERROR', message, { operation, key });
        this.name = 'CacheError';
    }
}

/**
 * Input validation utilities
 */
const validators = {
    /**
     * Validate required field
     */
    required: (value, fieldName) => {
        if (value === null || value === undefined || value === '') {
            throw new ValidationError(`${fieldName} is required`, fieldName, value);
        }
    },

    /**
     * Validate number
     */
    number: (value, fieldName, min = null, max = null) => {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new ValidationError(`${fieldName} must be a valid number`, fieldName, value);
        }
        if (min !== null && value < min) {
            throw new ValidationError(`${fieldName} must be at least ${min}`, fieldName, value);
        }
        if (max !== null && value > max) {
            throw new ValidationError(`${fieldName} must be at most ${max}`, fieldName, value);
        }
    },

    /**
     * Validate array
     */
    array: (value, fieldName, minLength = null, maxLength = null) => {
        if (!Array.isArray(value)) {
            throw new ValidationError(`${fieldName} must be an array`, fieldName, value);
        }
        if (minLength !== null && value.length < minLength) {
            throw new ValidationError(`${fieldName} must have at least ${minLength} items`, fieldName, value);
        }
        if (maxLength !== null && value.length > maxLength) {
            throw new ValidationError(`${fieldName} must have at most ${maxLength} items`, fieldName, value);
        }
    },

    /**
     * Validate object
     */
    object: (value, fieldName, requiredKeys = []) => {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            throw new ValidationError(`${fieldName} must be an object`, fieldName, value);
        }
        for (const key of requiredKeys) {
            if (!(key in value)) {
                throw new ValidationError(`${fieldName} must contain '${key}' property`, fieldName, value);
            }
        }
    },

    /**
     * Validate date
     */
    date: (value, fieldName) => {
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new ValidationError(`${fieldName} must be a valid Date object`, fieldName, value);
        }
    },

    /**
     * Validate longitude (0-360 degrees)
     */
    longitude: (value, fieldName) => {
        validators.number(value, fieldName, 0, 360);
    },

    /**
     * Validate latitude (-90 to 90 degrees)
     */
    latitude: (value, fieldName) => {
        validators.number(value, fieldName, -90, 90);
    },

    /**
     * Validate planet name
     */
    planet: (value, fieldName) => {
        const validPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];
        if (!validPlanets.includes(value)) {
            throw new ValidationError(`${fieldName} must be a valid planet name`, fieldName, value);
        }
    },

    /**
     * Validate natal chart structure
     */
    natalChart: (chart, fieldName = 'natalChart') => {
        validators.object(chart, fieldName, ['planets', 'houses', 'ayanamsa']);

        validators.object(chart.planets, `${fieldName}.planets`);
        validators.array(chart.houses, `${fieldName}.houses`, 12, 12);
        validators.number(chart.ayanamsa, `${fieldName}.ayanamsa`);

        // Validate planets object has required planets
        const requiredPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
        for (const planet of requiredPlanets) {
            if (!(planet in chart.planets)) {
                throw new ValidationError(`${fieldName}.planets must contain ${planet}`, `${fieldName}.planets`, chart.planets);
            }
            validators.object(chart.planets[planet], `${fieldName}.planets.${planet}`, ['longitude']);
            validators.longitude(chart.planets[planet].longitude, `${fieldName}.planets.${planet}.longitude`);
        }
    }
};

module.exports = {
    AstrologyError,
    ValidationError,
    CalculationError,
    ConfigurationError,
    DataError,
    NotificationError,
    CacheError,
    validators
};