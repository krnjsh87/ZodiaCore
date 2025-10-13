/**
 * ZC1.27 Yantra Input Validation and Sanitization
 * Provides comprehensive input validation for Yantra API endpoints
 */

const YANTRA_ERRORS = require('./yantra-sacred-geometry-constants').YANTRA_ERRORS;

class YantraInputValidator {
    constructor() {
        this.maxUserIdLength = 50;
        this.maxYantraTypeLength = 30;
        this.maxSize = 2000;
        this.minSize = 50;
        this.allowedYantraTypes = [
            'SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU',
            'SRI_YANTRA', 'GANESH_YANTRA', 'HANUMAN_YANTRA'
        ];
        this.allowedGoals = ['SPIRITUAL_GROWTH', 'HEALTH', 'WEALTH', 'RELATIONSHIPS', 'CAREER', 'PROTECTION'];
        this.allowedExperienceLevels = ['beginner', 'intermediate', 'advanced'];
        this.allowedBudgetLevels = ['low', 'moderate', 'high'];
    }

    /**
     * Validate user ID
     * @param {string} userId - User identifier
     * @returns {Object} Validation result
     */
    validateUserId(userId) {
        if (!userId) {
            return { valid: false, error: 'User ID is required' };
        }

        if (typeof userId !== 'string') {
            return { valid: false, error: 'User ID must be a string' };
        }

        if (userId.length === 0 || userId.length > this.maxUserIdLength) {
            return { valid: false, error: `User ID must be between 1 and ${this.maxUserIdLength} characters` };
        }

        // Allow alphanumeric, hyphens, underscores
        if (!/^[a-zA-Z0-9_-]+$/.test(userId)) {
            return { valid: false, error: 'User ID contains invalid characters' };
        }

        return { valid: true, sanitized: userId.trim() };
    }

    /**
     * Validate Yantra type
     * @param {string} yantraType - Yantra type
     * @returns {Object} Validation result
     */
    validateYantraType(yantraType) {
        if (!yantraType) {
            return { valid: false, error: 'Yantra type is required' };
        }

        if (typeof yantraType !== 'string') {
            return { valid: false, error: 'Yantra type must be a string' };
        }

        const sanitized = yantraType.trim().toUpperCase();

        if (sanitized.length === 0 || sanitized.length > this.maxYantraTypeLength) {
            return { valid: false, error: `Yantra type must be between 1 and ${this.maxYantraTypeLength} characters` };
        }

        if (!this.allowedYantraTypes.includes(sanitized)) {
            return { valid: false, error: `Invalid Yantra type. Allowed types: ${this.allowedYantraTypes.join(', ')}` };
        }

        return { valid: true, sanitized };
    }

    /**
     * Validate size parameter
     * @param {number} size - Size value
     * @returns {Object} Validation result
     */
    validateSize(size) {
        if (size === undefined || size === null) {
            return { valid: true, sanitized: 400 }; // Default size
        }

        const numSize = Number(size);
        if (isNaN(numSize)) {
            return { valid: false, error: 'Size must be a number' };
        }

        if (numSize < this.minSize || numSize > this.maxSize) {
            return { valid: false, error: `Size must be between ${this.minSize} and ${this.maxSize}` };
        }

        return { valid: true, sanitized: Math.round(numSize) };
    }

    /**
     * Validate options object
     * @param {Object} options - Options object
     * @returns {Object} Validation result
     */
    validateOptions(options) {
        if (!options) {
            return { valid: true, sanitized: {} };
        }

        if (typeof options !== 'object') {
            return { valid: false, error: 'Options must be an object' };
        }

        const sanitized = {};

        // Validate experience level
        if (options.experience !== undefined) {
            if (!this.allowedExperienceLevels.includes(options.experience)) {
                return { valid: false, error: `Invalid experience level. Allowed: ${this.allowedExperienceLevels.join(', ')}` };
            }
            sanitized.experience = options.experience;
        }

        // Validate goals array
        if (options.goals !== undefined) {
            if (!Array.isArray(options.goals)) {
                return { valid: false, error: 'Goals must be an array' };
            }

            const invalidGoals = options.goals.filter(goal => !this.allowedGoals.includes(goal));
            if (invalidGoals.length > 0) {
                return { valid: false, error: `Invalid goals: ${invalidGoals.join(', ')}. Allowed: ${this.allowedGoals.join(', ')}` };
            }

            sanitized.goals = options.goals;
        }

        // Validate budget
        if (options.budget !== undefined) {
            if (!this.allowedBudgetLevels.includes(options.budget)) {
                return { valid: false, error: `Invalid budget level. Allowed: ${this.allowedBudgetLevels.join(', ')}` };
            }
            sanitized.budget = options.budget;
        }

        // Validate size if present
        if (options.size !== undefined) {
            const sizeValidation = this.validateSize(options.size);
            if (!sizeValidation.valid) {
                return sizeValidation;
            }
            sanitized.size = sizeValidation.sanitized;
        }

        return { valid: true, sanitized };
    }

