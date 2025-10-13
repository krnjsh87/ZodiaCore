/**
 * ZC4.2 Personal Year/Month/Day Cycles Utilities
 * @version 1.0.0
 * @author ZodiaCore Development Team
 *
 * Core utility functions for the ZC4.2 Personal Cycles Calculator
 * Includes mathematical functions, validation, and helper methods
 */

const {
    CYCLE_CONSTANTS,
    ERROR_MESSAGES,
    MONTH_NAMES,
    DAY_NAMES,
    NUMEROLOGICAL_SYSTEMS
} = require('./zc4-2-personal-cycles-constants');

/**
 * Validate and parse birth date
 * @param {string|Date} birthDate - Birth date to validate
 * @returns {Date} Validated Date object
 * @throws {PersonalCyclesError} If date is invalid
 */
function validateBirthDate(birthDate) {
    let date;

    try {
        if (birthDate instanceof Date) {
            date = birthDate;
        } else if (typeof birthDate === 'string') {
            date = new Date(birthDate);
        } else {
            throw new Error(ERROR_MESSAGES.INVALID_BIRTH_DATE);
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            throw new Error(ERROR_MESSAGES.INVALID_BIRTH_DATE);
        }

        // Check if birth date is not in the future
        const now = new Date();
        if (date > now) {
            throw new Error(ERROR_MESSAGES.FUTURE_BIRTH_DATE);
        }

        return date;
    } catch (error) {
        throw new PersonalCyclesError(`${ERROR_MESSAGES.INVALID_BIRTH_DATE}: ${error.message}`);
    }
}

/**
 * Validate target date
 * @param {string|Date} targetDate - Target date to validate
 * @returns {Date} Validated Date object
 * @throws {PersonalCyclesError} If date is invalid
 */
function validateTargetDate(targetDate) {
    let date;

    try {
        if (targetDate instanceof Date) {
            date = targetDate;
        } else if (typeof targetDate === 'string') {
            date = new Date(targetDate);
        } else {
            throw new Error(ERROR_MESSAGES.INVALID_TARGET_DATE);
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            throw new Error(ERROR_MESSAGES.INVALID_TARGET_DATE);
        }

        return date;
    } catch (error) {
        throw new PersonalCyclesError(`${ERROR_MESSAGES.INVALID_TARGET_DATE}: ${error.message}`);
    }
}

/**
 * Reduce number to single digit using Pythagorean method
 * @param {number} number - Number to reduce
 * @returns {number} Single digit (1-9)
 * @throws {PersonalCyclesError} If input is invalid
 */
function reduceToSingleDigit(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new PersonalCyclesError(ERROR_MESSAGES.INVALID_NUMBER);
    }

    if (number <= 9) return number;

    // For cycles, master numbers are reduced
    if (CYCLE_CONSTANTS.MASTER_NUMBERS.includes(number)) {
        return reduceToSingleDigit(number - 9);
    }

    let sum = 0;
    while (number > 0) {
        sum += number % 10;
        number = Math.floor(number / 10);
    }

    return sum > 9 ? reduceToSingleDigit(sum) : sum;
}

/**
 * Calculate compound number (sum of digits)
 * @param {number} number - Number to process
 * @returns {number} Sum of all digits
 * @throws {PersonalCyclesError} If input is invalid
 */
function calculateCompoundNumber(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        throw new PersonalCyclesError(ERROR_MESSAGES.INVALID_NUMBER);
    }

    let sum = 0;
    const numStr = Math.abs(number).toString();

    for (let digit of numStr) {
        sum += parseInt(digit);
    }

    return sum;
}

/**
 * Get month name from month number
 * @param {number} monthNumber - Month number (1-12)
 * @returns {string} Month name
 */
function getMonthName(monthNumber) {
    if (monthNumber < 1 || monthNumber > 12) {
        throw new PersonalCyclesError(ERROR_MESSAGES.INVALID_MONTH);
    }
    return MONTH_NAMES[monthNumber - 1];
}

/**
 * Get day of week name from date
 * @param {Date} date - Date object
 * @returns {string} Day of week name
 */
function getDayOfWeek(date) {
    return DAY_NAMES[date.getDay()];
}

/**
 * Calculate position in 9-year cycle
 * @param {Date} birthDate - Birth date
 * @param {number} currentYear - Current year
 * @returns {object} Cycle position information
 */
function calculateYearCyclePosition(birthDate, currentYear) {
    const birthYear = birthDate.getFullYear();
    const yearsSinceBirth = currentYear - birthYear;
    const cycleNumber = Math.floor(yearsSinceBirth / 9) + 1;
    const positionInCycle = (yearsSinceBirth % 9) + 1;

    return {
        yearsSinceBirth: yearsSinceBirth,
        cycleNumber: cycleNumber,
        positionInCycle: positionInCycle,
        nextCycleStart: birthYear + (cycleNumber * 9)
    };
}

/**
 * Validate numerological system
 * @param {string} system - System to validate
 * @returns {string} Validated system
 * @throws {PersonalCyclesError} If system is invalid
 */
function validateSystem(system) {
    const validSystems = Object.values(NUMEROLOGICAL_SYSTEMS);
    if (!validSystems.includes(system)) {
        throw new PersonalCyclesError(ERROR_MESSAGES.INVALID_SYSTEM);
    }
    return system;
}

/**
 * Calculate number compatibility (difference-based)
 * @param {number} num1 - First number
 * @param {number} num2 - Second number
 * @returns {number} Compatibility score (0-1, higher is better)
 */
function calculateNumberCompatibility(num1, num2) {
    const diff = Math.abs(num1 - num2);
    // Maximum difference is 8 (1-9), so compatibility = 1 - (diff/8)
    return Math.max(0, 1 - (diff / 8));
}

/**
 * Custom error class for Personal Cycles
 */
class PersonalCyclesError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PersonalCyclesError';
    }
}

module.exports = {
    validateBirthDate,
    validateTargetDate,
    reduceToSingleDigit,
    calculateCompoundNumber,
    getMonthName,
    getDayOfWeek,
    calculateYearCyclePosition,
    validateSystem,
    calculateNumberCompatibility,
    PersonalCyclesError
};