// Chinese Lunar Calendar Calculations
// Module for converting Gregorian dates to Chinese lunar calendar and related calculations

const { CHINESE_ASTRO_CONSTANTS } = require('./chinese-birth-chart-constants');
const {
    gregorianToJulianDay,
    julianDayToGregorian,
    calculateNewMoons,
    calculateSolarTerms,
    findCurrentSolarTerm,
    mod
} = require('./chinese-birth-chart-utils');

/**
 * Convert Gregorian date to Chinese lunar date
 * @param {Object} birthData - Birth data with year, month, day, hour, minute, second
 * @returns {Object} Lunar date information
 */
function gregorianToLunar(birthData) {
    const timezoneOffset = birthData.timezoneOffset || 0;
    const jd = gregorianToJulianDay(birthData.year, birthData.month, birthData.day,
                                    birthData.hour, birthData.minute, birthData.second, timezoneOffset);

    // Find lunar year
    const lunarYear = calculateLunarYear(jd);

    // Find solar term for month determination
    const solarTerms = calculateSolarTerms(birthData.year);
    const solarTerm = findCurrentSolarTerm(jd, solarTerms);

    // Determine if it's a leap month (simplified - would need full lunar calendar)
    const isLeapMonth = false;

    return {
        lunarYear: lunarYear,
        solarTerm: solarTerm,
        isLeapMonth: isLeapMonth,
        julianDay: jd
    };
}

/**
 * Calculate lunar year from Julian Day
 * @param {number} jd - Julian Day
 * @returns {number} Lunar year
 */
function calculateLunarYear(jd) {
    // Simplified calculation - find year in sexagenary cycle
    const yearsSinceEpoch = Math.floor((jd - gregorianToJulianDay(CHINESE_ASTRO_CONSTANTS.CHINESE_EPOCH_YEAR, 1, 1)) / 365.2425);
    return CHINESE_ASTRO_CONSTANTS.CHINESE_EPOCH_YEAR + yearsSinceEpoch;
}

/**
 * Get lunar month from solar term
 * @param {Object} solarTerm - Current solar term
 * @returns {number} Lunar month (1-12)
 */
function getLunarMonthFromSolarTerm(solarTerm) {
    // Lunar months are determined by solar terms
    // Each solar term corresponds to approximately 15 degrees of solar longitude
    const monthIndex = Math.floor(solarTerm.longitude / 30);
    return monthIndex + 1; // 1-based month
}

/**
 * Calculate Chinese New Year date for a given year
 * @param {number} year - Gregorian year
 * @returns {Object} New Year date
 */
function calculateChineseNewYear(year) {
    // Find the new moon closest to the beginning of spring (solar term)
    const newMoons = calculateNewMoons(year);
    const solarTerms = calculateSolarTerms(year);

    // Find Spring Begins solar term
    const springBegins = solarTerms.find(term => term.name === 'Spring Begins');

    if (!springBegins) {
        throw new Error('Could not find Spring Begins solar term');
    }

    // Find the new moon immediately before or on Spring Begins
    let newYearJD = newMoons[0];
    for (const nm of newMoons) {
        if (nm <= springBegins.julianDay) {
            newYearJD = nm;
        } else {
            break;
        }
    }

    return julianDayToGregorian(newYearJD);
}

/**
 * Determine if a year is a leap year in Chinese calendar
 * @param {number} year - Lunar year
 * @returns {boolean} True if leap year
 */
function isChineseLeapYear(year) {
    // Simplified leap year calculation
    // In Chinese calendar, leap years have 13 months
    // This is a simplified version - real calculation is more complex
    const yearInCycle = mod(year - CHINESE_ASTRO_CONSTANTS.JIA_ZI_YEAR, 19);
    return [3, 6, 9, 11, 14, 17].includes(yearInCycle); // Approximate pattern
}

/**
 * Get lunar date details for a Gregorian date
 * @param {number} year - Gregorian year
 * @param {number} month - Gregorian month
 * @param {number} day - Gregorian day
 * @returns {Object} Detailed lunar date information
 */
function getLunarDateDetails(year, month, day) {
    const jd = gregorianToJulianDay(year, month, day);
    const lunarInfo = gregorianToLunar({ year, month, day, hour: 12, minute: 0, second: 0 });

    const newYear = calculateChineseNewYear(year);
    const newYearJD = gregorianToJulianDay(newYear.year, newYear.month, newYear.day);

    const daysSinceNewYear = Math.floor(jd - newYearJD);
    const lunarMonth = Math.floor(daysSinceNewYear / 29.5) + 1; // Approximate

    return {
        ...lunarInfo,
        lunarMonth: lunarMonth,
        daysSinceNewYear: daysSinceNewYear,
        chineseNewYear: newYear
    };
}

/**
 * Calculate lunar age (age in Chinese years)
 * @param {number} birthYear - Birth year (Gregorian)
 * @param {number} currentYear - Current year (Gregorian)
 * @returns {number} Lunar age
 */
function calculateLunarAge(birthYear, currentYear) {
    // In Chinese culture, age is calculated differently
    // You are 1 year old at birth, and gain a year at Chinese New Year
    let age = currentYear - birthYear + 1;

    // Adjust if birthday hasn't passed in current lunar year
    // This is simplified - real calculation considers lunar calendar
    return age;
}

module.exports = {
    gregorianToLunar,
    calculateLunarYear,
    getLunarMonthFromSolarTerm,
    calculateChineseNewYear,
    isChineseLeapYear,
    getLunarDateDetails,
    calculateLunarAge
};