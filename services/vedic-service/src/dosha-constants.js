/**
 * ZodiaCore - Dosha Analysis Constants
 *
 * Constants and mappings for Vedic astrology dosha calculations including
 * Manglik Dosha, Nadi compatibility, and other planetary afflictions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Nadi system mappings - Three types of Nadi based on Moon's nakshatra
const NADI_MAPPINGS = {
    'Adi': [
        'Ashwini', 'Ardra', 'Punarvasu', 'Uttara Phalguni', 'Hasta',
        'Jyeshtha', 'Moola', 'Shatabhisha', 'Purva Bhadrapada'
    ],
    'Madhya': [
        'Bharani', 'Mrigashira', 'Pushya', 'Chitra', 'Anuradha',
        'Purva Ashadha', 'Dhanishtha', 'Uttara Bhadrapada'
    ],
    'Antya': [
        'Krittika', 'Rohini', 'Ashlesha', 'Magha', 'Purva Phalguni',
        'Swati', 'Vishakha', 'Uttara Ashadha', 'Shravana', 'Revati'
    ]
};

// Manglik Dosha house positions from Lagna and Moon
const MANGLIK_DOSHA_HOUSES = [1, 4, 7, 8, 12];

// Dosha intensity levels
const DOSHA_INTENSITY_LEVELS = {
    MILD: { min: 1, max: 3, description: 'Minimal impact, easily manageable' },
    MODERATE: { min: 4, max: 6, description: 'Noticeable effects, requires attention' },
    SEVERE: { min: 7, max: 8, description: 'Significant challenges, strong remedies needed' },
    CRITICAL: { min: 9, max: 10, description: 'Major life obstacles, comprehensive approach required' }
};

// Planetary dignity weights for dosha calculations
const PLANETARY_DIGNITY_WEIGHTS = {
    EXALTED: 1.5,
    OWN_SIGN: 1.2,
    FRIENDLY_SIGN: 1.0,
    NEUTRAL_SIGN: 0.8,
    ENEMY_SIGN: 0.6,
    DEBILITATED: 0.4
};

// Benefic planets for dosha cancellation
const BENEFIC_PLANETS = ['JUPITER', 'VENUS', 'MOON'];

// Malefic planets for dosha intensification
const MALEFIC_PLANETS = ['SATURN', 'MARS', 'RAHU', 'KETU', 'SUN'];

// Kalasarpa Dosha calculation constants
const KALASARPA_CONSTANTS = {
    MIN_PLANETS_BETWEEN_RAHU_KETU: 5, // Minimum planets needed for full Kalasarpa
    INTENSITY_MULTIPLIERS: {
        FULL: 1.0,    // All planets between Rahu and Ketu
        PARTIAL: 0.7, // Most planets between
        MILD: 0.4     // Few planets between
    }
};

// Pitru Dosha indicators (ancestral afflictions)
const PITRU_DOSHA_INDICATORS = {
    SUN_IN_9TH: 'Father-related issues',
    MOON_IN_9TH: 'Mother-related issues',
    RAHU_IN_9TH: 'Ancestral karma',
    KETU_IN_9TH: 'Spiritual disconnection',
    SATURN_IN_9TH: 'Delayed fortune',
    MARS_IN_9TH: 'Aggressive karma'
};

// Guru Chandal Dosha (Jupiter-Saturn conjunction effects)
const GURU_CHANDAL_DOSHA = {
    CONJUNCTION_DEGREES: 10, // Within 10 degrees
    EFFECTS: {
        CAREER: 'Career instability',
        WEALTH: 'Financial fluctuations',
        HEALTH: 'Digestive issues',
        RELATIONSHIPS: 'Trust issues'
    }
};

// Sarp Dosha (Rahu/Ketu in 5th or 9th house)
const SARP_DOSHA_HOUSES = [5, 9];
const SARP_DOSHA_EFFECTS = {
    '5TH_HOUSE': 'Children and creativity issues',
    '9TH_HOUSE': 'Fortune and spiritual growth blocks'
};

// Varshaphala (annual horoscope) constants
const VARSHA_CONSTANTS = {
    // Muntha (annual lord) mapping based on return chart ascendant
    MUNTHA_MAPPING: {
        0: 'MARS',      // Aries
        1: 'VENUS',     // Taurus
        2: 'MERCURY',   // Gemini
        3: 'MOON',      // Cancer
        4: 'SUN',       // Leo
        5: 'MERCURY',   // Virgo
        6: 'VENUS',     // Libra
        7: 'MARS',      // Scorpio
        8: 'JUPITER',   // Sagittarius
        9: 'SATURN',    // Capricorn
        10: 'SATURN',   // Aquarius
        11: 'JUPITER'   // Pisces
    },

    // Solar return calculation parameters
    SOLAR_RETURN: {
        MAX_ITERATIONS: 50,
        CONVERGENCE_THRESHOLD: 0.0001, // degrees
        SEARCH_WINDOW_DAYS: 5
    },

    // Annual prediction categories
    PREDICTION_CATEGORIES: {
        CAREER: [2, 6, 10, 11],
        RELATIONSHIPS: [5, 7],
        HEALTH: [1, 6, 8, 12],
        SPIRITUAL: [9, 12],
        CHANGES: [8]
    }
};

// Manglik Dosha cancellation rules
const MANGLIK_CANCELLATION_RULES = {
    NATURAL: [
        'Mars in own sign (Aries/Scorpio)',
        'Mars exalted (Capricorn)',
        'Mars in 7th house conjunct Jupiter or Venus',
        'Benefic aspects on Mars from Jupiter, Venus, or Moon'
    ],
    REMEDIAL: [
        'Marriage with another Manglik',
        'Marriage after age 28',
        'Kumbh Vivah ceremony',
        'Specific gemstone and mantra remedies'
    ]
};

// Nadi Dosha remedies
const NADI_REMEDIES = [
    'Nadi Dosha Nivaran Puja',
    'Charitable donations to temples',
    'Ekadashi fasting',
    'Specific mantra chanting',
    'Medical genetic compatibility testing'
];

// Aspect calculation constants
const ASPECT_ORBS = {
    DEFAULT: 5, // degrees for standard aspects
    WIDE: 8,    // degrees for broader aspects in varshaphala
    TIGHT: 2    // degrees for exact aspects
};

// House system validation
const HOUSE_SYSTEM = {
    EXPECTED_HOUSES: 12,
    VALIDATION: {
        MIN_HOUSES: 12,
        MAX_HOUSES: 12
    }
};

// General dosha remedy categories
const DOSHA_REMEDY_CATEGORIES = {
    TRADITIONAL: ['Pujas', 'Mantras', 'Fasting', 'Charity'],
    GEMSTONE: ['Red Coral', 'Ruby', 'Pearl', 'Yellow Sapphire'],
    MODERN: ['Counseling', 'Medical consultation', 'Lifestyle changes']
};

// Export all dosha constants
module.exports = {
    NADI_MAPPINGS,
    MANGLIK_DOSHA_HOUSES,
    DOSHA_INTENSITY_LEVELS,
    PLANETARY_DIGNITY_WEIGHTS,
    BENEFIC_PLANETS,
    MALEFIC_PLANETS,
    KALASARPA_CONSTANTS,
    PITRU_DOSHA_INDICATORS,
    GURU_CHANDAL_DOSHA,
    SARP_DOSHA_HOUSES,
    SARP_DOSHA_EFFECTS,
    VARSHA_CONSTANTS,
    MANGLIK_CANCELLATION_RULES,
    NADI_REMEDIES,
    DOSHA_REMEDY_CATEGORIES,
    ASPECT_ORBS,
    HOUSE_SYSTEM
};