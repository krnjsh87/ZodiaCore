/**
 * Western Pet Planetary Strength Calculator for ZC3.11
 * Calculates planetary strengths for Western pet astrology analysis
 */

const { ZODIAC_SIGNS } = require('./western-astrology-constants');

/**
 * Western Pet Planetary Strength Calculator
 */
class WesternPetPlanetaryStrengthCalculator {
    constructor() {
        // Configuration - could be moved to environment variables
        this.BASE_STRENGTH = 50;
        this.RULERSHIP_BONUS = 20;
        this.HOUSE_BONUS = 15;
        this.MIN_STRENGTH = 0;
        this.MAX_STRENGTH = 100;
    }

    /**
     * Calculate Western pet planetary strength
     * @param {string} planet - Planet name
     * @param {number} longitude - Planet longitude
     * @param {number} sign - Zodiac sign index
     * @param {number} house - House number (1-12)
     * @returns {number} Strength score (0-100)
     */
    calculateWesternPetPlanetaryStrength(planet, longitude, sign, house) {
        try {
            let strength = this.BASE_STRENGTH;

            // Sign rulership bonus
            strength += this.getSignRulershipBonus(planet, sign);

            // House placement bonus
            strength += this.getHousePlacementBonus(planet, house);

            return this.normalizeStrength(strength);
        } catch (error) {
            console.error(`Error calculating planetary strength for ${planet}:`, error);
            return this.BASE_STRENGTH;
        }
    }

    /**
     * Get sign rulership bonus
     */
    getSignRulershipBonus(planet, sign) {
        const rulingSigns = {
            SUN: [4], // Leo
            MOON: [2], // Cancer
            MERCURY: [2, 5], // Gemini, Virgo
            VENUS: [1, 6], // Taurus, Libra
            MARS: [0, 7], // Aries, Scorpio
            JUPITER: [8, 11], // Sagittarius, Pisces
            SATURN: [9, 10], // Capricorn, Aquarius
            URANUS: [10], // Aquarius
            NEPTUNE: [11], // Pisces
            PLUTO: [7] // Scorpio
        };

        return rulingSigns[planet] && rulingSigns[planet].includes(sign) ? this.RULERSHIP_BONUS : 0;
    }

    /**
     * Get house placement bonus
     */
    getHousePlacementBonus(planet, house) {
        const favorableHouses = {
            SUN: [5, 10, 11], // 5th, 10th, 11th houses
            MOON: [4, 5, 12], // 4th, 5th, 12th houses
            MERCURY: [3, 6, 9], // 3rd, 6th, 9th houses
            VENUS: [2, 5, 7, 11], // 2nd, 5th, 7th, 11th houses
            MARS: [1, 8, 12], // 1st, 8th, 12th houses
            JUPITER: [5, 9, 12], // 5th, 9th, 12th houses
            SATURN: [10, 11, 12], // 10th, 11th, 12th houses
            URANUS: [11, 1, 5], // 11th, 1st, 5th houses
            NEPTUNE: [12, 8, 2], // 12th, 8th, 2nd houses
            PLUTO: [8, 1, 11] // 8th, 1st, 11th houses
        };

        return favorableHouses[planet] && favorableHouses[planet].includes(house) ? this.HOUSE_BONUS : 0;
    }

    /**
     * Normalize strength to valid range
     */
    normalizeStrength(strength) {
        return Math.max(this.MIN_STRENGTH, Math.min(this.MAX_STRENGTH, strength));
    }

    /**
     * Get Western pet planetary influence description
     * @param {string} planet - Planet name
     * @param {number} sign - Zodiac sign index
     * @param {number} house - House number (1-12)
     * @returns {string} Influence description
     */
    getWesternPetPlanetaryInfluence(planet, sign, house) {
        try {
            const influences = {
                SUN: {
                    4: 'Leadership and confidence in Leo placement',
                    9: 'Career success and recognition in 10th house',
                    10: 'Social success and friendships in 11th house'
                },
                MOON: {
                    2: 'Emotional security and family bonds in Cancer',
                    3: 'Communication and learning in 4th house',
                    11: 'Imagination and creativity in 12th house'
                },
                MERCURY: {
                    2: 'Intelligence and communication in Gemini',
                    5: 'Analytical thinking in Virgo',
                    8: 'Learning and teaching in 9th house'
                }
            };

            return influences[planet]?.[house - 1] || `${planet} in ${ZODIAC_SIGNS[sign]} in ${house}th house`;
        } catch (error) {
            console.error(`Error getting planetary influence for ${planet}:`, error);
            return `${planet} influence`;
        }
    }
}

module.exports = {
    WesternPetPlanetaryStrengthCalculator
};