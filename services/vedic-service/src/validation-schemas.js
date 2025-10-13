/**
 * ZodiaCore - Validation Schemas
 *
 * Comprehensive input validation schemas for all astrology system inputs.
 * Uses custom validation functions to ensure data integrity and security.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

/**
 * Validation schemas for astrology system inputs
 */
const VALIDATION_SCHEMAS = {
    // Birth chart validation
    birthChart: {
        validate: (data) => {
            const errors = [];

            // Check planets
            if (!data.planets || typeof data.planets !== 'object') {
                errors.push('planets: Required object');
            } else {
                const validPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];
                for (const planet in data.planets) {
                    if (!validPlanets.includes(planet)) {
                        errors.push(`planets.${planet}: Invalid planet name`);
                    } else {
                        const planetData = data.planets[planet];
                        if (typeof planetData.longitude !== 'number' || planetData.longitude < 0 || planetData.longitude > 360) {
                            errors.push(`planets.${planet}.longitude: Must be number between 0-360`);
                        }
                    }
                }
            }

            // Check houses
            if (!Array.isArray(data.houses) || data.houses.length !== 12) {
                errors.push('houses: Must be array of 12 numbers');
            } else {
                data.houses.forEach((house, index) => {
                    if (typeof house !== 'number' || house < 0 || house > 360) {
                        errors.push(`houses[${index}]: Must be number between 0-360`);
                    }
                });
            }

            // Check ascendant
            if (!data.ascendant || typeof data.ascendant !== 'object') {
                errors.push('ascendant: Required object');
            } else {
                if (typeof data.ascendant.longitude !== 'number' || data.ascendant.longitude < 0 || data.ascendant.longitude > 360) {
                    errors.push('ascendant.longitude: Must be number between 0-360');
                }
                if (typeof data.ascendant.sign !== 'number' || data.ascendant.sign < 0 || data.ascendant.sign > 11) {
                    errors.push('ascendant.sign: Must be number between 0-11');
                }
            }

            return {
                success: errors.length === 0,
                errors: errors
            };
        }
    }
};

// Custom validation functions
const CUSTOM_VALIDATORS = {
    /**
     * Validate that all required planets are present
     */
    hasRequiredPlanets: (planets) => {
        const requiredPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
        const missing = requiredPlanets.filter(planet => !planets[planet]);
        return missing.length === 0 ? { valid: true } : { valid: false, missing };
    }
};

/**
 * Validation helper class
 */
class ValidationHelper {
    /**
     * Validate data against schema
     * @param {any} data - Data to validate
     * @param {Object} schema - Validation schema with validate function
     * @returns {Object} Validation result
     */
    static validate(data, schema) {
        try {
            if (typeof schema.validate === 'function') {
                const result = schema.validate(data);
                return {
                    success: result.success,
                    data: result.success ? data : null,
                    errors: result.errors || []
                };
            } else {
                return {
                    success: false,
                    data: null,
                    errors: [{ field: 'schema', message: 'Invalid schema format', code: 'schema_error' }]
                };
            }
        } catch (error) {
            return {
                success: false,
                data: null,
                errors: [{ field: 'validation', message: error.message, code: 'validation_error' }]
            };
        }
    }

    /**
     * Sanitize input data
     * @param {any} data - Data to sanitize
     * @returns {any} Sanitized data
     */
    static sanitize(data) {
        // Deep clone to avoid mutation
        const sanitized = JSON.parse(JSON.stringify(data));

        // Remove potentially dangerous properties
        const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

        const removeDangerous = (obj) => {
            if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    if (dangerousKeys.includes(key)) {
                        delete obj[key];
                    } else {
                        removeDangerous(obj[key]);
                    }
                }
            }
        };

        removeDangerous(sanitized);
        return sanitized;
    }

    /**
     * Validate and sanitize input
     * @param {any} data - Data to validate and sanitize
     * @param {Joi.Schema} schema - Joi schema
     * @returns {Object} Validation result with sanitized data
     */
    static validateAndSanitize(data, schema) {
        const sanitized = this.sanitize(data);
        return this.validate(sanitized, schema);
    }
}

module.exports = {
    VALIDATION_SCHEMAS,
    CUSTOM_VALIDATORS,
    ValidationHelper
};