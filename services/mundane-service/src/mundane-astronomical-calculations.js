/**
 * Astronomical Calculations for Mundane Astrology
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * This file contains all astronomical calculation functions including
 * planetary positions, sidereal conversions, house calculations, and
 * eclipse analysis used in mundane astrology.
 */

const { DateUtils } = require('./mundane-astrology-utils');
const { CONFIG } = require('./mundane-astrology-constants');

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

/**
 * Calculate Lahiri Ayanamsa for a given year
 * @param {number} year - Year
 * @returns {number} Ayanamsa in degrees
 */
function calculateLahiriAyanamsa(year) {
    // Lahiri Ayanamsa calculation (approximation)
    const t = (year - 2000) / 100;
    return 23.85 + 0.014 * t - 0.0004 * t * t;
}

/**
 * Calculate Greenwich Mean Sidereal Time
 * @param {number} julianDay - Julian Day
 * @returns {number} GMST in degrees
 */
function calculateGMST(julianDay) {
    const t = (julianDay - 2451545.0) / 36525.0;
    const gmst = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) +
                  0.0003875 * t * t - (t * t * t) / 38710000.0;
    return gmst % 360;
}

/**
 * Calculate Local Sidereal Time
 * @param {number} gmst - Greenwich Mean Sidereal Time in degrees
 * @param {number} longitude - Longitude in degrees
 * @returns {number} LST in degrees
 */
function calculateLST(gmst, longitude) {
    return (gmst + longitude) % 360;
}

/**
 * Calculate ascendant for given LST and latitude
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Latitude in degrees
 * @returns {number} Ascendant in degrees
 */
function calculateAscendant(lst, latitude) {
    const latRad = degToRad(latitude);
    const tanLat = Math.tan(latRad);
    const ramc = lst;

    // Simplified ascendant calculation
    const asc = Math.atan2(-Math.cos(degToRad(ramc)), Math.sin(degToRad(ramc)) * Math.sin(latRad) + tanLat * Math.cos(latRad));
    return (radToDeg(asc) + 360) % 360;
}

/**
 * Calculate whole sign houses
 * @param {number} ascendant - Ascendant in degrees
 * @returns {Array<number>} House cusps in degrees
 */
function calculateWholeSignHouses(ascendant) {
    const houses = [];
    for (let i = 0; i < 12; i++) {
        houses.push((ascendant + i * 30) % 360);
    }
    return houses;
}

/**
 * Calculate midheaven
 * @param {number} lst - Local Sidereal Time in degrees
 * @returns {number} Midheaven in degrees
 */
function calculateMidheaven(lst) {
    // Simplified MC calculation
    return lst;
}

/**
 * Calculate planetary positions (simplified)
 * @param {number} julianDay - Julian Day
 * @returns {Object} Planetary longitudes
 */
function calculatePlanetaryPositions(julianDay) {
    // Simplified planetary position calculations
    // In practice, use astronomical libraries like Swiss Ephemeris
    const t = (julianDay - 2451545.0) / 36525.0;

    return {
        SUN: (280.460 + 0.9856474 * (julianDay - 2451545.0)) % 360,
        MOON: (218.316 + 13.176396 * (julianDay - 2451545.0)) % 360,
        MARS: (355.433 + 0.5240207 * (julianDay - 2451545.0)) % 360,
        MERCURY: (252.251 + 1.6021302 * (julianDay - 2451545.0)) % 360,
        JUPITER: (34.351 + 0.0831294 * (julianDay - 2451545.0)) % 360,
        VENUS: (181.979 + 1.6021302 * (julianDay - 2451545.0)) % 360,
        SATURN: (50.078 + 0.0334597 * (julianDay - 2451545.0)) % 360,
        RAHU: (125.0 + 0.0529539 * (julianDay - 2451545.0)) % 360, // North Node
        KETU: ((125.0 + 0.0529539 * (julianDay - 2451545.0)) + 180) % 360 // South Node
    };
}

/**
 * Convert tropical to sidereal longitudes
 * @param {Object} tropicalPositions - Tropical longitudes
 * @param {number} ayanamsa - Ayanamsa in degrees
 * @returns {Object} Sidereal longitudes
 */
function tropicalToSidereal(tropicalPositions, ayanamsa) {
    const sidereal = {};
    for (const planet in tropicalPositions) {
        sidereal[planet] = (tropicalPositions[planet] - ayanamsa + 360) % 360;
    }
    return sidereal;
}

/**
 * Calculate solar position
 * @param {number} julianDay - Julian Day
 * @returns {Object} Solar position
 */
function calculateSolarPosition(julianDay) {
    const longitude = calculatePlanetaryPositions(julianDay).SUN;
    return {
        longitude: longitude,
        latitude: 0, // Simplified
        distance: 1 // AU
    };
}

/**
 * Calculate lunar position
 * @param {number} julianDay - Julian Day
 * @returns {Object} Lunar position
 */
function calculateLunarPosition(julianDay) {
    const longitude = calculatePlanetaryPositions(julianDay).MOON;
    return {
        longitude: longitude,
        latitude: 0, // Simplified
        distance: 1 // Earth radii
    };
}

/**
 * Calculate angular separation between two points
 */
function calculateAngularSeparation(long1, lat1, long2, lat2) {
    const dLon = degToRad(long2 - long1);
    const dLat = degToRad(lat2 - lat1);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return radToDeg(c);
}

/**
 * Calculate mundane strength of a planet
 */
