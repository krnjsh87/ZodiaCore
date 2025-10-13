/**
 * Western Aspect Detector
 * ZC3.12 Western Astrology Deep Horoscope System
 *
 * Detects planetary aspects and chart configurations:
 * - Major aspects (conjunction, sextile, square, trine, opposition)
 * - Minor aspects (semi-sextile, quintile, etc.)
 * - Chart patterns (Grand Trine, T-Square, Stellium)
 */

const { WESTERN_INTERPRETATION_CONSTANTS } = require('./western-deep-horoscope-constants');
const { WesternEssentialDignityCalculator } = require('./western-essential-dignity-calculator');

class WesternAspectDetector {
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.aspectRules = this.loadAspectRules();
        this.dignityCalculator = new WesternEssentialDignityCalculator(birthChart);
    }

    /**
     * Load aspect rules from constants
     */
    loadAspectRules() {
        return {
            CONJUNCTION: { angle: 0, orb: WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.CONJUNCTION },
            SEXTILE: { angle: 60, orb: WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.SEXTILE },
            SQUARE: { angle: 90, orb: WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.SQUARE },
            TRINE: { angle: 120, orb: WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.TRINE },
            OPPOSITION: { angle: 180, orb: WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.OPPOSITION }
        };
    }

    /**
     * Detect all applicable aspects and configurations in the chart
     * @returns {Object} All aspects and configurations
     */
    detectAllAspects() {
        const aspects = {
            majorAspects: this.detectMajorAspects(),
            minorAspects: this.detectMinorAspects(),
            configurations: this.detectConfigurations()
        };

        return aspects;
    }

    /**
     * Detect major aspects between planets
     * @returns {Array} Array of major aspect objects
     */
    detectMajorAspects() {
        const majorAspects = [];
        const planets = Object.keys(this.birthChart.planets);

        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const planet1 = planets[i];
                const planet2 = planets[j];
                const aspect = this.findAspect(planet1, planet2);

                if (aspect) {
                    majorAspects.push({
                        planets: [planet1, planet2],
                        aspect: aspect.type,
                        orb: aspect.orb,
                        strength: this.calculateAspectStrength(aspect),
                        interpretation: this.interpretAspect(planet1, planet2, aspect.type),
                        applying: aspect.applying,
                        exact: aspect.exact
                    });
                }
            }
        }

        return majorAspects;
    }

    /**
     * Find aspect between two planets
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {Object|null} Aspect data or null
     */
    findAspect(planet1, planet2) {
        const pos1 = this.birthChart.planets[planet1].longitude;
        const pos2 = this.birthChart.planets[planet2].longitude;
        const diff = Math.abs(pos1 - pos2);
        const minDiff = Math.min(diff, 360 - diff);

        for (const [aspectType, aspectData] of Object.entries(this.aspectRules)) {
            if (Math.abs(minDiff - aspectData.angle) <= aspectData.orb) {
                return {
                    type: aspectType,
                    orb: Math.abs(minDiff - aspectData.angle),
                    applying: this.isApplying(pos1, pos2, aspectData.angle),
                    exact: minDiff === aspectData.angle,
                    angle: minDiff
                };
            }
        }

        return null;
    }

    /**
     * Check if aspect is applying (planets moving toward exact aspect)
     * @param {number} pos1 - Position of first planet
     * @param {number} pos2 - Position of second planet
     * @param {number} aspectAngle - Target aspect angle
     * @returns {boolean} True if applying
     */
    isApplying(pos1, pos2, aspectAngle) {
        // Simplified: consider applying if within half the maximum orb
        // In reality, this would require velocity calculations
        const diff = Math.abs(pos1 - pos2);
        const minDiff = Math.min(diff, 360 - diff);
        const orb = Math.abs(minDiff - aspectAngle);

        // Get max orb based on aspect angle
        let maxOrb = 8; // Default
        if (aspectAngle === 0) maxOrb = WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.CONJUNCTION;
        else if (aspectAngle === 60) maxOrb = WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.SEXTILE;
        else if (aspectAngle === 90) maxOrb = WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.SQUARE;
        else if (aspectAngle === 120) maxOrb = WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.TRINE;
        else if (aspectAngle === 180) maxOrb = WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS.OPPOSITION;

        return orb < maxOrb / 2;
    }

    /**
     * Calculate aspect strength based on orb
     * @param {Object} aspect - Aspect data
     * @returns {number} Strength value (0-1)
     */
    calculateAspectStrength(aspect) {
        const maxOrb = WESTERN_INTERPRETATION_CONSTANTS.ASPECT_ORBS[aspect.type];
        const orbPenalty = aspect.orb / maxOrb;
        const applyingBonus = aspect.applying ? 0.1 : 0;
        const exactBonus = aspect.exact ? 0.1 : 0;

        return Math.max(0.1, 1 - orbPenalty + applyingBonus + exactBonus);
    }

    /**
     * Interpret aspect between two planets
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {string} aspectType - Type of aspect
     * @returns {string} Interpretation text
     */
    interpretAspect(planet1, planet2, aspectType) {
        const interpretations = WESTERN_INTERPRETATION_CONSTANTS.ASPECT_INTERPRETATIONS;
        const key = `${planet1}-${planet2}`;

        if (interpretations[key] && interpretations[key][aspectType.toLowerCase()]) {
            return interpretations[key][aspectType.toLowerCase()];
        }

        // Generic interpretations
        const genericInterpretations = {
            CONJUNCTION: `Unity and blending of ${planet1} and ${planet2} energies`,
            SEXTILE: `Harmonious cooperation between ${planet1} and ${planet2}`,
            SQUARE: `Tension and challenge between ${planet1} and ${planet2} energies`,
            TRINE: `Easy flow and natural harmony between ${planet1} and ${planet2}`,
            OPPOSITION: `Balance and integration needed between ${planet1} and ${planet2}`
        };

        return genericInterpretations[aspectType] || `${aspectType} aspect between ${planet1} and ${planet2}`;
    }

    /**
     * Detect minor aspects (simplified implementation)
     * @returns {Array} Minor aspects
     */
    detectMinorAspects() {
        // For now, return empty array - minor aspects can be added later
        return [];
    }

    /**
     * Detect chart configurations (Grand Trine, T-Square, etc.)
     * @returns {Array} Chart configurations
     */
    detectConfigurations() {
        const configurations = [];

        // Grand Trine
        const grandTrines = this.detectGrandTrines();
        configurations.push(...grandTrines);

        // T-Square
        const tSquares = this.detectTSquares();
        configurations.push(...tSquares);

        // Stellium
        const stelliums = this.detectStelliums();
        configurations.push(...stelliums);

        return configurations;
    }

    /**
     * Detect Grand Trine configurations
     * @returns {Array} Grand Trine configurations
     */
    detectGrandTrines() {
        const grandTrines = [];
        const planets = Object.keys(this.birthChart.planets);

        // Check for three planets in trine (120 degrees apart)
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                for (let k = j + 1; k < planets.length; k++) {
                    const planet1 = planets[i];
                    const planet2 = planets[j];
                    const planet3 = planets[k];

                    if (this.areInGrandTrine(planet1, planet2, planet3)) {
                        grandTrines.push({
                            type: 'Grand Trine',
                            planets: [planet1, planet2, planet3],
                            element: this.getCommonElement(planet1, planet2, planet3),
                            strength: this.calculateConfigurationStrength([planet1, planet2, planet3]),
                            effects: WESTERN_INTERPRETATION_CONSTANTS.CONFIGURATIONS.GRAND_TRINE.description
                        });
                    }
                }
            }
        }

        return grandTrines;
    }

    /**
     * Check if three planets form a Grand Trine
     * @param {string} p1 - Planet 1
     * @param {string} p2 - Planet 2
     * @param {string} p3 - Planet 3
     * @returns {boolean} True if Grand Trine
     */
    areInGrandTrine(p1, p2, p3) {
        const pos1 = this.birthChart.planets[p1].longitude;
        const pos2 = this.birthChart.planets[p2].longitude;
        const pos3 = this.birthChart.planets[p3].longitude;

        const diffs = [
            Math.abs(pos1 - pos2),
            Math.abs(pos2 - pos3),
            Math.abs(pos3 - pos1)
        ].map(diff => Math.min(diff, 360 - diff));

        // Check if all differences are approximately 120 degrees
        return diffs.every(diff => Math.abs(diff - 120) <= 8);
    }

    /**
     * Get common element of planets
     * @param {string} p1 - Planet 1
     * @param {string} p2 - Planet 2
     * @param {string} p3 - Planet 3
     * @returns {string} Common element or 'mixed'
     */
    getCommonElement(p1, p2, p3) {
        const signs = [
            this.birthChart.planets[p1].sign,
            this.birthChart.planets[p2].sign,
            this.birthChart.planets[p3].sign
        ];

        const elements = signs.map(sign => this.getSignElement(sign));
        const uniqueElements = [...new Set(elements)];

        return uniqueElements.length === 1 ? uniqueElements[0] : 'mixed';
    }

    /**
     * Get element of a zodiac sign
     * @param {string} sign - Zodiac sign
     * @returns {string} Element
     */
    getSignElement(sign) {
        const elements = WESTERN_INTERPRETATION_CONSTANTS.SIGN_ELEMENTS;
        return Object.keys(elements).find(element => elements[element].includes(sign));
    }

    /**
     * Calculate configuration strength
     * @param {Array} planets - Planets in configuration
     * @returns {number} Strength value (0-1)
     */
    calculateConfigurationStrength(planets) {
        let totalStrength = 0;

        for (const planet of planets) {
            // Use dignity strength as proxy for planetary strength
            const dignityStrength = this.getPlanetDignityStrength(planet);
            totalStrength += dignityStrength;
        }

        return totalStrength / planets.length;
    }

    /**
     * Get planet dignity strength
     * @param {string} planet - Planet name
     * @returns {number} Strength value
     */
    getPlanetDignityStrength(planet) {
        try {
            const dignity = this.dignityCalculator.calculateEssentialDignity(planet);
            return dignity.strength;
        } catch (error) {
            console.warn(`Could not calculate dignity for ${planet}: ${error.message}`);
            return 0.5; // Default neutral strength
        }
    }

    /**
     * Detect T-Square configurations
     * @returns {Array} T-Square configurations
     */
    detectTSquares() {
        const tSquares = [];
        const planets = Object.keys(this.birthChart.planets);

        // T-Square: two planets in opposition, both square to a third planet
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                for (let k = 0; k < planets.length; k++) {
                    if (k === i || k === j) continue;

                    const planet1 = planets[i];
                    const planet2 = planets[j];
                    const planet3 = planets[k];

                    if (this.areInTSquare(planet1, planet2, planet3)) {
                        tSquares.push({
                            type: 'T-Square',
                            planets: [planet1, planet2, planet3],
                            apex: planet3,
                            strength: this.calculateConfigurationStrength([planet1, planet2, planet3]),
                            effects: WESTERN_INTERPRETATION_CONSTANTS.CONFIGURATIONS.T_SQUARE.description
                        });
                    }
                }
            }
        }

        return tSquares;
    }

    /**
     * Check if three planets form a T-Square
     * @param {string} p1 - Planet 1
     * @param {string} p2 - Planet 2
     * @param {string} p3 - Planet 3 (apex)
     * @returns {boolean} True if T-Square
     */
    areInTSquare(p1, p2, p3) {
        const pos1 = this.birthChart.planets[p1].longitude;
        const pos2 = this.birthChart.planets[p2].longitude;
        const pos3 = this.birthChart.planets[p3].longitude;

        // Check if p1 and p2 are in opposition
        const diff12 = Math.min(Math.abs(pos1 - pos2), 360 - Math.abs(pos1 - pos2));
        const opposition = Math.abs(diff12 - 180) <= 8;

        // Check if both square to p3
        const diff13 = Math.min(Math.abs(pos1 - pos3), 360 - Math.abs(pos1 - pos3));
        const diff23 = Math.min(Math.abs(pos2 - pos3), 360 - Math.abs(pos2 - pos3));
        const square1 = Math.abs(diff13 - 90) <= 8;
        const square2 = Math.abs(diff23 - 90) <= 8;

        return opposition && square1 && square2;
    }

    /**
     * Detect Stellium configurations (3+ planets in same sign)
     * @returns {Array} Stellium configurations
     */
    detectStelliums() {
        const stelliums = [];
        const signCounts = {};

        // Count planets per sign
        for (const planet of Object.keys(this.birthChart.planets)) {
            const sign = this.birthChart.planets[planet].sign;
            signCounts[sign] = (signCounts[sign] || 0) + 1;
        }

        // Find signs with 3+ planets
        for (const [sign, count] of Object.entries(signCounts)) {
            if (count >= 3) {
                const planetsInSign = Object.keys(this.birthChart.planets)
                    .filter(planet => this.birthChart.planets[planet].sign === sign);

                stelliums.push({
                    type: 'Stellium',
                    sign: sign,
                    planets: planetsInSign,
                    count: count,
                    strength: WESTERN_INTERPRETATION_CONSTANTS.CONFIGURATIONS.STELLIUM.strength,
                    effects: WESTERN_INTERPRETATION_CONSTANTS.CONFIGURATIONS.STELLIUM.description
                });
            }
        }

        return stelliums;
    }

    /**
     * Get aspect summary statistics
     * @returns {Object} Aspect statistics
     */
    getAspectStatistics() {
        const aspects = this.detectMajorAspects();

        const stats = {
            totalAspects: aspects.length,
            byType: {},
            byStrength: { strong: 0, medium: 0, weak: 0 },
            configurations: this.detectConfigurations().length
        };

        // Count by type
        for (const aspect of aspects) {
            stats.byType[aspect.aspect] = (stats.byType[aspect.aspect] || 0) + 1;

            if (aspect.strength > 0.8) stats.byStrength.strong++;
            else if (aspect.strength > 0.6) stats.byStrength.medium++;
            else stats.byStrength.weak++;
        }

        return stats;
    }
}

module.exports = {
    WesternAspectDetector
};