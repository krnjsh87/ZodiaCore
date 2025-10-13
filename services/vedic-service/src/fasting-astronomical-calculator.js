/**
 * ZodiaCore - Fasting Astronomical Calculator
 *
 * Precise astronomical calculations for Vedic fasting timing including
 * tithi calculations, nakshatra timing, and planetary positions for fasting.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { calculateJulianDay, calculateJulianCenturies } = require('./astronomical-calculations');
const { normalizeAngle, degToRad, radToDeg } = require('./math-utils');
const { ASTRO_CONSTANTS, NAKSHATRA_NAMES, NAKSHATRA_LORDS, TITHI_NAMES } = require('./astro-constants');
const { VRATA_CONSTANTS } = require('./fasting-constants');

/**
 * Fasting Astronomical Calculator Class
 * Provides precise calculations for Vedic fasting timing
 */
class FastingAstronomicalCalculator {
    constructor() {
        this.constants = {
            EARTH_RADIUS: 6371,           // km
            AU: 149597870.7,             // Astronomical unit in km
            SPEED_OF_LIGHT: 299792458,   // m/s
            JULIAN_DAY_2000: 2451545.0,
            SIDEREAL_YEAR: 365.256363,   // days
            TROPICAL_YEAR: 365.242189,   // days
        };
    }

    /**
     * Calculate precise sun longitude
     * @param {number} julianDay - Julian Day Number
     * @returns {number} Sun longitude in degrees
     */
    calculatePreciseSunLongitude(julianDay) {
        const T = (julianDay - this.constants.JULIAN_DAY_2000) / 36525.0;

        // Mean longitude of the Sun
        const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;

        // Mean anomaly of the Sun
        const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;

        // Equation of the center
        const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
                  (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
                  0.000289 * Math.sin(degToRad(3 * M));

        // True longitude
        const trueLongitude = L0 + C;

        return normalizeAngle(trueLongitude);
    }

    /**
     * Calculate precise moon longitude
     * @param {number} julianDay - Julian Day Number
     * @returns {number} Moon longitude in degrees
     */
    calculatePreciseMoonLongitude(julianDay) {
        const T = (julianDay - this.constants.JULIAN_DAY_2000) / 36525.0;

        // Mean longitude
        const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;

        // Mean elongation
        const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000;

        // Mean anomaly of the Sun
        const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;

        // Mean anomaly of the Moon
        const M_prime = 134.9633964 + 477198.8675055 * T + 0.0087972 * T * T;

        // Argument of latitude
        const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T;

        // Periodic terms for longitude
        const longitudeCorrection =
            6.288774 * Math.sin(degToRad(M_prime)) +
            1.274027 * Math.sin(degToRad(2 * D - M_prime)) +
            0.658314 * Math.sin(degToRad(2 * D)) +
            0.213618 * Math.sin(degToRad(2 * M_prime)) +
            -0.185116 * Math.sin(degToRad(M)) +
            -0.114332 * Math.sin(degToRad(2 * F)) +
            0.058793 * Math.sin(degToRad(2 * D - 2 * M_prime)) +
            0.057066 * Math.sin(degToRad(2 * D - M - M_prime)) +
            0.053322 * Math.sin(degToRad(2 * D + M_prime)) +
            -0.031958 * Math.sin(degToRad(M - 2 * M_prime));

        const trueLongitude = L0 + longitudeCorrection;

        return normalizeAngle(trueLongitude);
    }

    /**
     * Calculate current tithi from sun-moon longitude difference
     * @param {number} sunLongitude - Sun's longitude in degrees
     * @param {number} moonLongitude - Moon's longitude in degrees
     * @returns {Object} Tithi information
     */
    calculateTithi(sunLongitude, moonLongitude) {
        const difference = normalizeAngle(moonLongitude - sunLongitude);
        const tithiNumber = Math.floor(difference / VRATA_CONSTANTS.TITHI_DURATION_DEGREES) + 1;

        // Validate tithi number bounds
        if (tithiNumber < 1 || tithiNumber > 30) {
            throw new Error(`Invalid tithi number: ${tithiNumber}. Must be between 1 and 30.`);
        }

        const paksha = tithiNumber <= 15 ? VRATA_CONSTANTS.SHUKLA_PAKSHA : VRATA_CONSTANTS.KRISHNA_PAKSHA;
        const tithiIndex = Math.min(tithiNumber - 1, 14); // Ensure bounds for 15-element array

        return {
            number: tithiNumber,
            name: TITHI_NAMES[tithiIndex],
            paksha: paksha,
            progress: (difference % VRATA_CONSTANTS.TITHI_DURATION_DEGREES) / VRATA_CONSTANTS.TITHI_DURATION_DEGREES
        };
    }

    /**
     * Calculate precise tithi with timing information
     * @param {number} sunLongitude - Sun's longitude in degrees
     * @param {number} moonLongitude - Moon's longitude in degrees
     * @returns {Object} Detailed tithi information
     */
    calculatePreciseTithi(sunLongitude, moonLongitude) {
        const longitudeDiff = normalizeAngle(moonLongitude - sunLongitude);

        // Prevent division by zero and ensure valid calculations
        if (longitudeDiff < 0 || longitudeDiff >= 360) {
            throw new Error(`Invalid longitude difference: ${longitudeDiff}. Must be between 0 and 360.`);
        }

        const tithiNumber = Math.floor(longitudeDiff / 12) + 1;

        // Validate tithi number bounds
        if (tithiNumber < 1 || tithiNumber > 30) {
            throw new Error(`Invalid tithi number: ${tithiNumber}. Must be between 1 and 30.`);
        }

        const tithiProgress = (longitudeDiff % 12) / 12;

        // Calculate tithi start and end times (simplified)
        const degreesPerHour = 360 / 24; // Simplified
        const remainingDegrees = 12 - (longitudeDiff % 12);
        const hoursRemaining = remainingDegrees / degreesPerHour;

        return {
            number: tithiNumber,
            name: this.getTithiName(tithiNumber),
            progress: tithiProgress,
            hoursRemaining: hoursRemaining,
            paksha: tithiNumber <= 15 ? 'Shukla' : 'Krishna'
        };
    }

    /**
     * Calculate nakshatra for fasting timing
     * @param {number} moonLongitude - Moon's longitude in degrees
     * @returns {Object} Nakshatra information
     */
    calculateNakshatraForFasting(moonLongitude) {
        const nakshatraIndex = Math.floor(moonLongitude / VRATA_CONSTANTS.NAKSHATRA_DURATION_DEGREES);
        return {
            number: nakshatraIndex + 1,
            name: NAKSHATRA_NAMES[nakshatraIndex],
            lord: NAKSHATRA_LORDS[nakshatraIndex]
        };
    }

    /**
     * Get tithi name
     * @param {number} tithiNumber - Tithi number (1-15)
     * @returns {string} Tithi name
     */
    getTithiName(tithiNumber) {
        return TITHI_NAMES[Math.min(tithiNumber - 1, 14)];
    }

    /**
     * Calculate current astronomical data for fasting
     * @param {Date} date - Date for calculation (local time)
     * @param {Object} location - Location with latitude and longitude
     * @returns {Object} Astronomical data
     */
    calculateCurrentAstroData(date, location) {
        // Convert local date to UTC for astronomical calculations
        const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));

