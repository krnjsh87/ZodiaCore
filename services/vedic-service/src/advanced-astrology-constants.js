/**
 * ZodiaCore - Advanced Astrology Constants
 *
 * Centralized constants file for KP, Nadi, Lal Kitab, and Varshaphal systems.
 * Contains all mathematical constants, planetary sequences, and configuration
 * data for advanced astrological consultation systems.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// KP (Krishnamurti Paddhati) Constants
const KP_CONSTANTS = {
    // Sub-lord divisions per sign
    SUB_LORDS_PER_SIGN: 9,
    DEGREES_PER_SUB_LORD_SEGMENT: 2.5, // 30° / 12 segments, but KP uses 2.5° segments

    // Vimshottari Dasha sequence with sub-lords
    DASHA_SEQUENCE: [
        { planet: 'KETU', years: 7, subLords: ['KETU', 'VENUS', 'SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY'] },
        { planet: 'VENUS', years: 20, subLords: ['VENUS', 'SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY', 'KETU'] },
        { planet: 'SUN', years: 6, subLords: ['SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY', 'KETU', 'VENUS'] },
        { planet: 'MOON', years: 10, subLords: ['MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY', 'KETU', 'VENUS', 'SUN'] },
        { planet: 'MARS', years: 7, subLords: ['MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY', 'KETU', 'VENUS', 'SUN', 'MOON'] },
        { planet: 'RAHU', years: 18, subLords: ['RAHU', 'JUPITER', 'SATURN', 'MERCURY', 'KETU', 'VENUS', 'SUN', 'MOON', 'MARS'] },
        { planet: 'JUPITER', years: 16, subLords: ['JUPITER', 'SATURN', 'MERCURY', 'KETU', 'VENUS', 'SUN', 'MOON', 'MARS', 'RAHU'] },
        { planet: 'SATURN', years: 19, subLords: ['SATURN', 'MERCURY', 'KETU', 'VENUS', 'SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER'] },
        { planet: 'MERCURY', years: 17, subLords: ['MERCURY', 'KETU', 'VENUS', 'SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN'] }
    ],

    // Star-lord sequence for each planet
    STAR_LORDS: {
        'KETU': ['ASHWINI', 'MAGHA', 'MULA'],
        'VENUS': ['BHARANI', 'PURVA_PHALGUNI', 'PURVA_ASHADHA'],
        'SUN': ['KRITTIKA', 'UTTARA_PHALGUNI', 'UTTARA_ASHADHA'],
        'MOON': ['ROHINI', 'HASTA', 'SHRAVANA'],
        'MARS': ['MRIGASHIRA', 'CHITRA', 'DHANISHTA'],
        'RAHU': ['ARDRA', 'SWATI', 'SHATABHISHA'],
        'JUPITER': ['PUNARVASU', 'VISHAKHA', 'PURVA_BHADRAPADA'],
        'SATURN': ['PUSHYA', 'ANURADHA', 'UTTARA_BHADRAPADA'],
        'MERCURY': ['ASHLESHA', 'JYESTHA', 'REVATI']
    },

    // Day lords mapping
    DAY_LORDS: {
        0: 'SUN',    // Sunday
        1: 'MOON',   // Monday
        2: 'MARS',   // Tuesday
        3: 'MERCURY', // Wednesday
        4: 'JUPITER', // Thursday
        5: 'VENUS',  // Friday
        6: 'SATURN'  // Saturday
    },

    // Sign lords
    SIGN_LORDS: [
        'MARS', 'VENUS', 'MERCURY', 'MOON', // Aries, Taurus, Gemini, Cancer
        'SUN', 'MERCURY', 'VENUS', 'MARS', // Leo, Virgo, Libra, Scorpio
        'JUPITER', 'SATURN', 'SATURN', 'JUPITER', // Sagittarius, Capricorn, Aquarius, Pisces
        'MARS', 'VENUS' // Additional for completeness
    ],

    // Significators for different life areas
    SIGNIFICATORS: {
        'marriage': [7, 2, 11], // 7th, 2nd, 11th houses
        'career': [10, 2, 11],  // 10th, 2nd, 11th houses
        'health': [1, 6, 8, 12], // 1st, 6th, 8th, 12th houses
        'wealth': [2, 11, 5],   // 2nd, 11th, 5th houses
        'education': [4, 9, 5], // 4th, 9th, 5th houses
        'children': [5, 2, 11], // 5th, 2nd, 11th houses
        'travel': [3, 9, 12],   // 3rd, 9th, 12th houses
        'property': [4, 2, 11]  // 4th, 2nd, 11th houses
    },

    // Prediction probability weights
    PROBABILITY_WEIGHTS: {
        RULING_SIGNIFICATORS: 20,
        CUSPAL_LINKS: 15,
        MAX_PROBABILITY: 100
    }
};

// Nadi Astrology Constants
const NADI_CONSTANTS = {
    // Thumb impression types and their characteristics
    THUMB_IMPRESSIONS: {
        'VAATHU': { traits: ['leadership', 'courage'], planets: ['MARS', 'SUN'] },
        'PITHAM': { traits: ['intelligence', 'creativity'], planets: ['MERCURY', 'VENUS'] },
        'KAPHAM': { traits: ['stability', 'patience'], planets: ['SATURN', 'MOON'] },
        'THATTU': { traits: ['spirituality', 'wisdom'], planets: ['JUPITER', 'KETU'] }
    },

    // Nadi combinations for predictions
    NADI_COMBINATIONS: {
        'RAJA_YOGA': {
            planets: ['JUPITER', 'VENUS'],
            houses: [1, 5, 9, 10],
            prediction: 'Royal success and leadership positions'
        },
        'DHANA_YOGA': {
            planets: ['JUPITER', 'VENUS', 'MERCURY'],
            houses: [2, 11],
            prediction: 'Wealth and financial prosperity'
        },
        'GURU_KRIYA': {
            planets: ['JUPITER', 'SATURN'],
            houses: [9, 10],
            prediction: 'Spiritual teacher or guide'
        }
    },

    // Life paths based on thumb impressions
    LIFE_PATHS: {
        'VAATHU': {
            path: 'Leadership and Authority',
            challenges: ['Impatience', 'Aggression'],
            strengths: ['Courage', 'Decision Making'],
            career: ['Military', 'Politics', 'Business Leadership']
        },
        'PITHAM': {
            path: 'Intellectual and Creative',
            challenges: ['Anxiety', 'Overthinking'],
            strengths: ['Intelligence', 'Creativity'],
            career: ['Arts', 'Science', 'Teaching']
        },
        'KAPHAM': {
            path: 'Stability and Service',
            challenges: ['Stubbornness', 'Resistance to Change'],
            strengths: ['Patience', 'Reliability'],
            career: ['Service', 'Agriculture', 'Administration']
        },
        'THATTU': {
            path: 'Spiritual and Philosophical',
            challenges: ['Detachment', 'Worldly Desires'],
            strengths: ['Wisdom', 'Compassion'],
            career: ['Spirituality', 'Counseling', 'Healing']
        }
    },

    // Trait-based predictions
    TRAIT_PREDICTIONS: {
        'leadership': [
            { period: 'age 25-35', prediction: 'Rise to leadership position' },
            { period: 'age 40-50', prediction: 'Major career breakthrough' }
        ],
        'courage': [
            { period: 'age 20-30', prediction: 'Face major challenges successfully' },
            { period: 'age 35-45', prediction: 'Take bold career decisions' }
        ],
        'intelligence': [
            { period: 'age 18-25', prediction: 'Excel in education' },
            { period: 'age 30-40', prediction: 'Innovative career achievements' }
        ],
        'creativity': [
            { period: 'age 22-32', prediction: 'Creative projects gain recognition' },
            { period: 'age 35-45', prediction: 'Major artistic achievements' }
        ],
        'stability': [
            { period: 'age 25-35', prediction: 'Establish stable career' },
            { period: 'age 40-50', prediction: 'Financial security achieved' }
        ],
        'patience': [
            { period: 'age 30-40', prediction: 'Overcome major obstacles' },
            { period: 'age 45-55', prediction: 'Harvest fruits of patience' }
        ],
        'spirituality': [
            { period: 'age 35-45', prediction: 'Spiritual awakening' },
            { period: 'age 50+', prediction: 'Become spiritual guide' }
        ],
        'wisdom': [
            { period: 'age 40-50', prediction: 'Gain wisdom through experiences' },
            { period: 'age 55+', prediction: 'Share wisdom with others' }
        ]
    },

    // Matching criteria weights
    MATCHING_WEIGHTS: {
        DATE_MATCH: 1,
        TIME_MATCH: 1,
        PLACE_MATCH: 1,
        PARENT_MATCH: 1,
        THUMB_MATCH: 1,
        MIN_MATCH_SCORE: 0.8 // 80% required for valid match
    }
};

// Lal Kitab Constants
const LAL_KITAB_CONSTANTS = {
    // Blind planets - cannot see certain houses
    BLIND_PLANETS: {
        'SATURN': [1, 8, 10], // Cannot see 1st, 8th, 10th houses
        'MARS': [2, 12],      // Cannot see 2nd, 12th houses
        'JUPITER': [6]        // Cannot see 6th house
    },

    // Sleeping planets combinations
    SLEEPING_PLANETS: {
        enemy_together: ['SUN-VENUS', 'MOON-MERCURY', 'MARS-MERCURY'],
        enemy_house: ['planet_in_enemy_sign'],
        specific_combinations: ['SUN-MERCURY-JUPITER', 'MOON-SATURN-RAHU']
    },

    // Lal Kitab house information
    HOUSES: {
        1: { name: 'Self', karaka: 'SUN', remedies: ['Gold donation', 'Sun worship'] },
        2: { name: 'Wealth', karaka: 'JUPITER', remedies: ['Yellow items', 'Food donation'] },
        3: { name: 'Siblings', karaka: 'MARS', remedies: ['Red items', 'Brother help'] },
        4: { name: 'Home', karaka: 'MOON', remedies: ['Silver items', 'Water charity'] },
        5: { name: 'Children', karaka: 'JUPITER', remedies: ['Yellow sweets', 'Child care'] },
        6: { name: 'Enemies', karaka: 'SATURN', remedies: ['Iron items', 'Black sesame'] },
        7: { name: 'Marriage', karaka: 'VENUS', remedies: ['White items', 'Cow service'] },
        8: { name: 'Longevity', karaka: 'SATURN', remedies: ['Iron horse', 'Black items'] },
        9: { name: 'Fortune', karaka: 'JUPITER', remedies: ['Yellow flowers', 'Temple service'] },
        10: { name: 'Career', karaka: 'SATURN', remedies: ['Iron items', 'Service work'] },
        11: { name: 'Gains', karaka: 'JUPITER', remedies: ['Yellow grams', 'Elder care'] },
        12: { name: 'Expenses', karaka: 'SATURN', remedies: ['Iron nails', 'Black clothes'] }
    },

    // Planet-specific remedies
    PLANET_REMEDIES: {
        'SUN': ['Wear gold', 'Donate wheat', 'Sun worship'],
        'MOON': ['Wear silver', 'Donate rice', 'Moon worship'],
        'MARS': ['Wear red coral', 'Donate red items', 'Hanuman worship'],
        'MERCURY': ['Wear emerald', 'Donate green items', 'Vishnu worship'],
        'JUPITER': ['Wear yellow sapphire', 'Donate turmeric', 'Guru worship'],
        'VENUS': ['Wear diamond', 'Donate white items', 'Lakshmi worship'],
        'SATURN': ['Wear blue sapphire', 'Donate iron items', 'Shani worship'],
        'RAHU': ['Wear hessonite', 'Feed elephants', 'Durga worship'],
        'KETU': ['Wear cat\'s eye', 'Donate blankets', 'Ganesha worship']
    },

    // House strength thresholds
    STRENGTH_THRESHOLDS: {
        WEAK: 0.4,
        FAIR: 0.6,
        STRONG: 0.8
    },

    // Chart health scoring
    HEALTH_SCORING: {
        BASE_SCORE: 100,
        WEAK_HOUSE_PENALTY: 5,
        BLIND_PLANET_PENALTY: 10,
        SLEEPING_PLANET_PENALTY: 15,
        MIN_HEALTH_SCORE: 0
    }
};

// Varshaphal (Annual Horoscope) Constants
const VARSHA_CONSTANTS = {
    // Muntha progression rate (degrees per year)
    MUNTHA_PROGRESSION_RATE: 1.0, // Approximately 1° per year

    // Tajik yogas
    TAJIK_YOGAS: {
        'RAJA_YOGA': {
            condition: 'Lords of 1st, 4th, 7th, 10th houses connected',
            effects: ['Authority', 'Success', 'Leadership'],
            strength: 'High'
        },
        'DHANA_YOGA': {
            condition: '2nd and 11th house connections with benefics',
            effects: ['Wealth', 'Financial gains', 'Material prosperity'],
            strength: 'High'
        },
        'KEMADRUMA_YOGA': {
            condition: 'Moon isolated without planets in 2nd and 12th',
            effects: ['Isolation', 'Mental struggles', 'Lack of support'],
            strength: 'Challenging',
            remedies: ['Strengthen Moon', 'Build support network']
        }
    },

    // Annual strength assessment
    STRENGTH_ASSESSMENT: {
        EXCELLENT_MIN: 75,
        GOOD_MIN: 60,
        AVERAGE_MIN: 45,
        CHALLENGING_MAX: 44,
        BASE_STRENGTH: 50,
        BENEFICIAL_YOGA_BONUS: 10,
        CHALLENGING_YOGA_PENALTY: 15,
        MAX_STRENGTH: 100,
        MIN_STRENGTH: 0
    },

    // Key periods identification
    KEY_PERIODS: {
        SOLAR_RETURN_ACTIVATION: {
            duration: '2-3 months',
            significance: 'Major life themes begin manifesting'
        },
        YOGA_ACTIVATION_BASE_DURATION: 'Throughout the year'
    },

    // Remedies frequency
    REMEDY_FREQUENCIES: {
        GENERAL: 'Daily',
        SPECIFIC: 'Weekly',
        MONTHLY: 'Monthly',
        ANNUAL: 'Annual'
    },

    // Timing predictions
    TIMING_PERIODS: {
        EARLY_LIFE: ['JUPITER', 'SUN'],
        MIDDLE_LIFE: ['SATURN', 'VENUS'],
        LATER_LIFE: ['KETU', 'RAHU']
    }
};

// Advanced Consultation Integration Constants
const ADVANCED_CONSULTATION_CONSTANTS = {
    // System availability flags
    SYSTEMS: {
        KP: 'kp',
        NADI: 'nadi',
        LAL_KITAB: 'lalKitab',
        VARSHA: 'varsha'
    },

    // Integration confidence calculation
    CONFIDENCE_CALCULATION: {
        AGREEMENT_BONUS: 10,
        MAX_CONFIDENCE: 100,
        MIN_CONFIDENCE: 0
    },

    // Prediction categorization
    PREDICTION_CATEGORIES: {
        SHORT_TERM: 'shortTerm',
        MEDIUM_TERM: 'mediumTerm',
        LONG_TERM: 'longTerm'
    },

    // Remedy prioritization
    REMEDY_PRIORITIES: {
        CRITICAL: 'critical',
        IMPORTANT: 'important',
        ROUTINE: 'routine'
    },

    // Timing analysis types
    TIMING_TYPES: {
        FAVORABLE: 'favorable',
        CHALLENGING: 'challenging',
        PEAK: 'peak',
        TRANSITIONS: 'transitions'
    },

    // Error handling
    ERRORS: {
        INVALID_BIRTH_CHART: 'INVALID_BIRTH_CHART',
        MISSING_NATAL_DATA: 'MISSING_NATAL_DATA',
        CALCULATION_FAILED: 'CALCULATION_FAILED',
        TIMING_ERROR: 'TIMING_ERROR',
        INTEGRATION_FAILED: 'INTEGRATION_FAILED'
    }
};

// Export all constants
module.exports = {
    KP_CONSTANTS,
    NADI_CONSTANTS,
    LAL_KITAB_CONSTANTS,
    VARSHA_CONSTANTS,
    ADVANCED_CONSULTATION_CONSTANTS
};