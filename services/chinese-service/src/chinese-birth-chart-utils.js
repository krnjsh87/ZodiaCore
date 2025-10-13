// Chinese Birth Chart Utility Functions
// Mathematical and astronomical utility functions for Chinese astrology calculations

const { CHINESE_ASTRO_CONSTANTS } = require('./chinese-birth-chart-constants');

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180.0;
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
function radToDeg(radians) {
    return radians * 180.0 / Math.PI;
}

/**
 * Normalize angle to 0-360 degrees
 * @param {number} angle - Angle in degrees
 * @returns {number} Normalized angle
 */
function normalizeAngle(angle) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
}

/**
 * Calculate modulo operation (handles negative numbers correctly)
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Modulo result
 */
function mod(a, b) {
    return ((a % b) + b) % b;
}

/**
 * Convert Gregorian date to Julian Day Number
 * @param {number} year - Gregorian year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @param {number} hour - Hour (0-23, default 0)
 * @param {number} minute - Minute (0-59, default 0)
 * @param {number} second - Second (0-59, default 0)
 * @param {number} timezoneOffset - Timezone offset in hours (default 0)
 * @returns {number} Julian Day Number
 */
function gregorianToJulianDay(year, month, day, hour = 0, minute = 0, second = 0, timezoneOffset = 0) {
    // Adjust time for timezone offset to get UTC
    let utcHour = hour - timezoneOffset;
    let utcDay = day;
    let utcMonth = month;
    let utcYear = year;

    // Handle day/month/year adjustments for timezone
    if (utcHour < 0) {
        utcHour += 24;
        utcDay -= 1;
        if (utcDay < 1) {
            utcMonth -= 1;
            if (utcMonth < 1) {
                utcMonth = 12;
                utcYear -= 1;
            }
            // Get days in previous month
            const prevMonthDays = getDaysInMonth(utcYear, utcMonth);
            utcDay = prevMonthDays;
        }
    } else if (utcHour >= 24) {
        utcHour -= 24;
        utcDay += 1;
        const daysInMonth = getDaysInMonth(utcYear, utcMonth);
        if (utcDay > daysInMonth) {
            utcDay = 1;
            utcMonth += 1;
            if (utcMonth > 12) {
                utcMonth = 1;
                utcYear += 1;
            }
        }
    }

    if (utcMonth <= 2) {
        utcYear -= 1;
        utcMonth += 12;
    }

    const A = Math.floor(utcYear / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD = Math.floor(365.25 * (utcYear + 4716)) +
               Math.floor(30.6001 * (utcMonth + 1)) +
               utcDay + B - 1524.5;

    // Add fractional day
    const fractionalDay = (utcHour + minute/60 + second/3600) / 24;
    return JD + fractionalDay;
}

/**
 * Get number of days in a month
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {number} Days in month
 */
function getDaysInMonth(year, month) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(year)) {
        return 29;
    }
    return daysInMonth[month - 1];
}

/**
 * Check if year is leap year
 * @param {number} year - Year
 * @returns {boolean} True if leap year
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Convert Julian Day to Gregorian date
 * @param {number} jd - Julian Day Number
 * @returns {Object} Gregorian date object
 */
function julianDayToGregorian(jd) {
    const Z = Math.floor(jd + 0.5);
    const F = jd + 0.5 - Z;
    let A = Z;

    if (Z >= 2299161) {
        const alpha = Math.floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + alpha - Math.floor(alpha / 4);
    }

    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);

    const day = B - D - Math.floor(30.6001 * E) + F;
    let month = E - 1;
    let year = C - 4715;

    if (E > 13) {
        month = E - 13;
        year = C - 4716;
    }

    return {
        year: Math.floor(year),
        month: Math.floor(month),
        day: Math.floor(day),
        hour: Math.floor((day % 1) * 24),
        minute: Math.floor(((day % 1) * 24 % 1) * 60),
        second: Math.floor((((day % 1) * 24 % 1) * 60 % 1) * 60)
    };
}

/**
 * Calculate new moon dates using astronomical algorithms
 * @param {number} year - Gregorian year
 * @returns {Array} Array of new moon Julian Days for the year
 */