        // Convert UTC date to Julian Day
        const julianDay = calculateJulianDay(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth() + 1,
            utcDate.getUTCDate(),
            utcDate.getUTCHours(),
            utcDate.getUTCMinutes(),
            utcDate.getUTCSeconds()
        );

        // Calculate planetary positions
        const sunLongitude = this.calculatePreciseSunLongitude(julianDay);
        const moonLongitude = this.calculatePreciseMoonLongitude(julianDay);

        // Calculate tithi
        const tithi = this.calculatePreciseTithi(sunLongitude, moonLongitude);

        // Calculate nakshatra
        const nakshatra = this.calculateNakshatraForFasting(moonLongitude);

        return {
            julianDay: julianDay,
            sunLongitude: sunLongitude,
            moonLongitude: moonLongitude,
            tithi: tithi,
            nakshatra: nakshatra,
            date: date, // Keep original local date for display
            utcDate: utcDate, // Include UTC date for reference
            location: location
        };
    }

    /**
     * Check if current time is auspicious for fasting
     * @param {Object} astroData - Astronomical data
     * @returns {Object} Auspicious timing information
     */
    checkFastingAuspiciousness(astroData) {
        const { tithi, nakshatra } = astroData;

        // Check tithi auspiciousness
        const isTithiAuspicious = [4, 8, 11, 13, 15].includes(tithi.number);

        // Check nakshatra auspiciousness (some nakshatras are better for fasting)
        const auspiciousNakshatras = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27]; // Simplified
        const isNakshatraAuspicious = auspiciousNakshatras.includes(nakshatra.number);

        return {
            isAuspicious: isTithiAuspicious && isNakshatraAuspicious,
            tithiAuspicious: isTithiAuspicious,
            nakshatraAuspicious: isNakshatraAuspicious,
            recommendations: this.getTimingRecommendations(tithi, nakshatra)
        };
    }

    /**
     * Get timing recommendations based on tithi and nakshatra
     * @param {Object} tithi - Tithi information
     * @param {Object} nakshatra - Nakshatra information
     * @returns {Array} Timing recommendations
     */
    getTimingRecommendations(tithi, nakshatra) {
        const recommendations = [];

        // Tithi-based recommendations
        if (tithi.number === 11) {
            recommendations.push('Ekadashi fasting is highly auspicious today');
        } else if (tithi.number === 15) {
            recommendations.push('Purnima/Amavasya fasting recommended');
        } else if ([4, 8, 13].includes(tithi.number)) {
            recommendations.push(`${tithi.name} fasting is beneficial`);
        }

        // Nakshatra-based recommendations
        if (nakshatra.lord === 'MOON') {
            recommendations.push('Moon-ruled nakshatra - good for mental peace fasting');
        } else if (nakshatra.lord === 'SATURN') {
            recommendations.push('Saturn-ruled nakshatra - good for karmic fasting');
        }

        return recommendations;
    }
}

module.exports = FastingAstronomicalCalculator;