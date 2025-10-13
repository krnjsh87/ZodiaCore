/**
 * ZodiaCore - Birth Chart Algorithms
 *
 * Core algorithms for calculating ascendant, planetary positions, and birth chart elements.
 * Implements Vedic astrology calculations including ascendant, midheaven, and planetary conversions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS } = require('./astro-constants');
const { degToRad, radToDeg, normalizeAngle, sinDeg, cosDeg, tanDeg, atan2Deg } = require('./math-utils');
const {
    calculateJulianDay,
    calculateJulianCenturies,
    calculateLahiriAyanamsa,
    calculateGMST,
    calculateLST
} = require('./astronomical-calculations');

/**
 * Calculate Ascendant (Lagna) for given time and place
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @returns {number} Ascendant longitude in degrees
 */
function calculateAscendant(lst, latitude) {
    const lstRad = degToRad(lst);
    const latRad = degToRad(latitude);
    const obliquityRad = degToRad(ASTRO_CONSTANTS.EARTH_OBLIQUITY);

    // Calculate ascendant using spherical trigonometry
    let ascendant = atan2Deg(
        cosDeg(lst),
        -sinDeg(lst) * cosDeg(ASTRO_CONSTANTS.EARTH_OBLIQUITY) - tanDeg(latitude) * sinDeg(ASTRO_CONSTANTS.EARTH_OBLIQUITY)
    );

    return normalizeAngle(ascendant);
}

/**
 * Calculate Midheaven (MC)
 * @param {number} lst - Local Sidereal Time in degrees
 * @returns {number} Midheaven longitude in degrees
 */
function calculateMidheaven(lst) {
    // MC is simply the LST
    return normalizeAngle(lst);
}

/**
 * Calculate approximate planetary positions using simplified formulas
 * @param {number} julianDay - Julian Day Number
 * @returns {Object} Planetary positions in degrees
 */
function calculatePlanetaryPositions(julianDay) {
    const T = calculateJulianCenturies(julianDay);
    const positions = {};

    // Sun's position (simplified)
    positions.SUN = normalizeAngle(280.459 + 0.98564736 * (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000));

    // Moon's position (simplified - more complex calculation needed for accuracy)
    const L = normalizeAngle(218.3164477 + 481267.88123421 * T);
    const D = normalizeAngle(297.8501921 + 445267.1114034 * T);
    const M = normalizeAngle(357.5291092 + 35999.0502909 * T);
    const F = normalizeAngle(93.272095 + 483202.0175233 * T);

    // Moon longitude correction (simplified)
    const moonCorrection = 6.288774 * sinDeg(L) +
                          1.274027 * sinDeg(2 * D - L) +
                          0.658314 * sinDeg(2 * D);

    positions.MOON = normalizeAngle(L + moonCorrection);

    // Mars position (simplified)
    const marsM = normalizeAngle(19.373 + 0.52402068 * (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000));
    positions.MARS = normalizeAngle(marsM);

    // Mercury (simplified - inner planet)
    const mercuryM = normalizeAngle(252.251 + 1.60213022 * (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000));
    positions.MERCURY = normalizeAngle(mercuryM);

    // Venus (simplified - inner planet)
    const venusM = normalizeAngle(181.979 + 1.60213022 * (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000));
    positions.VENUS = normalizeAngle(venusM);

    // Jupiter (simplified)
    const jupiterM = normalizeAngle(34.351 + 0.08312942 * (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000));
    positions.JUPITER = normalizeAngle(jupiterM);

    // Saturn (simplified)
    const saturnM = normalizeAngle(50.078 + 0.03344514 * (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000));
    positions.SATURN = normalizeAngle(saturnM);

    // Rahu (North Node) - simplified calculation
    // Rahu moves retrograde at about 3.3 degrees per month
    const rahuBase = 125.0; // Base position for J2000
    const daysSinceJ2000 = julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000;
    const rahuMovement = -0.05295 * daysSinceJ2000; // Retrograde motion
    positions.RAHU = normalizeAngle(rahuBase + rahuMovement);

    // Ketu is always 180 degrees opposite to Rahu
    positions.KETU = normalizeAngle(positions.RAHU + 180);

    return positions;
}

