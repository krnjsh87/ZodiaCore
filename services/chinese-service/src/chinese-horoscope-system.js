// Chinese Horoscope System
// Main system for generating Chinese horoscopes across all timeframes

const { calculateBaZi } = require('./chinese-ba-zi-calculator');
const DailyChineseHoroscopeGenerator = require('./chinese-daily-horoscope-generator');
const WeeklyChineseHoroscopeGenerator = require('./chinese-weekly-horoscope-generator');
const MonthlyChineseHoroscopeGenerator = require('./chinese-monthly-horoscope-generator');
const YearlyChineseHoroscopeGenerator = require('./chinese-yearly-horoscope-generator');

/**
 * Structured error class for Chinese Horoscope operations
 */
class ChineseHoroscopeError extends Error {
    /**
     * @param {string} code - Error code
     * @param {string} message - Error message
     * @param {Object} details - Additional error details
     */
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'ChineseHoroscopeError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }

    /**
     * Create validation error
     * @param {string} field - Field that failed validation
     * @param {string} reason - Reason for failure
     * @returns {ChineseHoroscopeError}
     */
    static validationError(field, reason) {
        return new ChineseHoroscopeError(
            'VALIDATION_ERROR',
            `Validation failed for field '${field}': ${reason}`,
            { field, reason }
        );
    }

    /**
     * Create calculation error
     * @param {string} operation - Operation that failed
     * @param {string} reason - Reason for failure
     * @returns {ChineseHoroscopeError}
     */
    static calculationError(operation, reason) {
        return new ChineseHoroscopeError(
            'CALCULATION_ERROR',
            `Calculation failed for '${operation}': ${reason}`,
            { operation, reason }
        );
    }

    /**
     * Create system error
     * @param {string} component - Component that failed
     * @param {string} reason - Reason for failure
     * @returns {ChineseHoroscopeError}
     */
    static systemError(component, reason) {
        return new ChineseHoroscopeError(
            'SYSTEM_ERROR',
            `System error in '${component}': ${reason}`,
            { component, reason }
        );
    }
}

/**
 * Complete Chinese Horoscope Generation System
 * Provides unified interface for all Chinese horoscope types
 */
class ChineseHoroscopeSystem {
    /**
     * Constructor
     * @param {Object} baZiChart - Complete Ba-Zi chart (optional, will be generated if not provided)
     */
    constructor(baZiChart = null) {
        this.baZiChart = baZiChart;
        this.generators = {};

        // Initialize generators when Ba-Zi chart is available
        if (baZiChart) {
            this.initializeGenerators();
        }
    }

    /**
     * Initialize horoscope generators
     * @private
     */
    initializeGenerators() {
        this.generators = {
            daily: new DailyChineseHoroscopeGenerator(this.baZiChart),
            weekly: new WeeklyChineseHoroscopeGenerator(this.baZiChart),
            monthly: new MonthlyChineseHoroscopeGenerator(this.baZiChart),
            yearly: new YearlyChineseHoroscopeGenerator(this.baZiChart)
        };
    }

    /**
     * Set or update Ba-Zi chart
     * @param {Object} baZiChart - Ba-Zi chart data
     */
    setBaZiChart(baZiChart) {
        this.baZiChart = baZiChart;
        this.initializeGenerators();
    }

    /**
     * Validate birth data input
     * @param {Object} birthData - Birth information to validate
     * @returns {boolean} True if valid
     * @throws {ChineseHoroscopeError} If validation fails
     */
    validateBirthData(birthData) {
        if (!birthData || typeof birthData !== 'object') {
            throw ChineseHoroscopeError.validationError('birthData', 'must be a valid object');
        }

        const requiredFields = ['year', 'month', 'day', 'hour', 'minute', 'second'];
        for (const field of requiredFields) {
            if (typeof birthData[field] !== 'number') {
                throw ChineseHoroscopeError.validationError(field, 'must be a number');
            }
        }

        // Validate date ranges
        if (birthData.year < 1900 || birthData.year > 2100) {
            throw ChineseHoroscopeError.validationError('year', 'must be between 1900 and 2100');
        }

        if (birthData.month < 1 || birthData.month > 12) {
            throw ChineseHoroscopeError.validationError('month', 'must be between 1 and 12');
        }

        if (birthData.day < 1 || birthData.day > 31) {
            throw ChineseHoroscopeError.validationError('day', 'must be between 1 and 31');
        }

        if (birthData.hour < 0 || birthData.hour > 23) {
            throw ChineseHoroscopeError.validationError('hour', 'must be between 0 and 23');
        }

        if (birthData.minute < 0 || birthData.minute > 59) {
            throw ChineseHoroscopeError.validationError('minute', 'must be between 0 and 59');
        }

        if (birthData.second < 0 || birthData.second > 59) {
            throw ChineseHoroscopeError.validationError('second', 'must be between 0 and 59');
        }

        // Validate coordinates if provided
        if (birthData.latitude !== undefined) {
            if (typeof birthData.latitude !== 'number' || birthData.latitude < -90 || birthData.latitude > 90) {
                throw ChineseHoroscopeError.validationError('latitude', 'must be a number between -90 and 90');
            }
        }

        if (birthData.longitude !== undefined) {
            if (typeof birthData.longitude !== 'number' || birthData.longitude < -180 || birthData.longitude > 180) {
                throw ChineseHoroscopeError.validationError('longitude', 'must be a number between -180 and 180');
            }
        }

        return true;
    }

