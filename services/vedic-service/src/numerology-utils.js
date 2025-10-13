/**
 * ZodiaCore - Numerology Utility Functions
 *
 * Core mathematical functions for numerological calculations.
 * Includes number reduction, significance mapping, and validation functions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    NUMEROLOGY_CONSTANTS,
    NUMBER_SIGNIFICANCES
} = require('./numerology-constants');

/**
 * Reduce number to single digit using Vedic method
 * @param {number} number - Number to reduce
 * @returns {number} Single digit number (1-9) or master number
 */
function reduceToSingleDigit(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new NumerologyError('Invalid number provided for reduction');
    }

    if (number <= 9) return number;

    let sum = 0;
    while (number > 0) {
        sum += number % 10;
        number = Math.floor(number / 10);
    }

    // If sum is master number, keep it
    if (NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(sum)) {
        return sum;
    }

    // Continue reduction if needed
    return sum > 9 ? reduceToSingleDigit(sum) : sum;
}

/**
 * Calculate compound number (sum of digits)
 * @param {number} number - Number to calculate compound for
 * @returns {number} Sum of all digits
 */
function calculateCompoundNumber(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new NumerologyError('Invalid number provided for compound calculation');
    }

    let sum = 0;
    const numStr = Math.abs(number).toString();

    for (let digit of numStr) {
        sum += parseInt(digit);
    }

    return sum;
}

/**
 * Get numerological significance of a number
 * @param {number} number - Number to get significance for
 * @returns {object} Significance object with name and qualities
 */
function getNumberSignificance(number) {
    const singleDigit = reduceToSingleDigit(number);

    return NUMBER_SIGNIFICANCES[singleDigit] || {
        name: 'Unknown',
        qualities: []
    };
}

/**
 * Validate birth date format
 * @param {string|Date} birthDate - Birth date to validate
 * @returns {Date} Validated Date object
 */
function validateBirthDate(birthDate) {
    if (!birthDate) {
        throw new NumerologyError('Birth date is required');
    }

    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
        throw new NumerologyError('Invalid birth date format');
    }

    // Check if date is not in future
    const now = new Date();
    if (date > now) {
        throw new NumerologyError('Birth date cannot be in the future');
    }

    return date;
}

/**
 * Custom error class for numerology calculations
 */
class NumerologyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NumerologyError';
    }
}

/**
 * Validate full name for numerology
 * @param {string} fullName - Name to validate
 * @returns {string} Cleaned and validated name
 */
function validateFullName(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        throw new NumerologyError('Full name is required and must be a string');
    }

    // Enhanced sanitization: remove potentially dangerous characters and limit length
    const sanitized = fullName
        .trim()
        .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
        .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
        .substring(0, 100); // Limit length to prevent abuse

    if (sanitized.length < 2) {
        throw new NumerologyError('Full name must be at least 2 characters long');
    }

    // Check for at least one alphabetic character
    if (!/[a-zA-Z]/.test(sanitized)) {
        throw new NumerologyError('Full name must contain at least one alphabetic character');
    }

    return sanitized;
}

/**
 * Calculate name number using specified alphabet system
 * @param {string} name - Name to calculate
 * @param {object} alphabet - Alphabet mapping to use
 * @returns {number} Calculated number
 */
function calculateNameNumber(name, alphabet) {
    const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
    let sum = 0;

    for (let char of cleanName) {
        sum += alphabet[char] || 0;
    }

    return sum;
}

/**
 * Check if number is a master number
 * @param {number} number - Number to check
 * @returns {boolean} True if master number
 */
function isMasterNumber(number) {
    return NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(number);
}

/**
 * Get planetary ruler for a number
 * @param {number} number - Number to get ruler for
 * @returns {string} Planet name
 */
function getRulingPlanet(number) {
    const singleDigit = reduceToSingleDigit(number);
    const planetMap = {
        1: 'SUN',
        2: 'MOON',
        3: 'JUPITER',
        4: 'RAHU',
        5: 'MERCURY',
        6: 'VENUS',
        7: 'KETU',
        8: 'SATURN',
        9: 'MARS'
    };
    return planetMap[singleDigit] || 'SUN';
}

/**
 * Calculate compatibility score between two numbers
 * @param {number} num1 - First number
 * @param {number} num2 - Second number
 * @returns {number} Compatibility score (0-1)
 */
function calculateNumberCompatibility(num1, num2) {
    const reduced1 = reduceToSingleDigit(num1);
    const reduced2 = reduceToSingleDigit(num2);

    // Direct match
    if (reduced1 === reduced2) return 1.0;

    // Compound compatibility (difference of 3 or less)
    const diff = Math.abs(reduced1 - reduced2);
    if (diff <= 3) return (4 - diff) / 4;

    // Planetary friendship compatibility
    const planet1 = getRulingPlanet(reduced1);
    const planet2 = getRulingPlanet(reduced2);

    // Simple friendship check (can be expanded)
    const friendlyPairs = [
        ['SUN', 'MOON'], ['SUN', 'MARS'], ['SUN', 'JUPITER'],
        ['MOON', 'MERCURY'], ['MARS', 'JUPITER'], ['MERCURY', 'VENUS'],
        ['VENUS', 'SATURN']
    ];

    const isFriendly = friendlyPairs.some(([p1, p2]) =>
        (planet1 === p1 && planet2 === p2) || (planet1 === p2 && planet2 === p1)
    );

    return isFriendly ? 0.5 : 0.0;
}

/**
 * Generate unique numbers from array
 * @param {number[]} numbers - Array of numbers
 * @returns {number[]} Array of unique numbers
 */
function getUniqueNumbers(numbers) {
    return [...new Set(numbers.map(n => reduceToSingleDigit(n)))];
}

/**
 * Validate activity type
 * @param {string} activityType - Activity type to validate
 * @returns {string} Validated activity type
 */
function validateActivityType(activityType) {
    const validActivities = [
        'marriage', 'business', 'education', 'travel',
        'health', 'career', 'finance'
    ];

    if (!activityType || !validActivities.includes(activityType)) {
        throw new Error(`Invalid activity type. Must be one of: ${validActivities.join(', ')}`);
    }

    return activityType;
}

module.exports = {
    NumerologyError,
    reduceToSingleDigit,
    calculateCompoundNumber,
    getNumberSignificance,
    validateBirthDate,
    validateFullName,
    calculateNameNumber,
    isMasterNumber,
    getRulingPlanet,
    calculateNumberCompatibility,
    getUniqueNumbers,
    validateActivityType
};