/**
 * Convert tropical positions to sidereal
 * @param {Object} tropicalPositions - Tropical planetary positions
 * @param {number} ayanamsa - Ayanamsa value in degrees
 * @returns {Object} Sidereal positions
 */
function tropicalToSidereal(tropicalPositions, ayanamsa) {
    const siderealPositions = {};

    for (const planet in tropicalPositions) {
        siderealPositions[planet] = normalizeAngle(tropicalPositions[planet] - ayanamsa);
    }

    return siderealPositions;
}

/**
 * Calculate Tithi (lunar day)
 * @param {number} sunLongitude - Sun's sidereal longitude in degrees
 * @param {number} moonLongitude - Moon's sidereal longitude in degrees
 * @returns {Object} Tithi details
 */
function calculateTithi(sunLongitude, moonLongitude) {
    const difference = normalizeAngle(moonLongitude - sunLongitude);
    const tithiNumber = Math.floor(difference / 12) + 1;
    const tithiProgress = (difference % 12) / 12;

    const tithiNames = [
        'Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
    ];

    return {
        number: tithiNumber,
        name: tithiNames[Math.min(tithiNumber - 1, 14)],
        progress: tithiProgress,
        paksha: tithiNumber <= 15 ? 'Shukla' : 'Krishna'
    };
}

/**
 * Calculate Karana (half of Tithi)
 * @param {number} sunLongitude - Sun's sidereal longitude in degrees
 * @param {number} moonLongitude - Moon's sidereal longitude in degrees
 * @returns {Object} Karana details
 */
function calculateKarana(sunLongitude, moonLongitude) {
    const difference = normalizeAngle(moonLongitude - sunLongitude);
    const karanaNumber = Math.floor(difference / 6) + 1;

    const karanaNames = [
        'Kimstughna', 'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara',
        'Vanija', 'Visti', 'Sakuna', 'Chatuspada', 'Nagava', 'Kimstughna'
    ];

    return {
        number: karanaNumber,
        name: karanaNames[(karanaNumber - 1) % 11],
        type: karanaNumber % 2 === 0 ? 'Fixed' : 'Moveable'
    };
}

/**
 * Calculate Yoga (combination of Sun and Moon positions)
 * @param {number} sunLongitude - Sun's sidereal longitude in degrees
 * @param {number} moonLongitude - Moon's sidereal longitude in degrees
 * @returns {Object} Yoga details
 */
function calculateYoga(sunLongitude, moonLongitude) {
    const sum = normalizeAngle(sunLongitude + moonLongitude);
    const yogaNumber = Math.floor(sum / (360 / 27)) + 1;

    const yogaNames = [
        'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
        'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
        'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
        'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
    ];

    return {
        number: yogaNumber,
        name: yogaNames[yogaNumber - 1],
        degrees: sum
    };
}

/**
 * Calculate birth chart elements for given birth data
 * @param {Object} birthData - Birth information
 * @returns {Object} Basic chart elements
 */
function calculateBasicChartElements(birthData) {
    // Calculate Julian Day
    const julianDay = calculateJulianDay(
        birthData.year, birthData.month, birthData.day,
        birthData.hour, birthData.minute, birthData.second
    );

    // Calculate Ayanamsa
    const ayanamsa = calculateLahiriAyanamsa(birthData.year);

    // Calculate Sidereal Time
    const gmst = calculateGMST(julianDay);
    const lst = calculateLST(gmst, birthData.longitude);

    // Calculate Ascendant
    const ascendant = calculateAscendant(lst, birthData.latitude);

    // Calculate planetary positions
    const tropicalPositions = calculatePlanetaryPositions(julianDay);
    const siderealPositions = tropicalToSidereal(tropicalPositions, ayanamsa);

    return {
        julianDay,
        ayanamsa,
        lst,
        ascendant,
        tropicalPositions,
        siderealPositions
    };
}

// Export all birth chart algorithm functions
module.exports = {
    calculateAscendant,
    calculateMidheaven,
    calculatePlanetaryPositions,
    tropicalToSidereal,
    calculateTithi,
    calculateKarana,
    calculateYoga,
    calculateBasicChartElements
};