    /**
     * Validate birth chart data structure
     * @param {Object} birthChart - Birth chart object
     * @returns {Object} Validation result
     */
    validateBirthChart(birthChart) {
        if (!birthChart) {
            return { valid: false, error: 'Birth chart is required' };
        }

        if (typeof birthChart !== 'object') {
            return { valid: false, error: 'Birth chart must be an object' };
        }

        // Check planets
        if (!birthChart.planets || typeof birthChart.planets !== 'object') {
            return { valid: false, error: 'Birth chart must contain planets data' };
        }

        // Validate required planets
        const requiredPlanets = ['SUN', 'MOON'];
        for (const planet of requiredPlanets) {
            if (!birthChart.planets[planet]) {
                return { valid: false, error: `Birth chart missing required planet: ${planet}` };
            }

            const planetData = birthChart.planets[planet];
            if (!planetData.sign || !planetData.house || typeof planetData.longitude !== 'number') {
                return { valid: false, error: `Invalid data for planet ${planet}` };
            }
        }

        return { valid: true, sanitized: birthChart };
    }

    /**
     * Validate user profile
     * @param {Object} userProfile - User profile object
     * @returns {Object} Validation result
     */
    validateUserProfile(userProfile) {
        if (!userProfile) {
            return { valid: true, sanitized: {} };
        }

        if (typeof userProfile !== 'object') {
            return { valid: false, error: 'User profile must be an object' };
        }

        const sanitized = {};

        // Validate age
        if (userProfile.age !== undefined) {
            const age = Number(userProfile.age);
            if (isNaN(age) || age < 0 || age > 150) {
                return { valid: false, error: 'Age must be a number between 0 and 150' };
            }
            sanitized.age = age;
        }

        // Validate experience
        if (userProfile.experience !== undefined) {
            if (!this.allowedExperienceLevels.includes(userProfile.experience)) {
                return { valid: false, error: `Invalid experience level. Allowed: ${this.allowedExperienceLevels.join(', ')}` };
            }
            sanitized.experience = userProfile.experience;
        }

        // Validate lifestyle
        if (userProfile.lifestyle !== undefined) {
            const allowedLifestyles = ['busy', 'moderate', 'relaxed'];
            if (!allowedLifestyles.includes(userProfile.lifestyle)) {
                return { valid: false, error: `Invalid lifestyle. Allowed: ${allowedLifestyles.join(', ')}` };
            }
            sanitized.lifestyle = userProfile.lifestyle;
        }

        return { valid: true, sanitized };
    }

    /**
     * Sanitize string input
     * @param {string} input - Input string
     * @param {number} maxLength - Maximum length
     * @returns {string} Sanitized string
     */
    sanitizeString(input, maxLength = 1000) {
        if (typeof input !== 'string') {
            return '';
        }

        return input.trim().substring(0, maxLength).replace(/[<>\"'&]/g, '');
    }

    /**
     * Validate request size
     * @param {Object} request - Request object
     * @returns {Object} Validation result
     */
    validateRequestSize(request) {
        const requestSize = JSON.stringify(request).length;

        // Max 1MB request size
        if (requestSize > 1024 * 1024) {
            return { valid: false, error: 'Request size exceeds maximum allowed size (1MB)' };
        }

        return { valid: true };
    }
}

module.exports = YantraInputValidator;