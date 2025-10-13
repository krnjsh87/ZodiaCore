/**
 * ZodiaCore ZC4.3 - Numerology-Timing Utilities
 *
 * Advanced utility functions for numerology-timing calculations.
 * Provides enhanced number reduction, compatibility analysis, and timing functions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ZC43_NUMEROLOGY_CONSTANTS, ZC43_NUMBER_SIGNIFICANCES } = require('./zc4-3-constants');
const { validateBirthDate, validateFullName, NumerologyError } = require('./numerology-utils');

/**
 * Advanced number reduction with master number preservation
 * @param {number} number - Number to reduce
 * @param {boolean} preserveMaster - Whether to preserve master numbers
 * @returns {number} Reduced number
 */
function reduceToSingleDigitAdvanced(number, preserveMaster = true) {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new NumerologyError('Invalid number provided for reduction');
    }

    if (number <= 9) return number;

    let sum = 0;
    while (number > 0) {
        sum += number % 10;
        number = Math.floor(number / 10);
    }

    // Preserve master numbers if requested
    if (preserveMaster && ZC43_NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(sum)) {
        return sum;
    }

    return sum > 9 ? reduceToSingleDigitAdvanced(sum, preserveMaster) : sum;
}

/**
 * Calculate numerological compatibility between two numbers
 * @param {number} num1 - First number
 * @param {number} num2 - Second number
 * @returns {number} Compatibility score (0-1)
 */
function calculateNumberCompatibility(num1, num2) {
    const reduced1 = reduceToSingleDigitAdvanced(num1);
    const reduced2 = reduceToSingleDigitAdvanced(num2);

    // Direct match
    if (reduced1 === reduced2) return 1.0;

    // Master number compatibility
    if (ZC43_NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(reduced1) ||
        ZC43_NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(reduced2)) {
        return 0.8;
    }

    // Compound compatibility
    const compound = reduceToSingleDigitAdvanced(reduced1 + reduced2);
    const diff = Math.abs(reduced1 - reduced2);

    // Harmonic relationships
    if (compound === 9 || diff === 1 || diff === 8) return 0.7;
    if (compound === 6 || diff === 2 || diff === 7) return 0.6;
    if (compound === 3 || diff === 3 || diff === 6) return 0.5;

    return 0.3; // Low compatibility
}

/**
 * Get number significance with timing information
 * @param {number} number - Number to analyze
 * @returns {object} Enhanced number significance
 */
function getNumberSignificance(number) {
    const reduced = reduceToSingleDigitAdvanced(number);
    const baseSignificance = ZC43_NUMBER_SIGNIFICANCES[reduced] || {
        name: 'Unknown',
        qualities: ['Undefined'],
        timingQualities: ['Undefined']
    };

    return {
        number: reduced,
        ...baseSignificance,
        isMasterNumber: ZC43_NUMEROLOGY_CONSTANTS.MASTER_NUMBERS.includes(reduced),
        planetaryRuler: ZC43_NUMEROLOGY_CONSTANTS.PLANETARY_NUMBERS[
            Object.keys(ZC43_NUMEROLOGY_CONSTANTS.PLANETARY_NUMBERS)[reduced - 1]
        ]
    };
}

/**
 * Calculate name number using specified system
 * @param {string} name - Full name
 * @param {object} alphabet - Alphabet mapping
 * @returns {number} Name number
 */
function calculateNameNumber(name, alphabet) {
    const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
    let sum = 0;

    for (const char of cleanName) {
        const value = alphabet[char] || 0;
        if (!alphabet[char]) {
            console.warn(`Unknown character in alphabet: ${char}`);
        }
        sum += value;
    }

    return sum;
}

/**
 * Get time of day category
 * @param {number} hour - Hour (0-23)
 * @returns {string} Time of day
 */
function getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
}

/**
 * Calculate timing significance for a number
 * @param {number} number - Number to analyze
 * @param {Date} birthDate - Birth date for context
 * @returns {object} Timing significance analysis
 */
function calculateTimingSignificance(number, birthDate) {
    const planetaryData = ZC43_NUMEROLOGY_CONSTANTS.PLANETARY_NUMBERS[
        Object.keys(ZC43_NUMEROLOGY_CONSTANTS.PLANETARY_NUMBERS)[number - 1]
    ];

    const birthHour = birthDate.getHours();
    const timeOfDay = getTimeOfDay(birthHour);

    return {
        rulingPlanet: Object.keys(ZC43_NUMEROLOGY_CONSTANTS.PLANETARY_NUMBERS)[number - 1],
        auspiciousHours: planetaryData.auspiciousHours,
        timingWeight: planetaryData.timingWeight,
        birthTimeCompatibility: planetaryData.auspiciousHours.includes(birthHour) ? 0.9 : 0.6,
        timeOfDayPreference: ZC43_NUMEROLOGY_CONSTANTS.TIMING_COMPATIBILITY[number][timeOfDay]
    };
}

/**
 * Calculate personal year number (integration with ZC4.2)
 * @param {Date} birthDate - Birth date
 * @param {number} currentYear - Current year
 * @returns {number} Personal year number
 */
function calculatePersonalYearNumber(birthDate, currentYear) {
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();

    // Universal year number - sum digits and reduce
    const universalYear = currentYear.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    const reducedUniversal = universalYear > 9 ? reduceToSingleDigitAdvanced(universalYear) : universalYear;

    // Personal year calculation
    const personalYear = reduceToSingleDigitAdvanced(birthMonth + birthDay + reducedUniversal);

    return personalYear;
}

