/**
 * Western Horoscope Utility Functions
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * This file contains utility functions for astronomical calculations,
 * angular separations, and other mathematical operations needed
 * for Western astrology horoscope generation.
 */

const { WESTERN_HOROSCOPE_CONSTANTS } = require('./western-horoscope-constants');

/**
 * Calculate Julian Day from Gregorian date
 * @param {number} year - Gregorian year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} second - Second (0-59)
 * @returns {number} Julian Day
 */
function calculateJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
    // Convert to Julian Day Number
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;

    let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Add fractional day
    let fractionalDay = (hour - 12) / 24 + minute / 1440 + second / 86400;
    jd += fractionalDay;

    return jd;
}

/**
 * Calculate angular separation between two longitudes
 * @param {number} lon1 - First longitude in degrees
 * @param {number} lon2 - Second longitude in degrees
 * @returns {number} Angular separation in degrees (0-180)
 */
function angularSeparation(lon1, lon2) {
    let diff = Math.abs(lon1 - lon2);
    return Math.min(diff, 360 - diff);
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
 * Check if angle is within orb of aspect
 * @param {number} angle - Actual angle
 * @param {number} aspectAngle - Aspect angle
 * @param {number} orb - Allowed orb in degrees
 * @returns {boolean} True if within orb
 */
function withinOrb(angle, aspectAngle, orb) {
    return Math.abs(angle - aspectAngle) <= orb;
}

/**
 * Calculate aspect strength based on exactness
 * @param {number} angle - Actual angle
 * @param {number} aspectAngle - Aspect angle
 * @param {number} orb - Maximum orb
 * @param {number} baseWeight - Base weight of aspect
 * @returns {number} Strength multiplier (0-1)
 */
function calculateAspectStrength(angle, aspectAngle, orb, baseWeight) {
    const exactness = Math.abs(angle - aspectAngle);
    if (exactness > orb) return 0;

    const strength = Math.max(0, 1 - (exactness / orb));
    return strength * baseWeight;
}

/**
 * Determine if aspect is applying (getting closer)
 * @param {number} natalPosition - Natal planet position
 * @param {number} transitPosition - Transit planet position
 * @param {number} previousTransit - Previous transit position (optional)
 * @returns {boolean} True if applying
 */
function isApplying(natalPosition, transitPosition, previousTransit = null) {
    if (previousTransit === null) {
        // Simplified: assume applying if within conjunction orb
        return angularSeparation(natalPosition, transitPosition) <= WESTERN_HOROSCOPE_CONSTANTS.ASPECTS.CONJUNCTION.orb;
    }

    const currentSeparation = angularSeparation(natalPosition, transitPosition);
    const previousSeparation = angularSeparation(natalPosition, previousTransit);

    return currentSeparation < previousSeparation;
}

/**
 * Get zodiac sign from longitude
 * @param {number} longitude - Longitude in degrees
 * @returns {string} Zodiac sign name
 */
function getZodiacSign(longitude) {
    const signIndex = Math.floor(normalizeAngle(longitude) / 30);
    return WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[signIndex];
}

/**
 * Calculate moon phase
 * @param {Date} date - Date for calculation
 * @returns {string} Moon phase name
 */
function calculateMoonPhase(date) {
    // Simplified moon phase calculation
    // In production, use astronomical library for accuracy
    const jd = calculateJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const moonCycle = 29.530588; // Synodic month
    const knownNewMoon = 2451549.5; // Known new moon JD

    const phase = ((jd - knownNewMoon) % moonCycle) / moonCycle;

    if (phase < 0.125) return WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.NEW_MOON;
    if (phase < 0.375) return WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.WAXING_CRESCENT;
    if (phase < 0.625) return WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.FIRST_QUARTER;
    if (phase < 0.875) return WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.WAXING_GIBBOUS;
    return WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.FULL_MOON;
}

/**
 * Calculate planetary hours for a day
 * @param {Date} date - Date for calculation
 * @returns {Array} Array of planetary hour periods
 */
function calculatePlanetaryHours(date) {
    // Simplified planetary hours calculation
    // Traditional Western astrology system
    const hours = [];
    const dayOfWeek = date.getDay(); // 0 = Sunday

    // Day ruler based on day of week
    const dayRulers = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];

    // Planetary hour sequence starting from day ruler
    const sequence = ['SUN', 'VENUS', 'MERCURY', 'MOON', 'SATURN', 'JUPITER', 'MARS'];
    const startIndex = sequence.indexOf(dayRulers[dayOfWeek]);

    // Calculate sunrise/sunset (simplified)
    const sunrise = 6; // 6 AM
    const sunset = 18; // 6 PM
    const dayLength = sunset - sunrise;
    const nightLength = 24 - dayLength;

    const dayHourLength = dayLength / 12;
    const nightHourLength = nightLength / 12;

    let currentTime = sunrise;
    let currentSequence = [...sequence.slice(startIndex), ...sequence.slice(0, startIndex)];

    // Day hours
    for (let i = 0; i < 12; i++) {
        const planet = currentSequence[i % 7];
        hours.push({
            planet: planet,
            start: currentTime,
            end: currentTime + dayHourLength,
            type: 'day'
        });
        currentTime += dayHourLength;
    }

    // Night hours
    for (let i = 0; i < 12; i++) {
        const planet = currentSequence[(i + 3) % 7]; // Night sequence starts 3 planets later
        hours.push({
            planet: planet,
            start: currentTime,
            end: currentTime + nightHourLength,
            type: 'night'
        });
        currentTime += nightHourLength;
    }

    return hours;
}

/**
 * Find planetary hour for specific planet and time
 * @param {string} planet - Planet name
 * @param {Date} date - Date
 * @returns {Object|null} Hour period or null
 */
function findPlanetaryHour(planet, date) {
    const hours = calculatePlanetaryHours(date);
    const targetHour = date.getHours() + date.getMinutes() / 60;

    return hours.find(hour =>
        hour.planet === planet &&
        targetHour >= hour.start &&
        targetHour < hour.end
    ) || null;
}

/**
 * Calculate rating from score
 * @param {number} score - Score (0-1)
 * @returns {string} Rating string
 */
function getRatingFromScore(score) {
    if (score >= WESTERN_HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.EXCELLENT) return 'Excellent';
    if (score >= WESTERN_HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.VERY_GOOD) return 'Very Good';
    if (score >= WESTERN_HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.GOOD) return 'Good';
    if (score >= WESTERN_HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.FAIR) return 'Fair';
    if (score >= WESTERN_HOROSCOPE_CONSTANTS.RATING_THRESHOLDS.CHALLENGING) return 'Challenging';
    return 'Difficult';
}

/**
 * Get prediction level from score
 * @param {number} score - Score (0-1)
 * @returns {string} Level ('high', 'medium', 'low')
 */
function getPredictionLevel(score) {
    if (score >= 0.7) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
}

module.exports = {
    calculateJulianDay,
    angularSeparation,
    normalizeAngle,
    withinOrb,
    calculateAspectStrength,
    isApplying,
    getZodiacSign,
    calculateMoonPhase,
    calculatePlanetaryHours,
    findPlanetaryHour,
    getRatingFromScore,
    getPredictionLevel
};</path>
<line_count>200</line_count>
</write_to_file>