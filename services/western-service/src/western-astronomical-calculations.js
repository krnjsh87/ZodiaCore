/**
 * Western Astrology Astronomical Calculations
 *
 * This module provides core astronomical calculations for Western astrology,
 * including Julian Day calculations and sidereal time computations.
 *
 * @version 1.0.0
 * @since 2025-10-08
 */

const { WESTERN_ASTRO_CONSTANTS } = require('./western-astro-constants');
const { normalizeAngle } = require('./western-math-utils');

/**
 * Validation Error for input validation failures
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Calculate Julian Day Number from Gregorian Date
 * @param {number} year - Year (e.g., 2025)
 * @param {number} month - Month (1-12)
 * @param {number} day - Day (1-31)
 * @param {number} hour - Hour (0-23, default 0)
 * @param {number} minute - Minute (0-59, default 0)
 * @param {number} second - Second (0-59, default 0)
 * @param {number} timezoneOffset - Timezone offset from UTC in hours (default 0)
 * @returns {number} Julian Day Number
 * @throws {ValidationError} If input validation fails
 */
function calculateJulianDay(year, month, day, hour = 0, minute = 0, second = 0, timezoneOffset = 0) {
    // Input validation for Gregorian dates
    if (year < 1582 || year > 2100) {
        throw new ValidationError('Year must be between 1582 and 2100 (Gregorian calendar range)');
    }
    if (month < 1 || month > 12) {
        throw new ValidationError('Month must be between 1 and 12');
    }
    if (hour < 0 || hour > 23) {
        throw new ValidationError('Hour must be between 0 and 23');
    }
    if (minute < 0 || minute > 59) {
        throw new ValidationError('Minute must be between 0 and 59');
    }
    if (second < 0 || second > 59) {
        throw new ValidationError('Second must be between 0 and 59');
    }
    if (timezoneOffset < -12 || timezoneOffset > 14) {
        throw new ValidationError('Timezone offset must be between -12 and 14 hours');
    }

    // Validate day based on month and leap year
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let maxDays = daysInMonth[month - 1];

    // Check for leap year (February has 29 days)
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
        maxDays = 29;
    }

    if (day < 1 || day > maxDays) {
        throw new Error(`Day must be between 1 and ${maxDays} for month ${month}`);
    }

    // Convert local time to UTC
    const utcHour = hour - timezoneOffset;

    // Convert time to decimal day
    const decimalDay = day + (utcHour + minute / WESTERN_ASTRO_CONSTANTS.MINUTES_PER_DEGREE + second / WESTERN_ASTRO_CONSTANTS.SECONDS_PER_DAY) / 24;

    // Adjust for January and February
    if (month <= 2) {
        year -= 1;
        month += 12;
    }

    // Calculate Julian Day
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD = Math.floor(WESTERN_ASTRO_CONSTANTS.TROPICAL_YEAR * (year + 4716)) +
               Math.floor(30.6001 * (month + 1)) +
               decimalDay + B - 1524.5;

    return JD;
}

/**
 * Calculate Julian Centuries from J2000.0
 * @param {number} julianDay - Julian Day Number
 * @returns {number} Julian Centuries from J2000.0
 */
function calculateJulianCenturies(julianDay) {
    return (julianDay - WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000) / WESTERN_ASTRO_CONSTANTS.JULIAN_CENTURY;
}

/**
 * Calculate Greenwich Mean Sidereal Time
 * @param {number} julianDay - Julian Day Number
 * @returns {number} GMST in degrees
 */
function calculateGMST(julianDay) {
    const T = (julianDay - WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000) / WESTERN_ASTRO_CONSTANTS.JULIAN_CENTURY;

    // GMST at 0h UT
    let gmst0 = 280.46061837 + 360.98564736629 * (julianDay - WESTERN_ASTRO_CONSTANTS.JULIAN_DAY_J2000) +
                0.000387933 * T * T - T * T * T / 38710000;

    return normalizeAngle(gmst0);
}

/**
 * Calculate Local Sidereal Time
 * @param {number} gmst - Greenwich Mean Sidereal Time in degrees
 * @param {number} longitude - Geographical longitude in degrees (East positive)
 * @returns {number} Local Sidereal Time in degrees
 */
function calculateLST(gmst, longitude) {
    return normalizeAngle(gmst + longitude);
}

module.exports = {
    calculateJulianDay,
    calculateJulianCenturies,
    calculateGMST,
    calculateLST,
    ValidationError
};