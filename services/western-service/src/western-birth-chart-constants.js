/**
 * ZodiaCore - Western Birth Chart Constants
 *
 * Centralized constants for Western astrology birth chart analysis.
 * Contains zodiac signs, house systems, planetary data, and mathematical constants.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const WESTERN_BIRTH_CHART_CONSTANTS = {
    // Zodiac Constants
    SIGNS: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
            'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'],
    SIGN_DEGREES: 30.0,
    TOTAL_SIGNS: 12,

    // House Systems
    HOUSE_SYSTEMS: ['placidus', 'koch', 'equal', 'whole-sign', 'regiomontanus'],
    HOUSES_COUNT: 12,

    // Planetary Constants
    PLANETS: ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn',
              'uranus', 'neptune', 'pluto', 'north-node', 'south-node'],
    LUMINARIES: ['sun', 'moon'],
    PERSONAL_PLANETS: ['sun', 'moon', 'mercury', 'venus', 'mars'],
    SOCIAL_PLANETS: ['jupiter', 'saturn'],
    TRANSPERSONAL_PLANETS: ['uranus', 'neptune', 'pluto'],

    // Mathematical Constants
    DEGREES_PER_CIRCLE: 360.0,
    MAX_ORB: 15.0,
    MIN_ORB: 0.5,

    // Pattern Recognition
    ASPECT_ORB_MAJOR: 8.0,
    ASPECT_ORB_MINOR: 2.0,
    PATTERN_ORB: 5.0
};

module.exports = {
    WESTERN_BIRTH_CHART_CONSTANTS
};