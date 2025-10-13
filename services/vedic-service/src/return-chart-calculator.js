/**
 * ZodiaCore - Return Chart Calculator
 *
 * Core algorithms for calculating Solar and Lunar Return Charts in Vedic astrology.
 * Implements precise return time calculations and return chart casting.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS } = require('./astro-constants');
const { degToRad, radToDeg, normalizeAngle, sinDeg, cosDeg } = require('./math-utils');
const {
    calculateJulianDay,
    calculateGMST,
    calculateLST,
    calculateLahiriAyanamsa
} = require('./astronomical-calculations');
const {
    calculateAscendant,
    calculatePlanetaryPositions,
    tropicalToSidereal
} = require('./birth-chart-algorithms');
const { calculateWholeSignHouses, getHouseFromLongitude } = require('./house-systems');

// Import ASTRO_CONSTANTS from astro-constants.js
// Key constants for return calculations:
// - ASTRO_CONSTANTS.MAX_ITERATIONS: 50 (Maximum iterations for convergence)
// - ASTRO_CONSTANTS.CONVERGENCE_THRESHOLD: 0.0001 (Degrees for return calculation accuracy)
// - ASTRO_CONSTANTS.SOLAR_RETURN_PERIOD_DAYS: 365.25636 (Average solar year)
// - ASTRO_CONSTANTS.LUNAR_RETURN_PERIOD_DAYS: 29.530588 (Average lunar month)
// - ASTRO_CONSTANTS.DEGREES_PER_CIRCLE: 360.0 (Full circle)
// - ASTRO_CONSTANTS.RADIANS_PER_DEGREE: Math.PI / 180.0 (Trigonometric conversion)


/**
 * Calculate angular separation between two longitudes
 */
function angularSeparation(longitude1, longitude2) {
    let separation = longitude2 - longitude1;
    while (separation > 180) separation -= 360;
    while (separation <= -180) separation += 360;
    return Math.abs(separation);
}

/**
 * Linear interpolation for time calculation
 */
function linearInterpolate(x, x1, x2, y1, y2) {
    if (x2 === x1) {
        return y1; // Avoid division by zero, return y1 as fallback
    }
    return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
}

/**
 * Calculate Julian Day with fractional time
 * @param {Date} date - JavaScript Date object
 * @returns {number} Julian Day Number
 */
function calculateJulianDayFromDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JS months are 0-based
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return calculateJulianDay(year, month, day, hour, minute, second);
}

/**
 * Interpolate planetary position between two points
 * @param {number} targetLongitude - Target longitude to find
 * @param {Object} point1 - {time: julianDay, longitude: degrees}
 * @param {Object} point2 - {time: julianDay, longitude: degrees}
 * @returns {number} Interpolated Julian Day
 */
function interpolateReturnTime(targetLongitude, point1, point2) {
    // Handle 360-degree wraparound
    let lon1 = point1.longitude;
    let lon2 = point2.longitude;

    if (Math.abs(lon2 - lon1) > 180) {
        if (lon2 > lon1) {
            lon1 += 360;
        } else {
            lon2 += 360;
        }
    }

    // Linear interpolation
    const timeDiff = point2.time - point1.time;
    const lonDiff = lon2 - lon1;
    const targetDiff = targetLongitude - lon1;

    const interpolatedTime = point1.time + (targetDiff / lonDiff) * timeDiff;

    return interpolatedTime;
}

/**
 * Find exact return time using binary search
 * @param {number} natalLongitude - Natal planet longitude
 * @param {string} planet - Planet name ('SUN' or 'MOON')
 * @param {Date} searchStart - Start date for search
 * @param {number} searchDays - Days to search forward
 * @param {number} latitude - Birth latitude
 * @param {number} longitude - Birth longitude
 * @param {number} ayanamsa - Ayanamsa value
 * @returns {Date} Exact return time
 */
function findReturnTime(natalLongitude, planet, searchStart, searchDays, latitude, longitude, ayanamsa) {
    const startJD = calculateJulianDayFromDate(searchStart);
    const endJD = startJD + searchDays;

    let lowerBound = startJD;
    let upperBound = endJD;

    for (let iteration = 0; iteration < ASTRO_CONSTANTS.MAX_ITERATIONS; iteration++) {
        const midJD = (lowerBound + upperBound) / 2;
        const midDate = julianDayToDate(midJD);

        // Calculate planetary position at midpoint
        const positions = calculatePlanetaryPositions(midJD);
        const tropicalLongitude = positions[planet];
        const siderealLongitude = normalizeAngle(tropicalLongitude - ayanamsa);

        const separation = angularSeparation(siderealLongitude, natalLongitude);

        if (separation < ASTRO_CONSTANTS.CONVERGENCE_THRESHOLD) {
            return midDate;
        }

        // Adjust bounds based on longitude difference
        const longitudeDiff = siderealLongitude - natalLongitude;
        if (longitudeDiff > 0) {
            upperBound = midJD;
        } else {
            lowerBound = midJD;
        }
    }

    throw new Error(`Return time convergence failed for ${planet} after ${ASTRO_CONSTANTS.MAX_ITERATIONS} iterations. ` +
                    `Final separation: ${(angularSeparation(siderealLongitude, natalLongitude) * 3600).toFixed(2)} arcseconds. ` +
                    `Check input parameters and ephemeris data.`);
}

