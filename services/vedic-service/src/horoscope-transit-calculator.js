/**
 * ZodiaCore - Horoscope Transit Calculator
 *
 * Specialized transit calculator for Vedic horoscope generation.
 * Handles current planetary positions and transit aspects for prediction calculations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { calculateJulianDay, calculateLahiriAyanamsa } = require('./astronomical-calculations');
const { calculatePlanetaryPositions } = require('./planetary-calculator');
const { normalizeAngle, angularSeparation } = require('./math-utils');
const { HOROSCOPE_CONSTANTS, ASPECT_CALCULATION_CONSTANTS, CACHE_CONSTANTS } = require('./horoscope-constants');
const { astrologyLogger, withPerformanceMonitoring } = require('./logger');
const { astrologyCache } = require('./cache');
const { CalculationError, ValidationError, ErrorFactory } = require('./errors');

/**
 * Transit Calculator for Horoscope Generation
 * Calculates current planetary transits and aspects for Vedic horoscopes
 */
class TransitCalculator {
    constructor() {
        this.planetaryCalculator = { calculateAccuratePlanets: calculatePlanetaryPositions };
    }

    /**
     * Calculate current transit positions for horoscope generation
     * @param {Date} date - Date for transit calculation
     * @param {Object} location - Location object with latitude/longitude (optional)
     * @returns {Object} Transit positions with metadata
     */
    calculateCurrentTransits(date, location = null) {
        // Input validation
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw ErrorFactory.validation('Invalid date provided for transit calculation', 'date', date);
        }

        // Validate location if provided
        if (location && (typeof location.latitude !== 'number' || typeof location.longitude !== 'number')) {
            throw ErrorFactory.validation('Invalid location provided', 'location', location);
        }

        const cacheKey = astrologyCache.generateTransitKey(date, location);