/**
 * Generate timing recommendations for a number
 * @param {number} destinyNumber - Destiny number
 * @param {Date} birthDate - Birth date
 * @returns {Array} Timing recommendations
 */
function generateTimingRecommendations(destinyNumber, birthDate) {
    const recommendations = [];
    const timingSignificance = calculateTimingSignificance(destinyNumber, birthDate);

    recommendations.push({
        type: 'auspicious_hours',
        description: `Best hours: ${timingSignificance.auspiciousHours.join(', ')}`,
        confidence: timingSignificance.timingWeight
    });

    const timeOfDay = getTimeOfDay(birthDate.getHours());
    const timePreference = ZC43_NUMEROLOGY_CONSTANTS.TIMING_COMPATIBILITY[destinyNumber][timeOfDay];

    recommendations.push({
        type: 'time_of_day',
        description: `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} activities are ${timePreference > 0.7 ? 'highly' : 'moderately'} favorable`,
        confidence: timePreference
    });

    return recommendations;
}

/**
 * Calculate challenge numbers from birth date
 * @param {string|Date} birthDate - Birth date
 * @returns {object} Challenge numbers analysis
 */
function calculateChallengeNumbers(birthDate) {
    const date = validateBirthDate(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const challenges = {
        first: Math.abs(reduceToSingleDigitAdvanced(day) - reduceToSingleDigitAdvanced(month)),
        second: Math.abs(reduceToSingleDigitAdvanced(month) - reduceToSingleDigitAdvanced(year)),
        third: Math.abs(reduceToSingleDigitAdvanced(day) - reduceToSingleDigitAdvanced(year)),
        fourth: Math.abs(reduceToSingleDigitAdvanced(day + month) - reduceToSingleDigitAdvanced(year))
    };

    return {
        challenges: challenges,
        dominant: Object.entries(challenges).reduce((a, b) => challenges[a[0]] > challenges[b[0]] ? a : b)[0],
        summary: `Primary challenge number: ${challenges.first}`
    };
}

/**
 * Calculate maturity number
 * @param {string|Date} birthDate - Birth date
 * @param {string} fullName - Full name
 * @param {string} system - Numerology system
 * @returns {object} Maturity number analysis
 */
function calculateMaturityNumber(birthDate, fullName, system = 'vedic') {
    const date = validateBirthDate(birthDate);
    const name = validateFullName(fullName);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Life path number
    const lifePath = reduceToSingleDigitAdvanced(day + month + year);

    // Destiny number
    const alphabet = system === 'vedic' ? ZC43_NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET :
                   system === 'pythagorean' ? ZC43_NUMEROLOGY_CONSTANTS.PYTHAGOREAN_ALPHABET :
                   ZC43_NUMEROLOGY_CONSTANTS.CHALDEAN_ALPHABET;

    const destinySum = calculateNameNumber(name, alphabet);
    const destiny = reduceToSingleDigitAdvanced(destinySum);

    // Maturity number
    const maturity = reduceToSingleDigitAdvanced(lifePath + destiny);

    return {
        maturityNumber: maturity,
        components: { lifePath, destiny },
        significance: getNumberSignificance(maturity),
        activationAge: 35 + (maturity * 9) // Rough estimate
    };
}

/**
 * Validate activity type for ZC4.3
 * @param {string} activityType - Activity type to validate
 * @throws {NumerologyError} If invalid
 */
function validateActivityType(activityType) {
    const validActivities = Object.keys(ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS);
    if (!activityType || !validActivities.includes(activityType)) {
        throw new NumerologyError(`Invalid activity type. Must be one of: ${validActivities.join(', ')}`);
    }
}

/**
 * Calculate name-derived numbers
 * @param {string} fullName - Full name
 * @returns {Array} Derived numbers
 */
function calculateNameDerivedNumbers(fullName) {
    const name = validateFullName(fullName);
    const words = name.split(' ').filter(word => word.length > 0);
    const numbers = [];

    // First name number
    if (words[0]) {
        const firstNameSum = calculateNameNumber(words[0], ZC43_NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET);
        numbers.push(reduceToSingleDigitAdvanced(firstNameSum));
    }

    // Last name number
    if (words[words.length - 1] && words.length > 1) {
        const lastNameSum = calculateNameNumber(words[words.length - 1], ZC43_NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET);
        numbers.push(reduceToSingleDigitAdvanced(lastNameSum));
    }

    // Middle name number (if exists)
    if (words.length > 2) {
        const middleNames = words.slice(1, -1).join(' ');
        const middleSum = calculateNameNumber(middleNames, ZC43_NUMEROLOGY_CONSTANTS.VEDIC_ALPHABET);
        numbers.push(reduceToSingleDigitAdvanced(middleSum));
    }

    return [...new Set(numbers)]; // Remove duplicates
}

module.exports = {
    reduceToSingleDigitAdvanced,
    calculateNumberCompatibility,
    getNumberSignificance,
    calculateNameNumber,
    getTimeOfDay,
    calculateTimingSignificance,
    calculatePersonalYearNumber,
    generateTimingRecommendations,
    calculateChallengeNumbers,
    calculateMaturityNumber,
    validateActivityType,
    calculateNameDerivedNumbers
};