/**
 * Convert Julian Day back to Date object
 * @param {number} jd - Julian Day Number
 * @returns {Date} JavaScript Date object
 */
function julianDayToDate(jd) {
    // Validate Julian Day range (astronomical calculations)
    if (jd < 0 || jd > 10000000) {
        throw new Error(`Invalid Julian Day: ${jd}. Must be between 0 and 10,000,000.`);
    }

    // Inverse of Julian Day calculation (Meeus algorithm)
    const jdInt = Math.floor(jd + 0.5);
    const a = jdInt + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor(146097 * b / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * d / 4);
    const m = Math.floor((5 * e + 2) / 153);

    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);

    // Handle fractional time correctly
    const fractionalDay = jd - (jdInt - 0.5);
    const totalSeconds = fractionalDay * ASTRO_CONSTANTS.SECONDS_PER_DAY;
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Create date with proper timezone handling (UTC)
    return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
}

/**
 * Cast complete return chart for given time and location
 * @param {Date} returnTime - Exact return time
 * @param {number} latitude - Latitude for return chart
 * @param {number} longitude - Longitude for return chart
 * @param {Object} natalChart - Original birth chart
 * @returns {Object} Complete return chart
 */
function castReturnChart(returnTime, latitude, longitude, natalChart) {
    // Use same ayanamsa as natal chart
    const ayanamsa = natalChart.ayanamsa;

    // Calculate astronomical data for return time
    const julianDay = calculateJulianDayFromDate(returnTime);
    const gmst = calculateGMST(julianDay);
    const lst = calculateLST(gmst, longitude);

    // Calculate return ascendant
    const ascendant = calculateAscendant(lst, latitude);

    // Calculate return planetary positions
    const tropicalPositions = calculatePlanetaryPositions(julianDay);
    const siderealPositions = tropicalToSidereal(tropicalPositions, ayanamsa);

    // Calculate return houses (typically Whole Sign for Vedic)
    const houses = calculateWholeSignHouses(ascendant);

    // Create return chart object
    const returnChart = {
        returnTime: returnTime,
        julianDay: julianDay,
        location: { latitude, longitude },
        ayanamsa: ayanamsa,
        lst: lst,

        ascendant: {
            longitude: ascendant,
            sign: Math.floor(ascendant / 30),
            degree: ascendant % 30
        },

        houses: houses,
        planets: formatPlanetaryPositions(siderealPositions),

        // Natal planet positions in return chart
        natalPlanets: natalChart.planets,

        // Return-specific calculations
        returnType: null, // 'SOLAR' or 'LUNAR'
        precessionAngle: calculatePrecessionAngle(natalChart.birthData, returnTime),

        // Analysis methods
        getNatalPlanetInReturnHouse: (planet) => getHouseFromLongitude(
            natalChart.planets[planet].longitude, houses
        ),

        getReturnPlanetAspectsToNatal: (natalPlanet) => calculateAspects(
            siderealPositions, natalChart.planets[natalPlanet].longitude
        )
    };

    return returnChart;
}

/**
 * Format planetary positions for return chart
 * @param {Object} positions - Sidereal planetary positions
 * @returns {Object} Formatted planetary data
 */
function formatPlanetaryPositions(positions) {
    const formatted = {};

    for (const planet in positions) {
        const longitude = positions[planet];
        formatted[planet] = {
            longitude: longitude,
            sign: Math.floor(longitude / 30),
            degree: longitude % 30,
            retrograde: false // Simplified - can be enhanced
        };
    }

    return formatted;
}

/**
 * Calculate precession angle between birth and return
 * @param {Object} birthData - Birth data
 * @param {Date} returnTime - Return time
 * @returns {number} Precession angle in degrees
 */
function calculatePrecessionAngle(birthData, returnTime) {
    const birthYear = birthData.year;
    const returnYear = returnTime.getFullYear();
    const yearsDiff = returnYear - birthYear;

    // Approximate precession: 50.3 arcseconds per year
    const precessionArcsec = yearsDiff * 50.3;
    const precessionDegrees = precessionArcsec / 3600;

    return precessionDegrees;
}

/**
 * Calculate aspects between return and natal planets
 * @param {Object} returnPositions - Return planetary positions
 * @param {number} natalLongitude - Natal planet longitude
 * @returns {Array} Array of aspects
 */