function calculateMundaneStrength(planet, chart) {
    let strength = 0;

    // Positional strength (angular distance from MC)
    const distanceFromMC = Math.min(
        Math.abs(planet.longitude - chart.midheaven),
        360 - Math.abs(planet.longitude - chart.midheaven)
    );
    strength += Math.max(0, 90 - distanceFromMC) / 90 * 25;

    // House strength
    strength += CONFIG.HOUSE_STRENGTH_WEIGHTS[planet.house - 1];

    // Sign strength (dignity)
    strength += calculateDignityStrength(planet, chart);

    return strength;
}

/**
 * Calculate aspect between two points
 * @param {number} pos1 - First position in degrees
 * @param {number} pos2 - Second position in degrees
 * @returns {string} Aspect type
 */
function calculateAspect(pos1, pos2) {
    const separation = Math.min(Math.abs(pos1 - pos2), 360 - Math.abs(pos1 - pos2));

    if (separation < 8) return 'Conjunction';
    if (Math.abs(separation - 60) < 6) return 'Sextile';
    if (Math.abs(separation - 90) < 8) return 'Square';
    if (Math.abs(separation - 120) < 8) return 'Trine';
    if (Math.abs(separation - 180) < 8) return 'Opposition';

    return 'No major aspect';
}

/**
 * Get aspect angle
 * @param {string} aspect - Aspect name
 * @returns {number} Angle in degrees
 */
function getAspectAngle(aspect) {
    const angles = {
        'Conjunction': 0,
        'Sextile': 60,
        'Square': 90,
        'Trine': 120,
        'Opposition': 180
    };
    return angles[aspect] || 0;
}

/**
 * Calculate dignity strength
 * @param {Object} planet - Planet object
 * @param {Object} chart - Chart object
 * @returns {number} Strength value
 */
function calculateDignityStrength(planet, chart) {
    // Simplified dignity calculation
    const sign = Math.floor(planet.longitude / 30);
    const dignityStrengths = {
        SUN: [20, 15, 10, 5, 0, 25, 20, 15, 10, 5, 0, 25], // Leo strong
        MOON: [0, 25, 20, 15, 10, 5, 0, 25, 20, 15, 10, 5], // Cancer strong
        // Add for other planets...
    };

    return dignityStrengths[planet.name]?.[sign] || 10;
}

/**
 * Calculate nakshatra for Moon position
 * @param {number} moonLongitude - Moon longitude in degrees
 * @returns {number} Nakshatra number (0-26)
 */
function calculateNakshatra(moonLongitude) {
    return Math.floor(moonLongitude / 13.3333);
}

/**
 * Calculate eclipse visibility
 * @param {number} julianDay - Julian Day
 * @param {Object} location - Location coordinates
 * @returns {number} Visibility percentage
 */
function calculateEclipseVisibility(julianDay, location) {
    // Simplified eclipse visibility calculation
    return 0.5; // 50% visibility
}

/**
 * Analyze eclipse effects
 * @param {number} solarSign - Solar sign
 * @param {number} lunarSign - Lunar sign
 * @returns {string} Effects description
 */
function analyzeEclipseEffects(solarSign, lunarSign) {
    const effects = {
        0: 'New beginnings, leadership changes',
        1: 'Financial matters, wealth changes',
        2: 'Communication, media events',
        3: 'Home, family, agriculture',
        4: 'Children, education, speculation',
        5: 'Health, service, military',
        6: 'Partnerships, foreign relations',
        7: 'Death rate, insurance, taxes',
        8: 'Philosophy, religion, travel',
        9: 'Career, reputation, government',
        10: 'Friends, hopes, technology',
        11: 'Spirituality, expenses, foreign lands'
    };

    return effects[solarSign] || 'General transformative effects';
}

/**
 * Calculate vernal equinox
 * @param {number} year - Year
 * @returns {number} Julian Day of equinox
 */
function calculateVernalEquinox(year) {
    // Simplified equinox calculation
    return DateUtils.calculateJulianDay(year, 3, 20);
}

/**
 * Calculate summer solstice
 * @param {number} year - Year
 * @returns {number} Julian Day of solstice
 */
function calculateSummerSolstice(year) {
    return DateUtils.calculateJulianDay(year, 6, 21);
}

/**
 * Calculate autumnal equinox
 * @param {number} year - Year
 * @returns {number} Julian Day of equinox
 */
function calculateAutumnalEquinox(year) {
    return DateUtils.calculateJulianDay(year, 9, 22);
}

/**
 * Calculate winter solstice
 * @param {number} year - Year
 * @returns {number} Julian Day of solstice
 */
function calculateWinterSolstice(year) {
    return DateUtils.calculateJulianDay(year, 12, 21);
}

module.exports = {
    degToRad,
    radToDeg,
    calculateLahiriAyanamsa,
    calculateGMST,
    calculateLST,
    calculateAscendant,
    calculateWholeSignHouses,
    calculateMidheaven,
    calculatePlanetaryPositions,
    tropicalToSidereal,
    calculateSolarPosition,
    calculateLunarPosition,
    calculateAngularSeparation,
    calculateMundaneStrength,
    calculateAspect,
    getAspectAngle,
    calculateDignityStrength,
    calculateNakshatra,
    calculateEclipseVisibility,
    analyzeEclipseEffects,
    calculateVernalEquinox,
    calculateSummerSolstice,
    calculateAutumnalEquinox,
    calculateWinterSolstice
};