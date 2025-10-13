/**
 * Western Astrology Return Chart Constants
 *
 * This module contains all constants and configuration values for the
 * ZC3.8 Western Astrology Solar and Lunar Return Chart system.
 *
 * @version 1.0.0
 * @since 2025-10-10
 */

const RETURN_CHART_CONSTANTS = {
    // Time Periods
    SOLAR_YEAR_DAYS: parseFloat(process.env.RETURN_CHART_SOLAR_YEAR_DAYS) || 365.2425,
    LUNAR_MONTH_DAYS: parseFloat(process.env.RETURN_CHART_LUNAR_MONTH_DAYS) || 29.530588,

    // Accuracy Thresholds
    RETURN_TIME_ACCURACY: parseInt(process.env.RETURN_CHART_TIME_ACCURACY) || 60, // seconds
    POSITION_ACCURACY: parseFloat(process.env.RETURN_CHART_POSITION_ACCURACY) || 0.01, // degrees

    // Return Types
    TYPES: {
        SOLAR: 'solar',
        LUNAR: 'lunar'
    },

    // Location Considerations
    LOCATION_PRECISION: 0.0001, // degrees

    // Chart Casting Methods
    CASTING_METHODS: {
        TRADITIONAL: 'traditional', // Current location
        BIRTH_LOCATION: 'birth_location',
        RESIDENCE: 'residence'
    },

    // House Systems
    HOUSE_SYSTEMS: {
        PLACIDUS: 'placidus',
        EQUAL: 'equal',
        KOCH: 'koch'
    },

    // Aspect Types
    ASPECTS: {
        CONJUNCTION: { angle: 0, orb: 8, name: 'Conjunction' },
        SEXTILE: { angle: 60, orb: 6, name: 'Sextile' },
        SQUARE: { angle: 90, orb: 8, name: 'Square' },
        TRINE: { angle: 120, orb: 8, name: 'Trine' },
        OPPOSITION: { angle: 180, orb: 8, name: 'Opposition' }
    },

    // Planets
    PLANETS: [
        'SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS',
        'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'
    ],

    // Zodiac Signs
    ZODIAC_SIGNS: [
        'ARIES', 'TAURUS', 'GEMINI', 'CANCER',
        'LEO', 'VIRGO', 'LIBRA', 'SCORPIO',
        'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'
    ],

    // Houses
    HOUSES: [
        'ASCENDANT', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH',
        'SIXTH', 'DESCENDANT', 'EIGHTH', 'NINTH', 'MIDHEAVEN',
        'ELEVENTH', 'TWELFTH'
    ],

    // Angular Houses
    ANGULAR_HOUSES: [1, 4, 7, 10],

    // Interpretation Scores
    INTERPRETATION_SCORES: {
        EXCELLENT: { min: 0.8, label: 'Excellent' },
        VERY_GOOD: { min: 0.7, label: 'Very Good' },
        GOOD: { min: 0.6, label: 'Good' },
        FAIR: { min: 0.5, label: 'Fair' },
        CHALLENGING: { min: 0.4, label: 'Challenging' },
        DIFFICULT: { min: 0, label: 'Difficult' }
    },

    // Validation Thresholds
    VALIDATION: {
        MAX_POSITION_ERROR: 0.01, // degrees
        MAX_TIME_ERROR: 60, // seconds
        MIN_HOUSE_SIZE: 20, // degrees
        MAX_HOUSE_SIZE: 40 // degrees
    }
};

module.exports = {
    RETURN_CHART_CONSTANTS
};