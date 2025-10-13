/**
 * ZodiaCore - Aspect Calculator
 *
 * Core aspect calculation engine for Vedic astrology.
 * Calculates planetary aspects, orbs, and aspect strengths.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { HORARY_CONSTANTS } = require('./horary-constants');
const { normalizeAngle } = require('./math-utils');

/**
 * Aspect Calculator Class
 * Handles all aspect calculations between planets and points
 */
class AspectCalculator {
    constructor() {
        this.aspectTypes = HORARY_CONSTANTS.ASPECT_TYPES;
    }

    /**
     * Calculate aspect between two planets
     * @param {string} planet1 - First planet name
     * @param {string} planet2 - Second planet name
     * @param {Object} chart - Chart data with planet positions
     * @returns {Object|null} Aspect data or null if no aspect
     */
    getAspectBetween(planet1, planet2, chart) {
        if (!chart.planets[planet1] || !chart.planets[planet2]) {
            return null;
        }

        const lon1 = chart.planets[planet1].longitude;
        const lon2 = chart.planets[planet2].longitude;

        return this.calculateAspect(lon1, lon2);
    }

    /**
     * Get all aspects between two planets (returns array)
     * @param {string} planet1 - First planet name
     * @param {string} planet2 - Second planet name
     * @param {Object} chart - Chart data with planet positions
     * @returns {Array} Array of aspect data
     */
    getAspectsBetween(planet1, planet2, chart) {
        const aspect = this.getAspectBetween(planet1, planet2, chart);
        return aspect ? [aspect] : [];
    }

    /**
     * Calculate aspect between planet and a fixed point
     * @param {number} longitude - Planet longitude
     * @param {number} point - Fixed point longitude
     * @returns {Object|null} Aspect data or null if no aspect
     */
    getAspectToPoint(longitude, point) {
        return this.calculateAspect(longitude, point);
    }

