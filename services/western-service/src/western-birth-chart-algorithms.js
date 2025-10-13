/**
 * Western Astrology Birth Chart Algorithms
 *
 * This module provides core algorithms for calculating key birth chart elements
 * including the Ascendant (Rising Sign) and Midheaven (MC).
 *
 * @version 1.0.0
 * @since 2025-10-08
 */

const { WESTERN_ASTRO_CONSTANTS } = require('./western-astro-constants');
const { degToRad, radToDeg, normalizeAngle } = require('./western-math-utils');

/**
 * Calculate Ascendant (Rising Sign) for given time and place
 * @param {number} lst - Local Sidereal Time in degrees
 * @param {number} latitude - Geographical latitude in degrees
 * @returns {number} Ascendant longitude in degrees
 * @throws {Error} If latitude is out of valid range
 */
function calculateAscendant(lst, latitude) {
    // Bounds checking for latitude to prevent domain errors in trigonometric functions
    if (Math.abs(latitude) >= 90) {
        throw new Error('Latitude must be between -90 and 90 degrees');
    }

    const lstRad = degToRad(lst);
    const latRad = degToRad(latitude);
    const obliquityRad = degToRad(WESTERN_ASTRO_CONSTANTS.EARTH_OBLIQUITY);

    // Calculate ascendant using spherical trigonometry
    let ascendant = Math.atan2(
        Math.cos(lstRad),
        -Math.sin(lstRad) * Math.cos(obliquityRad) - Math.tan(latRad) * Math.sin(obliquityRad)
    );

    return normalizeAngle(radToDeg(ascendant));
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

module.exports = {
    calculateAscendant,
    calculateMidheaven
};