    /**
     * Generate Ba-Zi chart from birth data
     * @param {Object} birthData - Birth information
     * @returns {Object} Ba-Zi chart
     * @throws {ChineseHoroscopeError} If generation fails
     */
    generateBaZiChart(birthData) {
        try {
            this.validateBirthData(birthData);
            this.baZiChart = calculateBaZi(birthData);
            this.initializeGenerators();
            return this.baZiChart;
        } catch (error) {
            if (error instanceof ChineseHoroscopeError) {
                throw error;
            }
            throw ChineseHoroscopeError.calculationError('baZiChart', error.message);
        }
    }

    /**
     * Generate horoscope for specified type and date
     * @param {string} type - Horoscope type ('daily', 'weekly', 'monthly', 'yearly')
     * @param {Date} date - Date for horoscope generation
     * @returns {Promise<Object>} Horoscope data
     */
    async generateHoroscope(type, date) {
        if (!this.baZiChart) {
            throw new Error('Ba-Zi chart not available. Generate or set Ba-Zi chart first.');
        }

        const generator = this.generators[type.toLowerCase()];
        if (!generator) {
            throw new Error(`Unsupported horoscope type: ${type}`);
        }

        try {
            switch (type.toLowerCase()) {
                case 'daily':
                    return await generator.generateDailyHoroscope(date);

                case 'weekly':
                    return await generator.generateWeeklyHoroscope(date);

                case 'monthly':
                    return await generator.generateMonthlyHoroscope(
                        date.getFullYear(),
                        date.getMonth()
                    );

                case 'yearly':
                    return await generator.generateYearlyHoroscope(date.getFullYear());

                default:
                    throw new Error(`Unsupported horoscope type: ${type}`);
            }
        } catch (error) {
            throw new Error(`Chinese horoscope generation failed: ${error.message}`);
        }
    }

    /**
     * Generate all horoscope types for current period
     * @param {Date} date - Base date (default: today)
     * @returns {Promise<Object>} All horoscopes
     */
    async generateAllHoroscopes(date = new Date()) {
        if (!this.baZiChart) {
            throw new Error('Ba-Zi chart not available. Generate or set Ba-Zi chart first.');
        }

        const horoscopes = {};

        try {
            // Generate daily horoscope
            horoscopes.daily = await this.generateHoroscope('daily', date);

            // Generate weekly horoscope (starting from Sunday)
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            horoscopes.weekly = await this.generateHoroscope('weekly', weekStart);

            // Generate monthly horoscope
            horoscopes.monthly = await this.generateHoroscope('monthly', date);

            // Generate yearly horoscope
            horoscopes.yearly = await this.generateHoroscope('yearly', date);

            return horoscopes;

        } catch (error) {
            throw new Error(`Complete Chinese horoscope generation failed: ${error.message}`);
        }
    }

    /**
     * Validate horoscope accuracy
     * @param {Object} horoscope - Generated horoscope
     * @param {Object} referenceData - Reference data for validation
     * @returns {Object} Validation results
     */
    validateHoroscope(horoscope, referenceData) {
        const validations = {
            animalSignMatch: horoscope.animalSign === referenceData.animalSign,
            ratingReasonable: this.isRatingReasonable(horoscope.predictions.overall.rating),
            categoriesPresent: Object.keys(horoscope.predictions.categories).length === 6,
            dateRangeValid: horoscope.dateRange.start <= horoscope.dateRange.end
        };

        const overallAccuracy = Object.values(validations).every(v => v);

        return {
            isAccurate: overallAccuracy,
            validations: validations,
            accuracy: overallAccuracy ? 'High' : 'Needs Review'
        };
    }

    /**
     * Check if rating is reasonable
     * @param {string} rating - Rating string
     * @returns {boolean} True if reasonable
     */
    isRatingReasonable(rating) {
        const validRatings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Challenging', 'Difficult'];
        return validRatings.includes(rating);
    }

    /**
     * Get system status and capabilities
     * @returns {Object} System information
     */
    getSystemInfo() {
        return {
            version: '2.4',
            supportedTypes: ['daily', 'weekly', 'monthly', 'yearly'],
            hasBaZiChart: !!this.baZiChart,
            generatorsInitialized: Object.keys(this.generators).length > 0,
            capabilities: {
                astronomicalCalculations: true,
                elementalAnalysis: true,
                animalCompatibility: true,
                multiTimeframe: true,
                personalizedPredictions: true
            }
        };
    }

    /**
     * Health check for the system
     * @returns {Object} Health status
     */
    healthCheck() {
        const info = this.getSystemInfo();
        const issues = [];

        if (!info.hasBaZiChart) {
            issues.push('No Ba-Zi chart loaded');
        }

        if (!info.generatorsInitialized) {
            issues.push('Generators not initialized');
        }

        return {
            status: issues.length === 0 ? 'healthy' : 'degraded',
            issues: issues,
            timestamp: new Date().toISOString()
        };
    }
}

// Export factory function for easier usage
function createChineseHoroscopeSystem(birthData = null) {
    const system = new ChineseHoroscopeSystem();

    if (birthData) {
        system.generateBaZiChart(birthData);
    }

    return system;
}

// Usage example and validation
function validateSystem() {
    try {
        const system = createChineseHoroscopeSystem();

        // Example birth data
        const birthData = {
            year: 1990,
            month: 5,
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 39.9042,
            longitude: 116.4074
        };

        system.generateBaZiChart(birthData);
        return system.healthCheck();
    } catch (error) {
        return {
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    ChineseHoroscopeSystem,
    ChineseHoroscopeError,
    createChineseHoroscopeSystem,
    validateSystem
};