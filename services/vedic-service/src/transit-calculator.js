/**
 * ZodiaCore Transit Calculator (ZC1.2)
 *
 * Calculates planetary transit positions and aspects.
 * Handles astronomical calculations for current planetary positions.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { normalizeAngle } = require('./math-utils');
const { calculateJulianDay, calculateLahiriAyanamsa } = require('./astronomical-calculations');
const { calculatePlanetaryPositions } = require('./planetary-calculator');
const { ASTRO_CONSTANTS } = require('./astro-constants');

/**
 * Transit Calculator
 * Calculates planetary transit positions and aspects
 */
class TransitCalculator {
    constructor() {
        // Constructor can be expanded for additional initialization
    }

    /**
     * Calculate transit positions for a given date
     * @param {Date} transitDate - Date for transit calculation
     * @returns {Promise<Object>} Transit planetary positions
     * @throws {Error} If input validation fails or calculation errors occur
     */
    async calculateTransitPositions(transitDate) {
        // Input validation
        if (!(transitDate instanceof Date) || isNaN(transitDate.getTime())) {
            throw new Error('Invalid transit date: must be a valid Date object');
        }

        try {
            const julianDay = calculateJulianDay(
                transitDate.getFullYear(),
                transitDate.getMonth() + 1, // JavaScript months are 0-based, convert to 1-based
                transitDate.getDate(),
                transitDate.getHours(),
                transitDate.getMinutes(),
                transitDate.getSeconds()
            );

            const tropicalPositions = await calculatePlanetaryPositions(julianDay);
            const ayanamsa = calculateLahiriAyanamsa(transitDate.getFullYear());

            // Convert to sidereal positions
            const siderealPositions = {};
            for (const planet in tropicalPositions) {
                if (typeof tropicalPositions[planet] !== 'number' || isNaN(tropicalPositions[planet])) {
                    throw new Error(`Invalid tropical position for planet ${planet}`);
                }
                siderealPositions[planet] = normalizeAngle(tropicalPositions[planet] - ayanamsa);
            }

            return siderealPositions;
        } catch (error) {
            throw new Error(`Transit position calculation failed: ${error.message}`);
        }
    }

    /**
     * Calculate transit aspects to natal planets
     * @param {Object} natalPositions - Birth chart planetary positions
     * @param {Object} transitPositions - Current transit positions
     * @returns {Array} Transit aspects
     * @throws {Error} If input validation fails
     */
    calculateTransitAspects(natalPositions, transitPositions) {
        // Input validation
        if (!natalPositions || typeof natalPositions !== 'object') {
            throw new Error('Invalid natal positions: must be an object');
        }
        if (!transitPositions || typeof transitPositions !== 'object') {
            throw new Error('Invalid transit positions: must be an object');
        }

        const aspects = [];
        let iterationCount = 0;

        // Note: For large datasets with many planets, consider async processing or worker threads
        for (const natalPlanet in natalPositions) {
            if (!natalPositions[natalPlanet] || typeof natalPositions[natalPlanet].longitude !== 'number') {
                throw new Error(`Invalid natal position for planet ${natalPlanet}`);
            }

            for (const transitPlanet in transitPositions) {
                // Bounds checking for loop iterations
                if (iterationCount >= 10000) {
                    throw new Error('Loop iteration limit exceeded in transit aspect calculation');
                }
                iterationCount++;

                if (typeof transitPositions[transitPlanet] !== 'number' || isNaN(transitPositions[transitPlanet])) {
                    throw new Error(`Invalid transit position for planet ${transitPlanet}`);
                }

                const aspect = this.calculateTransitAspect(
                    natalPositions[natalPlanet].longitude,
                    transitPositions[transitPlanet]
                );

                if (aspect !== 'NO_ASPECT') {
                    const orb = this.calculateAspectOrb(
                        natalPositions[natalPlanet].longitude,
                        transitPositions[transitPlanet],
                        aspect
                    );
                    aspects.push({
                        natalPlanet,
                        transitPlanet,
                        aspect,
                        orb,
                        strength: this.calculateAspectStrength(aspect, orb)
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Calculate transit aspect between two planets
     * @param {number} planet1Longitude - Longitude of first planet
     * @param {number} planet2Longitude - Longitude of second planet
     * @returns {string} Aspect type
     */
    calculateTransitAspect(planet1Longitude, planet2Longitude) {
        let angle = Math.abs(planet1Longitude - planet2Longitude);
        angle = Math.min(angle, 360 - angle); // Normalize to 0-180

        // Determine aspect type with proper orb handling
        const aspects = [
            { type: 'CONJUNCTION', angle: 0, orb: ASTRO_CONSTANTS.ASPECT_ORBS.CONJUNCTION },
            { type: 'SEXTILE', angle: 60, orb: ASTRO_CONSTANTS.ASPECT_ORBS.SEXTILE },
            { type: 'SQUARE', angle: 90, orb: ASTRO_CONSTANTS.ASPECT_ORBS.SQUARE },
            { type: 'TRINE', angle: 120, orb: ASTRO_CONSTANTS.ASPECT_ORBS.TRINE },
            { type: 'OPPOSITION', angle: 180, orb: ASTRO_CONSTANTS.ASPECT_ORBS.OPPOSITION }
        ];

        for (const aspect of aspects) {
            if (Math.abs(angle - aspect.angle) <= aspect.orb) {
                return aspect.type;
            }
        }

        return 'NO_ASPECT';
    }

    /**
     * Calculate precise orb for aspect
     * @param {number} longitude1 - First longitude
     * @param {number} longitude2 - Second longitude
     * @param {string} aspect - Aspect type
     * @returns {number} Orb value
     */
    calculateAspectOrb(longitude1, longitude2, aspect) {
        let angle = Math.abs(longitude1 - longitude2);
        angle = Math.min(angle, 360 - angle);

        const aspectAngles = {
            CONJUNCTION: 0,
            SEXTILE: 60,
            SQUARE: 90,
            TRINE: 120,
            OPPOSITION: 180
        };

        return Math.abs(angle - aspectAngles[aspect]);
    }

    /**
     * Calculate aspect strength based on orb
     * @param {string} aspect - Aspect type
     * @param {number} orb - Orb value
     * @returns {number} Strength (0-1)
     */
    calculateAspectStrength(aspect, orb) {
        const maxOrb = ASTRO_CONSTANTS.ASPECT_ORBS[aspect];
        if (maxOrb <= 0) return 0;
        return Math.max(0, (maxOrb - orb) / maxOrb);
    }
}

module.exports = TransitCalculator;