function calculateNewMoons(year) {
    const newMoons = [];
    const k = Math.floor((year - 1900) * 12.3685) - 1; // Approximate k value

    for (let i = 0; i < 13; i++) { // Calculate 13 months to be safe
        const T = (k + i) / 1236.85; // Time in Julian centuries

        // Simplified new moon calculation ( Meeus algorithm approximation)
        let JDE = 2451550.09765 + 29.530588853 * (k + i) +
                  0.0001337 * T * T - 0.000000150 * T * T * T +
                  0.00000000073 * T * T * T * T;

        // Add corrections for perturbations (simplified)
        const M = degToRad(2.5534 + 29.10535669 * (k + i));
        const Mprime = degToRad(201.5643 + 385.81693528 * (k + i));
        const F = degToRad(160.7108 + 390.67050274 * (k + i));

        JDE += 0.000001734 * Math.sin(M) +
               -0.000001496 * Math.sin(Mprime) +
               -0.000000126 * Math.sin(F);

        newMoons.push(JDE);
    }

    return newMoons.filter(jd => {
        const date = julianDayToGregorian(jd);
        return date.year === year;
    });
}

/**
 * Calculate 24 solar terms for a given year
 * @param {number} year - Gregorian year
 * @returns {Array} Array of solar term dates
 */
function calculateSolarTerms(year) {
    const { SOLAR_TERM_NAMES, CHINESE_ASTRO_CONSTANTS } = require('./chinese-birth-chart-constants');
    const solarTerms = [];
    const baseLongitude = 270; // Winter solstice reference

    for (let i = 0; i < 24; i++) {
        const targetLongitude = (baseLongitude + i * 15) % 360;
        const jd = findSolarTermDate(year, targetLongitude);
        solarTerms.push({
            name: SOLAR_TERM_NAMES[i],
            julianDay: jd,
            longitude: targetLongitude
        });
    }

    return solarTerms;
}

/**
 * Find the date when sun reaches specific longitude (simplified)
 * @param {number} year - Gregorian year
 * @param {number} targetLongitude - Target solar longitude in degrees
 * @returns {number} Julian Day when sun reaches the longitude
 */
function findSolarTermDate(year, targetLongitude) {
    // Simplified calculation - in production use accurate ephemeris
    const jd = gregorianToJulianDay(year, 1, 1);
    const T = (jd - CHINESE_ASTRO_CONSTANTS.JULIAN_DAY_J2000) / CHINESE_ASTRO_CONSTANTS.JULIAN_CENTURY;

    // Approximate solar longitude (simplified VSOP87)
    let longitude = 280.460 + 360.9856474 * (jd - 2451545.0) +
                    0.0003875 * T * T + 0.0000000258 * T * T * T;

    longitude = normalizeAngle(longitude);

    // Adjust to find target longitude
    const daysToAdd = ((targetLongitude - longitude) / 360) * 365.2425;
    return jd + daysToAdd;
}

/**
 * Find current solar term for a given Julian Day
 * @param {number} jd - Julian Day
 * @param {Array} solarTerms - Array of solar terms for the year
 * @returns {Object} Current solar term
 */
function findCurrentSolarTerm(jd, solarTerms) {
    for (let i = 0; i < solarTerms.length - 1; i++) {
        if (jd >= solarTerms[i].julianDay && jd < solarTerms[i + 1].julianDay) {
            return solarTerms[i];
        }
    }
    // If not found, return the last one (wrap around)
    return solarTerms[solarTerms.length - 1];
}

/**
 * Get animal sign for an Earthly Branch
 * @param {string} branch - Earthly Branch
 * @returns {string} Animal sign
 */
function getAnimalSign(branch) {
    const { BRANCH_ANIMALS } = require('./chinese-birth-chart-constants');
    return BRANCH_ANIMALS[branch] || 'Unknown';
}

module.exports = {
    degToRad,
    radToDeg,
    normalizeAngle,
    mod,
    gregorianToJulianDay,
    julianDayToGregorian,
    calculateNewMoons,
    calculateSolarTerms,
    findSolarTermDate,
    findCurrentSolarTerm,
    getAnimalSign
};