        return astrologyCache.getOrSet(cacheKey, async () => {
            const timer = astrologyLogger.startTimer('calculateCurrentTransits');

            try {
                astrologyLogger.debug('Calculating transit positions', { date: date.toISOString(), location });

                const julianDay = calculateJulianDay(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds()
                );

                const ayanamsa = await this.getAyanamsaWithCache(date.getFullYear());
                const tropicalPositions = this.planetaryCalculator.calculateAccuratePlanets(julianDay);
                const siderealPositions = this.tropicalToSidereal(tropicalPositions, ayanamsa);

                const result = {
                    positions: siderealPositions,
                    date: date,
                    ayanamsa: ayanamsa,
                    julianDay: julianDay,
                    location: location
                };

                timer.end({ success: true });
                return result;

            } catch (error) {
                timer.end({ success: false, error: error.message });
                throw ErrorFactory.calculation('Failed to calculate transit positions', 'calculateCurrentTransits', { date, location });
            }
        }, CACHE_CONSTANTS.TRANSIT_CACHE_TTL);
    }

    /**
     * Get ayanamsa with caching
     * @param {number} year - Year for ayanamsa calculation
     * @returns {number} Ayanamsa value
     */
    async getAyanamsaWithCache(year) {
        const cacheKey = astrologyCache.generateAyanamsaKey(year);

        return astrologyCache.getOrSet(cacheKey, async () => {
            try {
                const ayanamsa = calculateLahiriAyanamsa(year);
                astrologyLogger.debug('Calculated ayanamsa', { year, ayanamsa });
                return ayanamsa;
            } catch (error) {
                throw ErrorFactory.calculation('Failed to calculate ayanamsa', 'calculateLahiriAyanamsa', { year });
            }
        }, CACHE_CONSTANTS.AYANAMSA_CACHE_TTL);
    }

    /**
     * Convert tropical positions to sidereal zodiac
     * @param {Object} tropicalPositions - Tropical longitudes
     * @param {number} ayanamsa - Ayanamsa correction in degrees
     * @returns {Object} Sidereal positions
     */
    tropicalToSidereal(tropicalPositions, ayanamsa) {
        const siderealPositions = {};

        for (const planet in tropicalPositions) {
            if (typeof tropicalPositions[planet] === 'number') {
                siderealPositions[planet] = normalizeAngle(tropicalPositions[planet] - ayanamsa);
            }
        }

        return siderealPositions;
    }

    /**
     * Calculate transit aspects to natal planets
     * @param {Object} natalChart - Birth chart with planetary positions
     * @param {Object} transitPositions - Current transit positions
     * @returns {Object} Transit aspects organized by natal planet
     */
    calculateTransitAspects(natalChart, transitPositions) {
        const aspects = {};

        // Validate inputs
        if (!natalChart || !natalChart.planets) {
            throw new Error('Invalid natal chart provided');
        }
        if (!transitPositions || !transitPositions.positions) {
            throw new Error('Invalid transit positions provided');
        }

        for (const natalPlanet in natalChart.planets) {
            aspects[natalPlanet] = {};

            for (const transitPlanet in transitPositions.positions) {
                const angle = angularSeparation(
                    natalChart.planets[natalPlanet].longitude,
                    transitPositions.positions[transitPlanet]
                );

                aspects[natalPlanet][transitPlanet] = {
                    angle: angle,
                    aspect: this.determineAspect(angle),
                    strength: this.calculateAspectStrength(angle)
                };
            }
        }

        return aspects;
    }

    /**
     * Determine the astrological aspect based on angle
     * @param {number} angle - Angular separation in degrees
     * @returns {string|null} Aspect name or null
     */
    determineAspect(angle) {
        const aspects = [
            { name: 'CONJUNCTION', angle: 0, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.CONJUNCTION },
            { name: 'SEXTILE', angle: 60, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.SEXTILE },
            { name: 'SQUARE', angle: 90, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.SQUARE },
            { name: 'TRINE', angle: 120, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.TRINE },
            { name: 'OPPOSITION', angle: 180, orb: HOROSCOPE_CONSTANTS.ASPECT_ORBS.OPPOSITION }
        ];

        for (const aspect of aspects) {
            if (Math.abs(angle - aspect.angle) <= aspect.orb) {
                return aspect.name;
            }
        }

        return null;
    }

    /**
     * Calculate aspect strength based on exactness
     * @param {number} angle - Angular separation from exact aspect
     * @returns {number} Strength value (0-1)
     */
    calculateAspectStrength(angle) {
        // Strength decreases as angle deviates from exact aspect
        const deviation = Math.abs(angle % 30 - 0); // 0 is strongest
        const strength = Math.max(0, 1 - (deviation / ASPECT_CALCULATION_CONSTANTS.MAX_ASPECT_ORB));

        // Round to specified precision
        return Math.round(strength * Math.pow(10, ASPECT_CALCULATION_CONSTANTS.ASPECT_STRENGTH_PRECISION)) /
               Math.pow(10, ASPECT_CALCULATION_CONSTANTS.ASPECT_STRENGTH_PRECISION);
    }

    /**
     * Calculate planetary influence score for horoscope predictions
     * @param {string} planet - Planet name
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @returns {number} Influence score (0-1)
     */
    calculatePlanetInfluence(planet, transits, aspects) {
        const weight = HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS[planet] || 0.5;
        let influence = weight;

        // Adjust based on aspects
        if (aspects && aspects[planet]) {
            let aspectModifier = 0;
            let aspectCount = 0;

            for (const transitPlanet in aspects[planet]) {
                const aspect = aspects[planet][transitPlanet];
                if (aspect.aspect) {
                    // Positive aspects increase influence, negative decrease
                    const aspectMultiplier = this.getAspectMultiplier(aspect.aspect);
                    aspectModifier += aspect.strength * aspectMultiplier;
                    aspectCount++;
                }
            }

            if (aspectCount > 0) {
                influence *= (1 + aspectModifier / aspectCount);
            }
        }

        return Math.max(0, Math.min(1, influence));
    }

    /**
     * Get aspect multiplier for influence calculation
     * @param {string} aspect - Aspect name
     * @returns {number} Multiplier value
     */
    getAspectMultiplier(aspect) {
        const multipliers = {
            CONJUNCTION: 0.2,  // Neutral to slightly positive
            SEXTILE: 0.3,      // Harmonious
            SQUARE: -0.2,      // Challenging
            TRINE: 0.4,        // Very harmonious
            OPPOSITION: -0.3   // Tense
        };

        return multipliers[aspect] || 0;
    }

    /**
     * Identify key transits for the period
     * @param {Object} transits - Transit positions
     * @returns {Array} Key transit events
     */
    identifyKeyTransits(transits) {
        const keyTransits = [];

        // Check for planets changing signs
        for (const planet in transits.positions) {
            const longitude = transits.positions[planet];
            const sign = Math.floor(longitude / 30);
            const degree = longitude % 30;

            // Planets at critical degrees (0, 15, 29) are significant
            if (degree <= 1 || (degree >= 14 && degree <= 16) || degree >= 28) {
                keyTransits.push({
                    planet: planet,
                    type: 'critical_degree',
                    sign: sign,
                    degree: degree
                });
            }
        }

        return keyTransits;
    }
}

module.exports = TransitCalculator;