function calculateAspects(returnPositions, natalLongitude) {
    const aspects = [];
    const aspectAngles = [0, 60, 90, 120, 180]; // Conjunction, sextile, square, trine, opposition

    for (const planet in returnPositions) {
        const returnLongitude = returnPositions[planet];
        const separation = angularSeparation(returnLongitude, natalLongitude);

        // Find closest aspect
        for (const aspect of aspectAngles) {
            if (Math.abs(separation - aspect) < 10) { // 10 degree orb
                aspects.push({
                    planet: planet,
                    aspect: getAspectName(aspect),
                    angle: aspect,
                    separation: separation,
                    exactness: Math.abs(separation - aspect)
                });
                break;
            }
        }
    }

    return aspects;
}

/**
 * Get aspect name from angle
 * @param {number} angle - Aspect angle
 * @returns {string} Aspect name
 */
function getAspectName(angle) {
    switch (angle) {
        case 0: return 'Conjunction';
        case 60: return 'Sextile';
        case 90: return 'Square';
        case 120: return 'Trine';
        case 180: return 'Opposition';
        default: return 'Unknown';
    }
}

/**
 * Calculate solar return chart
 * @param {Object} natalChart - Natal birth chart
 * @param {number} returnYear - Year for solar return
 * @param {number} latitude - Optional latitude override
 * @param {number} longitude - Optional longitude override
 * @returns {Object} Solar return chart
 */
function calculateSolarReturn(natalChart, returnYear, latitude = null, longitude = null) {
    // Input validation
    if (!natalChart || !natalChart.birthData || !natalChart.planets || !natalChart.planets.SUN) {
        throw new Error('Invalid natal chart: missing birthData or planetary positions');
    }
    if (!returnYear || returnYear < 1900 || returnYear > 2100) {
        throw new Error('Return year must be between 1900 and 2100');
    }
    if (latitude !== null && (latitude < -90 || latitude > 90)) {
        throw new Error('Latitude must be between -90 and 90 degrees');
    }
    if (longitude !== null && (longitude < -180 || longitude > 180)) {
        throw new Error('Longitude must be between -180 and 180 degrees');
    }

    // Use birth location if not specified
    const returnLatitude = latitude !== null ? latitude : natalChart.birthData.latitude;
    const returnLongitude = longitude !== null ? longitude : natalChart.birthData.longitude;

    // Find approximate solar return date (birthday)
    const birthday = new Date(returnYear, natalChart.birthData.month - 1, natalChart.birthData.day);

    // Search for exact solar return (Sun returns to natal Sun position)
    const natalSunLongitude = natalChart.planets.SUN.longitude;
    const returnTime = findReturnTime(
        natalSunLongitude,
        'SUN',
        birthday,
        5, // Search ±5 days around birthday
        returnLatitude,
        returnLongitude,
        natalChart.ayanamsa
    );

    // Cast the return chart
    const solarReturnChart = castReturnChart(returnTime, returnLatitude, returnLongitude, natalChart);
    solarReturnChart.returnType = 'SOLAR';
    solarReturnChart.returnYear = returnYear;

    return solarReturnChart;
}

/**
 * Calculate lunar return chart
 * @param {Object} natalChart - Natal birth chart
 * @param {Date} startDate - Date to start searching from
 * @param {number} latitude - Optional latitude override
 * @param {number} longitude - Optional longitude override
 * @returns {Object} Lunar return chart
 */
function calculateLunarReturn(natalChart, startDate, latitude = null, longitude = null) {
    // Use birth location if not specified
    const returnLatitude = latitude || natalChart.birthData.latitude;
    const returnLongitude = longitude || natalChart.birthData.longitude;

    // Search for lunar return (Moon returns to natal Moon position)
    const natalMoonLongitude = natalChart.planets.MOON.longitude;
    const returnTime = findReturnTime(
        natalMoonLongitude,
        'MOON',
        startDate,
        35, // Search up to 35 days (lunar cycle)
        returnLatitude,
        returnLongitude,
        natalChart.ayanamsa
    );

    // Cast the return chart
    const lunarReturnChart = castReturnChart(returnTime, returnLatitude, returnLongitude, natalChart);
    lunarReturnChart.returnType = 'LUNAR';
    lunarReturnChart.returnMonth = returnTime.getMonth() + 1;
    lunarReturnChart.returnYear = returnTime.getFullYear();

    return lunarReturnChart;
}

// Export all return chart calculation functions
module.exports = {
    findReturnTime,
    castReturnChart,
    angularSeparation,
    linearInterpolate,
    julianDayToDate,
    calculatePrecessionAngle,
    calculateAspects,
    calculateSolarReturn,
    calculateLunarReturn
};