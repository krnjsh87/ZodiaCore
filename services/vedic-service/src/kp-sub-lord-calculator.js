/**
 * ZodiaCore - KP Sub Lord Calculator
 *
 * Implements Krishnamurti Paddhati (KP) sub-lord calculations for precise astrological timing.
 * This module provides core functionality for determining sub-lords, ruling planets,
 * and cuspal interlinks used in KP astrology predictions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { KP_CONSTANTS } = require('./advanced-astrology-constants');
const { ASTRO_CONSTANTS } = require('./astro-constants');

/**
 * KP Sub-Lord Calculator Class
 * Handles all KP astrology sub-lord calculations and ruling planet determinations
 */
class KPSubLordCalculator {
    /**
     * Initialize the KP calculator with dasha sequence and star lord mappings
     */
    constructor() {
        this.dashaSequence = KP_CONSTANTS.DASHA_SEQUENCE;
        this.starLords = KP_CONSTANTS.STAR_LORDS;
        this.dayLords = KP_CONSTANTS.DAY_LORDS;
        this.signLords = KP_CONSTANTS.SIGN_LORDS;
    }

    /**
     * Calculate sub-lord for a given longitude
     * @param {number} longitude - Planet or cusp longitude in degrees (0-360)
     * @returns {Object} Sub-lord calculation result
     */
    calculateSubLord(longitude) {
        try {
            // Normalize longitude to 0-360 range
            const normalizedLongitude = ((longitude % 360) + 360) % 360;

            // Determine sign number (0-11)
            const signNumber = Math.floor(normalizedLongitude / ASTRO_CONSTANTS.DEGREES_PER_SIGN);

            // Degrees within the sign (0-29.999...)
            const degreesInSign = normalizedLongitude % ASTRO_CONSTANTS.DEGREES_PER_SIGN;

            // Calculate sub-lord segment (each sign divided into 9 segments of ~3.33° each)
            // KP uses 2.5° segments as per documentation, but we'll use 9 equal divisions
            const subLordIndex = Math.floor(degreesInSign / KP_CONSTANTS.DEGREES_PER_SUB_LORD_SEGMENT);

            // Ensure index is within bounds
            const validIndex = Math.min(subLordIndex, this.dashaSequence.length - 1);

            // Get the planet for this sub-lord position
            const subLordPlanet = this.dashaSequence[validIndex].planet;

            return {
                planet: subLordPlanet,
                sign: signNumber,
                degree: degreesInSign,
                subLordSegment: validIndex,
                longitude: normalizedLongitude,
                success: true
            };
        } catch (error) {
            console.error('Error calculating sub-lord:', error);
            return {
                planet: null,
                sign: null,
                degree: null,
                subLordSegment: null,
                longitude: normalizedLongitude,
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate cuspal sub-lords for all house cusps
     * @param {Array<number>} houseCusps - Array of 12 house cusp longitudes
     * @returns {Object} Cuspal sub-lords for each house
     */
    calculateCuspalSubLords(houseCusps) {
        try {
            const cuspalSubLords = {};

            if (!Array.isArray(houseCusps) || houseCusps.length !== ASTRO_CONSTANTS.HOUSES_COUNT) {
                throw new Error('Invalid house cusps array');
            }

            for (let house = 1; house <= ASTRO_CONSTANTS.HOUSES_COUNT; house++) {
                const cuspLongitude = houseCusps[house - 1]; // Array is 0-indexed
                cuspalSubLords[house] = this.calculateSubLord(cuspLongitude);
            }

            return {
                cuspalSubLords: cuspalSubLords,
                success: true
            };
        } catch (error) {
            console.error('Error calculating cuspal sub-lords:', error);
            return {
                cuspalSubLords: null,
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Determine ruling planets for current moment
     * @param {Date} currentTime - Current date and time
     * @param {Object} birthChart - Birth chart data with planets and ascendant
     * @returns {Object} Ruling planets analysis
     */
    calculateRulingPlanets(currentTime, birthChart) {
        try {
            const rulingPlanets = {
                ascendantSubLord: null,
                moonSubLord: null,
                dayLord: null,
                signLord: null
            };

            // Validate input
            if (!currentTime || !birthChart) {
                throw new Error('Invalid current time or birth chart data');
            }

            // Ascendant sub-lord
            if (birthChart.ascendant && birthChart.ascendant.longitude !== undefined) {
                rulingPlanets.ascendantSubLord = this.calculateSubLord(birthChart.ascendant.longitude);
            }

            // Moon sub-lord
            if (birthChart.planets && birthChart.planets.MOON && birthChart.planets.MOON.longitude !== undefined) {
                rulingPlanets.moonSubLord = this.calculateSubLord(birthChart.planets.MOON.longitude);
            }

            // Day lord based on weekday
            const dayOfWeek = currentTime.getDay();
            rulingPlanets.dayLord = {
                planet: this.dayLords[dayOfWeek],
                dayOfWeek: dayOfWeek,
                dayName: this.getDayName(dayOfWeek)
            };

            // Sign lord of current ascendant
            if (birthChart.ascendant && birthChart.ascendant.sign !== undefined) {
                rulingPlanets.signLord = {
                    planet: this.signLords[birthChart.ascendant.sign],
                    sign: birthChart.ascendant.sign,
                    signName: this.getSignName(birthChart.ascendant.sign)
                };
            }

            return {
                rulingPlanets: rulingPlanets,
                timestamp: currentTime.toISOString(),
                success: true
            };
        } catch (error) {
            console.error('Error calculating ruling planets:', error);
            return {
                rulingPlanets: null,
                timestamp: currentTime ? currentTime.toISOString() : null,
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get significators for specific life areas
     * @param {string} eventType - Type of event (marriage, career, health, etc.)
     * @param {number} targetHouse - Target house number (optional)
     * @returns {Array<string>} Array of significator planets
     */
    getSignificatorsForEvent(eventType, targetHouse = null) {
        try {
            const significators = KP_CONSTANTS.SIGNIFICATORS[eventType];

            if (!significators && !targetHouse) {
                return [];
            }

            // Use specified significators or target house
            const houseNumbers = significators || [targetHouse];

            // In a full implementation, this would analyze the birth chart
            // For now, return the house numbers as they represent significator houses
            return houseNumbers;
        } catch (error) {
            console.error('Error getting significators:', error);
            return [];
        }
    }

    /**
     * Check if ruling planets are significators
     * @param {Array<string>} significators - Array of significator planets
     * @param {Object} rulingPlanets - Ruling planets object
     * @returns {Array<Object>} Array of ruling significators
     */
    checkRulingPlanets(significators, rulingPlanets) {
        try {
            const rulingSignificators = [];

            if (!significators || !rulingPlanets) {
                return rulingSignificators;
            }

            // Check each ruling planet
            Object.entries(rulingPlanets).forEach(([rulingType, rulingData]) => {
                if (rulingData && rulingData.planet && significators.includes(rulingData.planet)) {
                    rulingSignificators.push({
                        type: rulingType,
                        planet: rulingData.planet,
                        isSignificator: true
                    });
                }
            });

            return rulingSignificators;
        } catch (error) {
            console.error('Error checking ruling planets:', error);
            return [];
        }
    }

    /**
     * Calculate link strength between cusps
     * @param {Object} cusp1 - First cusp sub-lord data
     * @param {Object} cusp2 - Second cusp sub-lord data
     * @returns {number} Link strength (0-1)
     */
    calculateLinkStrength(cusp1, cusp2) {
        try {
            if (!cusp1 || !cusp2 || !cusp1.success || !cusp2.success) {
                return 0;
            }

            // Same planet = strong link
            if (cusp1.planet === cusp2.planet) {
                return 1.0;
            }

            // Friendly planets = medium link
            if (this.arePlanetsFriendly(cusp1.planet, cusp2.planet)) {
                return 0.7;
            }

            // Neutral planets = weak link
            if (this.arePlanetsNeutral(cusp1.planet, cusp2.planet)) {
                return 0.4;
            }

            // Enemy planets = very weak or no link
            return 0.1;
        } catch (error) {
            console.error('Error calculating link strength:', error);
            return 0;
        }
    }

    /**
     * Get day name from day number
     * @param {number} dayOfWeek - Day of week (0-6)
     * @returns {string} Day name
     */
    getDayName(dayOfWeek) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return dayNames[dayOfWeek] || 'Unknown';
    }

    /**
     * Get sign name from sign number
     * @param {number} signNumber - Sign number (0-11)
     * @returns {string} Sign name
     */
    getSignName(signNumber) {
        const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        return signNames[signNumber] || 'Unknown';
    }

    /**
     * Check if two planets are friendly
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if friendly
     */
    arePlanetsFriendly(planet1, planet2) {
        // Simplified friendship matrix - in full implementation would be more complex
        const friendships = {
            'SUN': ['MOON', 'MARS', 'JUPITER'],
            'MOON': ['SUN', 'MERCURY', 'JUPITER'],
            'MARS': ['SUN', 'MOON', 'JUPITER'],
            'MERCURY': ['SUN', 'VENUS', 'RAHU'],
            'JUPITER': ['SUN', 'MOON', 'MARS', 'VENUS'],
            'VENUS': ['MERCURY', 'SATURN', 'RAHU'],
            'SATURN': ['MERCURY', 'VENUS', 'RAHU'],
            'RAHU': ['MERCURY', 'VENUS', 'SATURN', 'KETU'],
            'KETU': ['MARS', 'VENUS', 'RAHU']
        };

        return friendships[planet1]?.includes(planet2) || false;
    }

    /**
     * Check if two planets are neutral
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if neutral
     */
    arePlanetsNeutral(planet1, planet2) {
        // Planets that are neither friends nor enemies
        return !this.arePlanetsFriendly(planet1, planet2) && !this.arePlanetsEnemies(planet1, planet2);
    }

    /**
     * Check if two planets are enemies
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if enemies
     */
    arePlanetsEnemies(planet1, planet2) {
        const enemies = {
            'SUN': ['VENUS', 'SATURN', 'RAHU'],
            'MOON': ['RAHU', 'KETU'],
            'MARS': ['MERCURY', 'KETU'],
            'MERCURY': ['MOON', 'RAHU'],
            'JUPITER': ['MERCURY', 'VENUS', 'RAHU'],
            'VENUS': ['SUN', 'MOON', 'RAHU'],
            'SATURN': ['SUN', 'MOON', 'MARS'],
            'RAHU': ['SUN', 'MOON', 'MARS'],
            'KETU': ['SUN', 'MOON', 'MARS']
        };

        return enemies[planet1]?.includes(planet2) || false;
    }
}

module.exports = KPSubLordCalculator;