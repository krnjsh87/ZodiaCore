/**
 * Western Essential Dignity Calculator
 * ZC3.12 Western Astrology Deep Horoscope System
 *
 * Calculates planetary strength based on Essential Dignity system:
 * - Rulership (5 points)
 * - Exaltation (4 points)
 * - Triplicity (3 points)
 * - Term/Face (2/1 points)
 * - Detriment (-5 points)
 * - Fall (-4 points)
 */

const { WESTERN_INTERPRETATION_CONSTANTS } = require('./western-deep-horoscope-constants');

class WesternEssentialDignityCalculator {
    constructor(birthChart) {
        // Input validation
        if (!birthChart) {
            throw new Error('Birth chart is required');
        }
        if (!birthChart.planets || typeof birthChart.planets !== 'object') {
            throw new Error('Invalid birth chart: missing or invalid planets data');
        }

        this.birthChart = birthChart;
        this.dignityWeights = WESTERN_INTERPRETATION_CONSTANTS.DIGNITY_WEIGHTS;
    }

    /**
     * Calculate complete Essential Dignity for a planet
     * @param {string} planet - Planet name (SUN, MOON, etc.)
     * @returns {Object} Dignity calculation results
     */
    calculateEssentialDignity(planet) {
        if (!this.birthChart.planets[planet]) {
            throw new Error(`Planet ${planet} not found in birth chart`);
        }

        const planetData = this.birthChart.planets[planet];
        const sign = planetData.sign;
        const longitude = planetData.longitude;

        // Calculate individual dignity components
        const rulership = this.isRuler(planet, sign) ? this.dignityWeights.rulership : 0;
        const exaltation = this.isExalted(planet, longitude) ? this.dignityWeights.exaltation : 0;
        const detriment = this.isInDetriment(planet, sign) ? this.dignityWeights.detriment : 0;
        const fall = this.isInFall(planet, longitude) ? this.dignityWeights.fall : 0;
        const triplicity = this.getTriplicityScore(planet, sign);
        const term = this.getTermScore(planet, longitude);
        const face = this.getFaceScore(planet, longitude);

        // Sum all dignity scores
        const totalScore = rulership + exaltation + detriment + fall + triplicity + term + face;
        const maxPossible = 15; // Maximum dignity score (rulership + exaltation + triplicity + term + face)
        const strength = Math.max(0, Math.min(1, totalScore / maxPossible));

        return {
            total: totalScore,
            components: {
                rulership,
                exaltation,
                detriment,
                fall,
                triplicity,
                term,
                face
            },
            strength: strength,
            interpretation: this.interpretDignityStrength(planet, strength),
            sign: sign,
            longitude: longitude
        };
    }

    /**
     * Check if planet is in its rulership
     * @param {string} planet - Planet name
     * @param {string} sign - Zodiac sign
     * @returns {boolean} True if planet rules the sign
     */
    isRuler(planet, sign) {
        const rulerships = WESTERN_INTERPRETATION_CONSTANTS.RULERSHIPS;
        return rulerships[planet]?.includes(sign) || false;
    }

    /**
     * Check if planet is exalted
     * @param {string} planet - Planet name
     * @param {number} longitude - Planet longitude in degrees
     * @returns {boolean} True if planet is within 2 degrees of exaltation point
     */
    isExalted(planet, longitude) {
        const exaltations = WESTERN_INTERPRETATION_CONSTANTS.EXALTATIONS;
        const exaltationDegree = exaltations[planet];

        if (!exaltationDegree) return false;

        // Check if within 2 degrees of exaltation point
        return Math.abs(longitude - exaltationDegree) <= 2;
    }

    /**
     * Check if planet is in detriment
     * @param {string} planet - Planet name
     * @param {string} sign - Zodiac sign
     * @returns {boolean} True if planet is in detriment
     */
    isInDetriment(planet, sign) {
        const detriments = WESTERN_INTERPRETATION_CONSTANTS.DETRIMENTS;
        return detriments[planet]?.includes(sign) || false;
    }

    /**
     * Check if planet is in fall
     * @param {string} planet - Planet name
     * @param {number} longitude - Planet longitude in degrees
     * @returns {boolean} True if planet is within 2 degrees of fall point
     */
    isInFall(planet, longitude) {
        const falls = WESTERN_INTERPRETATION_CONSTANTS.FALLS;
        const fallDegree = falls[planet];

        if (!fallDegree) return false;

        // Check if within 2 degrees of fall point
        return Math.abs(longitude - fallDegree) <= 2;
    }