    /**
     * Get all aspects from a planet to other planets
     * @param {string} planet - Planet name
     * @param {Object} chart - Chart data
     * @returns {Array} Array of aspect objects
     */
    getAspectsFromPlanet(planet, chart) {
        const aspects = [];
        const planetLon = chart.planets[planet].longitude;

        for (const [otherPlanet, data] of Object.entries(chart.planets)) {
            if (otherPlanet !== planet) {
                const aspect = this.getAspectBetween(planet, otherPlanet, chart);
                if (aspect) {
                    aspects.push({
                        planet: otherPlanet,
                        ...aspect
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Get aspects to a specific point from all planets
     * @param {number} point - Longitude of the point
     * @param {Object} chart - Chart data
     * @returns {Array} Array of aspect objects
     */
    getAspectsToPoint(point, chart) {
        const aspects = [];

        for (const [planet, data] of Object.entries(chart.planets)) {
            const aspect = this.getAspectToPoint(data.longitude, point);
            if (aspect) {
                aspects.push({
                    planet: planet,
                    ...aspect
                });
            }
        }

        return aspects;
    }

    /**
     * Check if two planets have any aspect
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {Object} chart - Chart data
     * @returns {boolean} True if aspect exists
     */
    hasAspect(planet1, planet2, chart) {
        return this.getAspectBetween(planet1, planet2, chart) !== null;
    }

    /**
     * Calculate the aspect between two longitudes
     * @param {number} lon1 - First longitude
     * @param {number} lon2 - Second longitude
     * @returns {Object|null} Aspect data or null
     */
    calculateAspect(lon1, lon2) {
        // Calculate the smallest angle between the two points
        let diff = Math.abs(lon1 - lon2);
        if (diff > 180) {
            diff = 360 - diff;
        }

        // Check each aspect type
        for (const [aspectName, aspectData] of Object.entries(this.aspectTypes)) {
            const orb = Math.abs(diff - aspectData.angle);
            if (orb <= aspectData.orb) {
                return {
                    aspect: aspectData.name,
                    angle: aspectData.angle,
                    orb: orb,
                    exactness: 1 - (orb / aspectData.orb), // 1.0 = exact, 0.0 = at orb limit
                    strength: this.calculateAspectStrength(aspectData.name, orb, aspectData.orb)
                };
            }
        }

        return null;
    }

    /**
     * Calculate aspect strength based on type and orb
     * @param {string} aspectType - Type of aspect
     * @param {number} orb - Actual orb
     * @param {number} maxOrb - Maximum orb for this aspect
     * @returns {number} Strength from 0.0 to 1.0
     */
    calculateAspectStrength(aspectType, orb, maxOrb) {
        // Base strength by aspect type
        const baseStrengths = {
            conjunction: 1.0,
            trine: 0.8,
            sextile: 0.6,
            square: 0.4,
            opposition: 0.5
        };

        const baseStrength = baseStrengths[aspectType] || 0.3;

        // Reduce strength based on orb
        const orbFactor = 1 - (orb / maxOrb);

        return baseStrength * orbFactor;
    }

    /**
     * Get aspect favorability
     * @param {string} aspectType - Type of aspect
     * @returns {string} Favorability level
     */
    getAspectFavorability(aspectType) {
        const favorability = {
            conjunction: 'MIXED',
            trine: 'FAVORABLE',
            sextile: 'FAVORABLE',
            square: 'CHALLENGING',
            opposition: 'CHALLENGING'
        };

        return favorability[aspectType] || 'NEUTRAL';
    }

    /**
     * Get aspect interpretation
     * @param {string} aspectType - Type of aspect
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {string} Interpretation text
     */
    getAspectInterpretation(aspectType, planet1, planet2) {
        const interpretations = {
            conjunction: `${planet1} and ${planet2} energies are combined and intensified`,
            trine: `${planet1} and ${planet2} work harmoniously together`,
            sextile: `${planet1} and ${planet2} support each other constructively`,
            square: `${planet1} and ${planet2} create tension and challenges`,
            opposition: `${planet1} and ${planet2} represent opposing forces that need balance`
        };

        return interpretations[aspectType] ||
               `${planet1} and ${planet2} have a ${aspectType} aspect`;
    }

    /**
     * Find applying aspects (aspect becoming exact in the future)
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {Object} chart - Chart data
     * @param {number} speed1 - Daily speed of planet1 in degrees
     * @param {number} speed2 - Daily speed of planet2 in degrees
     * @returns {Object|null} Applying aspect data
     */
    getApplyingAspect(planet1, planet2, chart, speed1 = 1, speed2 = 1) {
        const aspect = this.getAspectBetween(planet1, planet2, chart);
        if (!aspect) return null;

        const lon1 = chart.planets[planet1].longitude;
        const lon2 = chart.planets[planet2].longitude;

        // Calculate relative speed
        const relativeSpeed = Math.abs(speed1 - speed2);

        if (relativeSpeed < 0.1) return null; // Too slow to apply

        // Calculate time to exact aspect
        const remainingAngle = aspect.angle - Math.abs(lon1 - lon2);
        if (remainingAngle <= 0) return null; // Already separating

        const daysToExact = remainingAngle / relativeSpeed;

        return {
            ...aspect,
            applying: true,
            daysToExact: daysToExact,
            timeToExact: this.formatTimeToExact(daysToExact)
        };
    }

    /**
     * Format time to exact aspect
     * @param {number} days - Days until exact
     * @returns {string} Formatted time string
     */
    formatTimeToExact(days) {
        if (days < 1) return 'within 1 day';
        if (days < 7) return `within ${Math.ceil(days)} days`;
        if (days < 30) return `within ${Math.ceil(days / 7)} weeks`;
        if (days < 365) return `within ${Math.ceil(days / 30)} months`;
        return `within ${Math.ceil(days / 365)} years`;
    }

    /**
     * Get parallel/contraparallel aspects (declination-based)
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {Object} chart - Chart data with declination info
     * @returns {Object|null} Parallel aspect data
     */
    getParallelAspect(planet1, planet2, chart) {
        if (!chart.planets[planet1].declination || !chart.planets[planet2].declination) {
            return null;
        }

        const dec1 = chart.planets[planet1].declination;
        const dec2 = chart.planets[planet2].declination;

        const diff = Math.abs(dec1 - dec2);

        if (diff <= 1.0) { // Within 1 degree orb
            return {
                aspect: Math.abs(dec1 - dec2) < 0.1 ? 'parallel' : 'contraparallel',
                orb: diff,
                strength: 1 - (diff / 1.0),
                type: 'declination'
            };
        }

        return null;
    }
}

module.exports = AspectCalculator;