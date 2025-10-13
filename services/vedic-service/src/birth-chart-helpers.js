/**
 * ZodiaCore Birth Chart Helper Functions (ZC1.2)
 *
 * Utility functions for birth chart data manipulation and validation.
 * Extracted for reusability and maintainability.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

/**
 * Extract birth date from birth chart data
 * @param {Object} birthChart - Complete birth chart data
 * @returns {Date} JavaScript Date object
 * @throws {Error} If birth chart data is invalid
 */
function getBirthDate(birthChart) {
    // Input validation
    if (!birthChart || typeof birthChart !== 'object') {
        throw new Error('Invalid birth chart: must be an object');
    }
    if (!birthChart.birthData || typeof birthChart.birthData !== 'object') {
        throw new Error('Invalid birth data in birth chart');
    }

    const { year, month, day } = birthChart.birthData;

    if (typeof year !== 'number' || year < 1900 || year > 2100) {
        throw new Error('Invalid birth year: must be between 1900 and 2100');
    }
    if (typeof month !== 'number' || month < 1 || month > 12) {
        throw new Error('Invalid birth month: must be between 1 and 12');
    }
    if (typeof day !== 'number' || day < 1 || day > 31) {
        throw new Error('Invalid birth day: must be between 1 and 31');
    }

    // JavaScript Date months are 0-based
    return new Date(year, month - 1, day);
}

/**
 * Validate complete birth chart data structure
 * @param {Object} birthChart - Complete birth chart data
 * @throws {Error} If validation fails
 */
function validateBirthChart(birthChart) {
    if (!birthChart || typeof birthChart !== 'object') {
        throw new Error('Invalid birth chart: must be an object');
    }

    // Validate birth data
    if (!birthChart.birthData || typeof birthChart.birthData !== 'object') {
        throw new Error('Invalid birth data in birth chart');
    }

    const { year, month, day } = birthChart.birthData;
    if (typeof year !== 'number' || year < 1900 || year > 2100) {
        throw new Error('Invalid birth year: must be between 1900 and 2100');
    }
    if (typeof month !== 'number' || month < 1 || month > 12) {
        throw new Error('Invalid birth month: must be between 1 and 12');
    }
    if (typeof day !== 'number' || day < 1 || day > 31) {
        throw new Error('Invalid birth day: must be between 1 and 31');
    }

    // Validate dasha balance
    if (!birthChart.dasha || !birthChart.dasha.balance) {
        throw new Error('Invalid dasha balance in birth chart');
    }

    // Validate planets data
    if (!birthChart.planets || typeof birthChart.planets !== 'object') {
        throw new Error('Invalid planets data in birth chart');
    }
}

/**
 * Validate analysis date
 * @param {Date} analysisDate - Date for analysis
 * @throws {Error} If date is invalid
 */
function validateAnalysisDate(analysisDate) {
    if (!(analysisDate instanceof Date) || isNaN(analysisDate.getTime())) {
        throw new Error('Invalid analysis date: must be a valid Date object');
    }
}

/**
 * Validate target date for dasha/transit calculations
 * @param {Date} targetDate - Target date
 * @throws {Error} If date is invalid
 */
function validateTargetDate(targetDate) {
    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
        throw new Error('Invalid target date: must be a valid Date object');
    }
}

module.exports = {
    getBirthDate,
    validateBirthChart,
    validateAnalysisDate,
    validateTargetDate
};