    /**
     * Calculate triplicity score
     * @param {string} planet - Planet name
     * @param {string} sign - Zodiac sign
     * @returns {number} Triplicity score
     */
    getTriplicityScore(planet, sign) {
        const element = this.getSignElement(sign);
        const dayBirth = this.isDayBirth();
        const triplicityRulers = WESTERN_INTERPRETATION_CONSTANTS.TRIPLICITY_RULERS;

        const elementRuler = triplicityRulers[element];
        if (!elementRuler) return 0;

        const correctRuler = dayBirth ? elementRuler.day : elementRuler.night;
        return correctRuler === planet ? this.dignityWeights.triplicity : 0;
    }

    /**
     * Get element of a zodiac sign
     * @param {string} sign - Zodiac sign
     * @returns {string} Element (fire, earth, air, water)
     */
    getSignElement(sign) {
        const elements = WESTERN_INTERPRETATION_CONSTANTS.SIGN_ELEMENTS;
        return Object.keys(elements).find(element => elements[element].includes(sign));
    }

    /**
     * Determine if birth is during day or night
     * @returns {boolean} True if day birth
     */
    isDayBirth() {
        // Simplified: check if Sun is above horizon (in houses 7-12)
        // In standard wheel, houses 7-12 are below horizon
        const sunHouse = this.birthChart.planets.SUN.house;
        return sunHouse <= 6; // Houses 1-6 are above horizon
    }

    /**
     * Calculate term score (simplified - traditional terms)
     * @param {string} planet - Planet name
     * @param {number} longitude - Planet longitude
     * @returns {number} Term score
     */
    getTermScore(planet, longitude) {
        // Simplified term calculation - traditional Egyptian terms
        const signStart = Math.floor(longitude / 30) * 30;
        const degreeInSign = longitude - signStart;

        // Basic term boundaries (simplified)
        const terms = {
            'JUPITER': [0, 6],
            'VENUS': [6, 14],
            'MERCURY': [14, 21],
            'MARS': [21, 26],
            'SATURN': [26, 30]
        };

        if (terms[planet]) {
            const [start, end] = terms[planet];
            if (degreeInSign >= start && degreeInSign < end) {
                return this.dignityWeights.term;
            }
        }

        return 0;
    }

    /**
     * Calculate face/decans score (simplified)
     * @param {string} planet - Planet name
     * @param {number} longitude - Planet longitude
     * @returns {number} Face score
     */
    getFaceScore(planet, longitude) {
        const signStart = Math.floor(longitude / 30) * 30;
        const degreeInSign = longitude - signStart;
        const decan = Math.floor(degreeInSign / 10);

        // Simplified decan rulers
        const decanRulers = {
            0: 'MARS',    // First decan
            1: 'SUN',     // Second decan
            2: 'VENUS'    // Third decan
        };

        return decanRulers[decan] === planet ? this.dignityWeights.face : 0;
    }

    /**
     * Interpret dignity strength
     * @param {string} planet - Planet name
     * @param {number} strength - Strength value (0-1)
     * @returns {string} Interpretation text
     */
    interpretDignityStrength(planet, strength) {
        const levels = WESTERN_INTERPRETATION_CONSTANTS.STRENGTH_LEVELS;

        if (strength >= levels.EXCELLENT.min) {
            return `${planet} is in excellent dignity - very strong and beneficial`;
        } else if (strength >= levels.VERY_GOOD.min) {
            return `${planet} is in very good dignity - strong and supportive`;
        } else if (strength >= levels.GOOD.min) {
            return `${planet} is in good dignity - moderately strong`;
        } else if (strength >= levels.MODERATE.min) {
            return `${planet} is in moderate dignity - average strength`;
        } else if (strength >= levels.WEAK.min) {
            return `${planet} is in weak dignity - needs support`;
        } else {
            return `${planet} is in very weak dignity - challenging placement`;
        }
    }

    /**
     * Calculate dignity for all planets
     * @returns {Object} Dignity calculations for all planets
     */
    calculateAllPlanetaryDignities() {
        const planets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN'];
        const dignities = {};

        for (const planet of planets) {
            try {
                dignities[planet] = this.calculateEssentialDignity(planet);
            } catch (error) {
                console.warn(`Could not calculate dignity for ${planet}: ${error.message}`);
                dignities[planet] = null;
            }
        }

        return dignities;
    }

    /**
     * Get overall chart dignity strength
     * @returns {number} Average dignity strength (0-1)
     */
    getChartDignityStrength() {
        const dignities = this.calculateAllPlanetaryDignities();
        const validDignities = Object.values(dignities).filter(d => d !== null);

        if (validDignities.length === 0) return 0;

        const totalStrength = validDignities.reduce((sum, d) => sum + d.strength, 0);
        return totalStrength / validDignities.length;
    }
}

module.exports = {
    WesternEssentialDignityCalculator
};