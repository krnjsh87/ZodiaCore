/**
 * ZodiaCore Planetary Mappings Configuration (ZC1.2)
 *
 * Centralized configuration for planetary relationships, favorable/malefic planets by ascendant,
 * and remedial measures. Externalized for maintainability and easy updates.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

/**
 * Favorable planets for each ascendant sign (0-11, Aries to Pisces)
 */
const FAVORABLE_PLANETS = {
    0: ['MARS', 'SUN', 'JUPITER'], // Aries
    1: ['SATURN', 'MERCURY', 'VENUS'], // Taurus
    2: ['VENUS', 'MERCURY'], // Gemini
    3: ['MOON', 'MARS', 'JUPITER'], // Cancer
    4: ['SUN', 'MARS'], // Leo
    5: ['MERCURY', 'VENUS'], // Virgo
    6: ['VENUS', 'MERCURY', 'SATURN'], // Libra
    7: ['JUPITER', 'MOON', 'SUN'], // Scorpio
    8: ['JUPITER', 'SUN', 'MARS'], // Sagittarius
    9: ['SATURN', 'VENUS', 'MERCURY'], // Capricorn
    10: ['SATURN', 'VENUS'], // Aquarius
    11: ['JUPITER', 'MOON', 'MARS'] // Pisces
};

/**
 * Malefic planets for each ascendant sign (0-11, Aries to Pisces)
 */
const MALEFIC_PLANETS = {
    0: ['MERCURY', 'VENUS', 'SATURN'], // Aries
    1: ['MARS', 'SUN', 'JUPITER'], // Taurus
    2: ['MARS', 'JUPITER'], // Gemini
    3: ['SATURN', 'SUN', 'MERCURY'], // Cancer
    4: ['MOON', 'MERCURY'], // Leo
    5: ['MARS', 'SUN', 'JUPITER'], // Virgo
    6: ['MARS', 'SUN', 'JUPITER'], // Libra
    7: ['MERCURY', 'VENUS', 'SATURN'], // Scorpio
    8: ['MERCURY', 'VENUS', 'SATURN'], // Sagittarius
    9: ['MARS', 'SUN', 'JUPITER'], // Capricorn
    10: ['MARS', 'SUN', 'JUPITER'], // Aquarius
    11: ['SATURN', 'SUN', 'MERCURY'] // Pisces
};

/**
 * Remedial measures for each planet
 */
const PLANETARY_REMEDIES = {
    SUN: ['Offer water to Sun', 'Wear ruby', 'Chant Surya mantra'],
    MOON: ['Keep silver', 'Chant Chandra mantra', 'Feed cows'],
    MARS: ['Donate red items', 'Chant Hanuman Chalisa', 'Wear coral'],
    MERCURY: ['Donate green items', 'Chant Vishnu mantra', 'Wear emerald'],
    JUPITER: ['Donate yellow items', 'Chant Guru mantra', 'Wear yellow sapphire'],
    VENUS: ['Donate white items', 'Chant Lakshmi mantra', 'Wear diamond'],
    SATURN: ['Feed black dogs', 'Chant Shani mantra', 'Wear blue sapphire'],
    RAHU: ['Feed elephants', 'Chant Rahu mantra', 'Wear hessonite'],
    KETU: ['Feed dogs', 'Chant Ketu mantra', 'Wear cat\'s eye']
};

/**
 * Get favorable planets for a given ascendant
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of favorable planet names
 */
function getFavorablePlanets(birthChart) {
    const ascendant = birthChart.ascendant ? birthChart.ascendant.sign : 0;
    return FAVORABLE_PLANETS[ascendant] || [];
}

/**
 * Get malefic planets for a given ascendant
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of malefic planet names
 */
function getMaleficPlanets(birthChart) {
    const ascendant = birthChart.ascendant ? birthChart.ascendant.sign : 0;
    return MALEFIC_PLANETS[ascendant] || [];
}

/**
 * Get remedial measures for a specific planet
 * @param {string} planet - Planet name
 * @returns {Array} Array of remedial measures
 */
function getRemediesForPlanet(planet) {
    return PLANETARY_REMEDIES[planet] || [];
}

module.exports = {
    FAVORABLE_PLANETS,
    MALEFIC_PLANETS,
    PLANETARY_REMEDIES,
    getFavorablePlanets,
    getMaleficPlanets,
    getRemediesForPlanet
};