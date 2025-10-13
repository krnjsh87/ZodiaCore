/**
 * ZodiaCore - Astronomical Calculations
 *
 * Core astronomical calculations for Vedic astrology including Julian Day,
 * Ayanamsa, sidereal time, and coordinate transformations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS } = require('./astro-constants');
const { degToRad, radToDeg, normalizeAngle } = require('./math-utils');

/**
 * Calculate Julian Day Number from Gregorian Date
 * @param {number} year - Year (e.g., 2025)
 * @param {number} month - Month (1-12)
 * @param {number} day - Day (1-31)
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} second - Second (0-59)
 * @returns {number} Julian Day Number
 */
function calculateJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
    // Convert time to decimal day
    const decimalDay = day + (hour + minute / 60 + second / 3600) / 24;

    // Adjust for January and February
    if (month <= 2) {
        year -= 1;
        month += 12;
    }

    // Calculate Julian Day
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD = Math.floor(365.25 * (year + 4716)) +
               Math.floor(30.6001 * (month + 1)) +
               decimalDay + B - 1524.5;

    return JD;
}

/**
 * Calculate Julian Centuries from J2000.0
 * @param {number} julianDay - Julian Day Number
 * @returns {number} Julian Centuries
 */
function calculateJulianCenturies(julianDay) {
    return (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000) / ASTRO_CONSTANTS.JULIAN_CENTURY;
}

/**
 * Calculate Lahiri Ayanamsa for given year
 * @param {number} year - Year for calculation
 * @returns {number} Ayanamsa in degrees
 */
function calculateLahiriAyanamsa(year) {
    // Accumulated Precession formula for scientific calculation
    const T = (year - 2000) / 100; // Centuries from J2000.0

    // Scientific formula for accumulated precession
    const AP = 5028.796195 + 2.2108696 * (23631.58 + (year - 2000) / 365.25);

    // Convert to degrees and add Earth's obliquity
    const ayanamsa = ASTRO_CONSTANTS.EARTH_OBLIQUITY + (AP / 3600);

    return ayanamsa;
}

/**
 * Alternative simplified Lahiri calculation
 * @param {number} year - Year for calculation
 * @returns {number} Ayanamsa in degrees
 */
function calculateSimpleLahiriAyanamsa(year) {
    const yearsFromBase = year - ASTRO_CONSTANTS.LAHIRI_BASE_YEAR;
    const precessionAdjustment = yearsFromBase * ASTRO_CONSTANTS.PRECESSION_RATE / 3600;

    return ASTRO_CONSTANTS.LAHIRI_BASE_VALUE + precessionAdjustment;
}

/**
 * Calculate Greenwich Mean Sidereal Time
 * @param {number} julianDay - Julian Day Number
 * @returns {number} GMST in degrees
 */
function calculateGMST(julianDay) {
    const T = (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000) / ASTRO_CONSTANTS.JULIAN_CENTURY;

    // GMST at 0h UT
    let gmst0 = 280.46061837 + 360.98564736629 * (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000) +
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

/**
 * Convert equatorial coordinates to ecliptic coordinates
 * @param {number} ra - Right Ascension in degrees
 * @param {number} dec - Declination in degrees
 * @param {number} obliquity - Obliquity of ecliptic in degrees
 * @returns {Object} Object with longitude and latitude in degrees
 */
function equatorialToEcliptic(ra, dec, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY) {
    const raRad = degToRad(ra);
    const decRad = degToRad(dec);
    const oblRad = degToRad(obliquity);

    // Calculate ecliptic longitude
    const sinLat = Math.sin(decRad) * Math.cos(oblRad) - Math.cos(decRad) * Math.sin(oblRad) * Math.sin(raRad);
    const cosLat = Math.cos(decRad) * Math.cos(raRad);

    const latitude = radToDeg(Math.asin(sinLat));
    const longitude = radToDeg(Math.atan2(
        Math.sin(raRad) * Math.cos(oblRad) + Math.tan(decRad) * Math.sin(oblRad),
        cosLat
    ));

    return {
        longitude: normalizeAngle(longitude),
        latitude: latitude
    };
}

/**
 * Convert ecliptic coordinates to equatorial coordinates
 * @param {number} longitude - Ecliptic longitude in degrees
 * @param {number} latitude - Ecliptic latitude in degrees
 * @param {number} obliquity - Obliquity of ecliptic in degrees
 * @returns {Object} Object with ra and dec in degrees
 */
function eclipticToEquatorial(longitude, latitude, obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY) {
    const lonRad = degToRad(longitude);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate right ascension
    const sinDec = Math.sin(latRad) * Math.cos(oblRad) + Math.cos(latRad) * Math.sin(oblRad) * Math.sin(lonRad);
    const cosDec = Math.cos(latRad) * Math.cos(lonRad);

    const dec = radToDeg(Math.asin(sinDec));
    const ra = radToDeg(Math.atan2(
        Math.sin(lonRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad),
        cosDec
    ));

    return {
        ra: normalizeAngle(ra),
        dec: dec
    };
}

/**
 * Calculate the obliquity of the ecliptic for a given Julian Day
 * @param {number} julianDay - Julian Day Number
 * @returns {number} Obliquity in degrees
 */
function calculateObliquity(julianDay) {
    const T = calculateJulianCenturies(julianDay);

    // Mean obliquity calculation (simplified)
    let obliquity = ASTRO_CONSTANTS.EARTH_OBLIQUITY -
                   0.001813 * T -
                   0.00059 * T * T -
                   0.000011 * T * T * T;

    return obliquity;
}

/**
 * Calculate the equation of time
 * @param {number} julianDay - Julian Day Number
 * @returns {number} Equation of time in minutes
 */
function calculateEquationOfTime(julianDay) {
    const T = calculateJulianCenturies(julianDay);

    // Mean longitude of the Sun
    const L = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);

    // Mean anomaly of the Sun
    const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);

    // Eccentricity of Earth's orbit
    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

    // Equation of center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
              (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
              0.000289 * Math.sin(degToRad(3 * M));

    // True longitude
    const trueLongitude = L + C;

    // Obliquity
    const obliquity = calculateObliquity(julianDay);

    // Equation of time
    const E = 4 * radToDeg(
        e * Math.sin(degToRad(M)) * (1 - 0.5 * e * e) +
        2 * e * e * Math.sin(degToRad(2 * M)) +
        1.25 * e * e * e * Math.sin(degToRad(3 * M)) -
        0.5 * Math.sin(degToRad(2 * trueLongitude)) * Math.cos(degToRad(2 * obliquity)) +
        0.5 * Math.sin(degToRad(4 * trueLongitude)) * Math.cos(degToRad(4 * obliquity))
    );

    return E; // in minutes
}

// Export all astronomical calculation functions
module.exports = {
    calculateJulianDay,
    calculateJulianCenturies,
    calculateLahiriAyanamsa,
    calculateSimpleLahiriAyanamsa,
    calculateGMST,
    calculateLST,
    equatorialToEcliptic,
    eclipticToEquatorial,
    calculateObliquity,
    calculateEquationOfTime
};