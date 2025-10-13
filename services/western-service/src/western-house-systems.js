/**
 * Western Astrology House Systems
 *
 * This module provides implementations of different house systems used in Western astrology:
 * Placidus (time-based), Equal (30° each), and Koch (time-based variation).
 *
 * @version 1.0.0
 * @since 2025-10-08
 */

const { WESTERN_ASTRO_CONSTANTS } = require('./western-astro-constants');
const { degToRad, radToDeg, normalizeAngle } = require('./western-math-utils');

/**
 * Calculate Placidus Houses (time-based system)
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @param {number} obliquity - Earth's obliquity in degrees (optional, defaults to current value)
 * @returns {Array} Placidus house cusps (12 values)
 * @throws {Error} If latitude is beyond ±60 degrees (Placidus limitation)
 */
function calculatePlacidusHouses(lst, latitude, obliquity = WESTERN_ASTRO_CONSTANTS.EARTH_OBLIQUITY) {
    // Validate latitude for Placidus system (problematic near poles)
    if (Math.abs(latitude) > 60) {
        throw new Error('Placidus house system is not valid for latitudes beyond ±60 degrees. Use Equal or Koch houses for polar regions.');
    }

    const houses = new Array(12);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(obliquity);

    // Calculate MC and IC (10th and 4th house cusps)
    houses[9] = normalizeAngle(lst); // MC (10th house)
    houses[3] = normalizeAngle(lst + 180); // IC (4th house)

    // Calculate Ascendant and Descendant
    const ascendant = calculateAscendant(lst, latitude);
    houses[0] = ascendant; // Ascendant (1st house)
    houses[6] = normalizeAngle(ascendant + 180); // Descendant (7th house)

    // Calculate intermediate houses using Placidus formula
    for (let i = 1; i <= 2; i++) {
        const f = i / 3; // Fractional part for house division

        // 2nd and 3rd houses
        const ra2 = calculatePlacidusRA(f, latRad, oblRad);
        houses[i] = normalizeAngle(radToDeg(ra2));
        houses[i + 6] = normalizeAngle(houses[i] + 180);

        // 11th and 12th houses
        const ra11 = calculatePlacidusRA(1 - f, latRad, oblRad);
        houses[10 + i] = normalizeAngle(radToDeg(ra11) + 180);
        houses[4 + i] = normalizeAngle(houses[10 + i] + 180);
    }

    return houses;
}

/**
 * Helper function for Placidus RA calculation
 * @param {number} f - Fractional time
 * @param {number} latRad - Latitude in radians
 * @param {number} oblRad - Obliquity in radians
 * @returns {number} Right ascension in radians
 */
function calculatePlacidusRA(f, latRad, oblRad) {
    const D = Math.asin(Math.sin(oblRad) * Math.sin(f * Math.PI / 2));
    const ampl = Math.asin(Math.tan(D) * Math.tan(latRad));
    return ampl;
}

/**
 * Calculate Ascendant for Placidus system
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Latitude in degrees
 * @returns {number} Ascendant in degrees
 */
function calculateAscendant(lst, latitude) {
    const lstRad = degToRad(lst);
    const latRad = degToRad(latitude);
    const oblRad = degToRad(WESTERN_ASTRO_CONSTANTS.EARTH_OBLIQUITY);

    let ascendant = Math.atan2(
        Math.cos(lstRad),
        -Math.sin(lstRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad)
    );

    return normalizeAngle(radToDeg(ascendant));
}

/**
 * Calculate Equal Houses (30° each from Ascendant degree)
 * @param {number} ascendantLongitude - Ascendant longitude in degrees
 * @returns {Array} Equal house cusps (12 values)
 */
function calculateEqualHouses(ascendantLongitude) {
    const houses = [];

    for (let i = 0; i < 12; i++) {
        houses.push(normalizeAngle(ascendantLongitude + (i * 30)));
    }

    return houses;
}

/**
 * Calculate Koch Houses
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @returns {Array} Koch house cusps (12 values)
 */
function calculateKochHouses(lst, latitude) {
    const houses = new Array(12);
    const latRad = degToRad(latitude);

    // Calculate Ascendant
    const ascendant = calculateAscendant(lst, latitude);
    houses[0] = ascendant;

    // Calculate MC
    houses[9] = normalizeAngle(lst);

    // Koch system uses time-based divisions
    const raMc = degToRad(houses[9]);
    const raAsc = degToRad(houses[0]);

    // Calculate other house cusps using Koch formula
    for (let i = 1; i < 12; i++) {
        if (i === 9) continue; // Skip MC

        const factor = i / 12;
        const ra = raAsc + factor * (raMc - raAsc);
        houses[i] = normalizeAngle(radToDeg(ra));
    }

    return houses;
}

module.exports = {
    calculatePlacidusHouses,
    calculateEqualHouses,
    calculateKochHouses
};