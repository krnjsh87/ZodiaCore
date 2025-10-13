/**
 * ZodiaCore - Western Predictive Constants
 *
 * Constants for Western astrology progressive and transit predictions.
 * Defines rates, orbs, aspects, and other predictive calculation parameters.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Predictive calculation constants
const PREDICTIVE_CONSTANTS = {
    // Progression Rates
    SECONDARY_PROGRESSION_RATE: 1.0, // 1 day = 1 year
    SOLAR_ARC_RATE: 1.0, // 1° per year
    MINOR_PROGRESSION_RATE: 0.5, // 1 day = 6 months

    // Transit Constants
    TRANSIT_ORB_MAJOR: 2.0, // Degrees for major aspects
    TRANSIT_ORB_MINOR: 1.0, // Degrees for minor aspects
    TRANSIT_STATIONARY_ORB: 1.5, // Degrees for stationary planets

    // Timing Constants
    LUNAR_RETURN_DAYS: 29.53,
    SOLAR_RETURN_DAYS: 365.25,
    MERCURY_RETROGRADE_DAYS: 88,

    // Mathematical Constants
    DEGREES_PER_CIRCLE: 360.0,
    MAX_ORB: 10.0,
    MIN_ORB: 0.1,

    // Aspect Constants
    CONJUNCTION: 0,
    SEXTILE: 60,
    SQUARE: 90,
    TRINE: 120,
    OPPOSITION: 180,
    SEMISEXTILE: 30,
    SEMISQUARE: 45,
    SESQUIQUADRATE: 135,
    QUINCUNX: 150,

    // Major Aspects Array
    MAJOR_ASPECTS: [0, 60, 90, 120, 180],

    // Minor Aspects Array
    MINOR_ASPECTS: [30, 45, 135, 150],

    // Aspect Names
    ASPECT_NAMES: {
        0: 'Conjunction',
        30: 'Semisextile',
        45: 'Semisquare',
        60: 'Sextile',
        90: 'Square',
        120: 'Trine',
        135: 'Sesquiquadrate',
        150: 'Quincunx',
        180: 'Opposition'
    },

    // Aspect Strengths (base values)
    ASPECT_STRENGTHS: {
        0: 1.0,   // Conjunction
        30: 0.3,  // Semisextile
        45: 0.4,  // Semisquare
        60: 0.6,  // Sextile
        90: 0.4,  // Square
        120: 0.8, // Trine
        135: 0.4, // Sesquiquadrate
        150: 0.3, // Quincunx
        180: 0.5  // Opposition
    },

    // House Cusps (angles)
    ANGLES: [0, 90, 180, 270],

    // Predictive Timing Windows
    TIMING_WINDOWS: {
        EXACT: 0.5,    // Within 0.5° of exact
        CLOSE: 2.0,    // Within 2° of exact
        WIDE: 5.0      // Within 5° of exact
    },

    // Confidence Levels
    CONFIDENCE_LEVELS: {
        HIGH: 0.8,
        MEDIUM: 0.6,
        LOW: 0.4
    },

    // Life Areas for Interpretation
    LIFE_AREAS: {
        PERSONAL: ['SUN', 'MOON', 'ASC'],
        RELATIONSHIPS: ['VENUS', 'MARS', 'JUPITER'],
        CAREER: ['SATURN', 'MC', '10TH_HOUSE'],
        FINANCE: ['VENUS', 'JUPITER', '2ND_HOUSE'],
        HEALTH: ['MARS', 'SATURN', '6TH_HOUSE'],
        SPIRITUAL: ['NEPTUNE', 'PLUTO', '12TH_HOUSE']
    },

    // Event Types
    EVENT_TYPES: {
        CAREER: 'career',
        RELATIONSHIP: 'relationship',
        HEALTH: 'health',
        FINANCE: 'finance',
        PERSONAL: 'personal',
        SPIRITUAL: 'spiritual'
    },

    // Predictive Techniques
    TECHNIQUES: {
        SECONDARY: 'secondary',
        SOLAR_ARC: 'solar_arc',
        TRANSITS: 'transits'
    },

    // Framework Types
    FRAMEWORKS: {
        TRADITIONAL: 'traditional',
        MODERN: 'modern',
        PSYCHOLOGICAL: 'psychological'
    },

    // Direction Analysis Constants
    DIRECTION_ORB: 2.0,
    CRITICAL_DEGREE_ORB: 1.0,
    CRITICAL_DEGREES: [0, 13, 26],

    // House Analysis Constants
    OPPORTUNITY_HOUSES: [5, 9, 11],
    CHALLENGE_HOUSES: [6, 8, 12],

    // Life Phase Constants
    LIFE_PHASES: {
        FOUNDATION: 30,
        DEVELOPMENT: 50,
        MATURITY: 70
    },

    // Milestone Ages
    MILESTONE_AGES: [30, 40, 50, 60, 70, 80],

    // Validation Constants
    MIN_BIRTH_YEAR: 1900,
    MAX_BIRTH_YEAR: 2100,
    MAX_FUTURE_YEARS: 150
};

// Aspect orbs by planet combinations
const ASPECT_ORBS = {
    // Major aspects
    MAJOR: {
        SUN_MOON: 8.0,
        SUN_MERCURY: 7.0,
        SUN_VENUS: 7.0,
        SUN_MARS: 7.0,
        SUN_JUPITER: 6.0,
        SUN_SATURN: 6.0,
        SUN_URANUS: 5.0,
        SUN_NEPTUNE: 5.0,
        SUN_PLUTO: 5.0,
        MOON_MERCURY: 7.0,
        MOON_VENUS: 7.0,
        MOON_MARS: 7.0,
        MOON_JUPITER: 6.0,
        MOON_SATURN: 6.0,
        MOON_URANUS: 5.0,
        MOON_NEPTUNE: 5.0,
        MOON_PLUTO: 5.0,
        MERCURY_VENUS: 6.0,
        MERCURY_MARS: 6.0,
        MERCURY_JUPITER: 5.0,
        MERCURY_SATURN: 5.0,
        MERCURY_URANUS: 4.0,
        MERCURY_NEPTUNE: 4.0,
        MERCURY_PLUTO: 4.0,
        VENUS_MARS: 6.0,
        VENUS_JUPITER: 5.0,
        VENUS_SATURN: 5.0,
        VENUS_URANUS: 4.0,
        VENUS_NEPTUNE: 4.0,
        VENUS_PLUTO: 4.0,
        MARS_JUPITER: 5.0,
        MARS_SATURN: 5.0,
        MARS_URANUS: 4.0,
        MARS_NEPTUNE: 4.0,
        MARS_PLUTO: 4.0,
        JUPITER_SATURN: 4.0,
        JUPITER_URANUS: 3.0,
        JUPITER_NEPTUNE: 3.0,
        JUPITER_PLUTO: 3.0,
        SATURN_URANUS: 3.0,
        SATURN_NEPTUNE: 3.0,
        SATURN_PLUTO: 3.0,
        URANUS_NEPTUNE: 2.0,
        URANUS_PLUTO: 2.0,
        NEPTUNE_PLUTO: 2.0
    },

    // Minor aspects
    MINOR: {
        SUN_MOON: 2.0,
        SUN_MERCURY: 1.5,
        SUN_VENUS: 1.5,
        SUN_MARS: 1.5,
        SUN_JUPITER: 1.0,
        SUN_SATURN: 1.0,
        SUN_URANUS: 1.0,
        SUN_NEPTUNE: 1.0,
        SUN_PLUTO: 1.0,
        MOON_MERCURY: 1.5,
        MOON_VENUS: 1.5,
        MOON_MARS: 1.5,
        MOON_JUPITER: 1.0,
        MOON_SATURN: 1.0,
        MOON_URANUS: 1.0,
        MOON_NEPTUNE: 1.0,
        MOON_PLUTO: 1.0,
        MERCURY_VENUS: 1.0,
        MERCURY_MARS: 1.0,
        MERCURY_JUPITER: 1.0,
        MERCURY_SATURN: 1.0,
        MERCURY_URANUS: 0.5,
        MERCURY_NEPTUNE: 0.5,
        MERCURY_PLUTO: 0.5,
        VENUS_MARS: 1.0,
        VENUS_JUPITER: 1.0,
        VENUS_SATURN: 1.0,
        VENUS_URANUS: 0.5,
        VENUS_NEPTUNE: 0.5,
        VENUS_PLUTO: 0.5,
        MARS_JUPITER: 1.0,
        MARS_SATURN: 1.0,
        MARS_URANUS: 0.5,
        MARS_NEPTUNE: 0.5,
        MARS_PLUTO: 0.5,
        JUPITER_SATURN: 0.5,
        JUPITER_URANUS: 0.5,
        JUPITER_NEPTUNE: 0.5,
        JUPITER_PLUTO: 0.5,
        SATURN_URANUS: 0.5,
        SATURN_NEPTUNE: 0.5,
        SATURN_PLUTO: 0.5,
        URANUS_NEPTUNE: 0.5,
        URANUS_PLUTO: 0.5,
        NEPTUNE_PLUTO: 0.5
    }
};

// Error messages
const PREDICTIVE_ERRORS = {
    INVALID_BIRTH_CHART: 'Valid birth chart required',
    INVALID_TARGET_DATE: 'Valid target date required',
    DATE_BEFORE_BIRTH: 'Target date must be after birth date',
    INVALID_FRAMEWORK: 'Unsupported framework type',
    INVALID_TECHNIQUE: 'Unsupported predictive technique',
    CALCULATION_ERROR: 'Error in predictive calculation',
    INVALID_PLANET: 'Invalid planet specified',
    INVALID_ASPECT: 'Invalid aspect specified'
};

module.exports = {
    PREDICTIVE_CONSTANTS,
    ASPECT_ORBS,
    PREDICTIVE_ERRORS
};